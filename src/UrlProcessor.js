import {
  AppRegistry,
  FetchAppData,
  Unzip,
  LOG
} from '@webrcade/app-common'

import * as Drop from './Drop';
import * as Feed from './Feed';
import GameRegistry from './GameRegistry';
import { Global } from './Global';

class Processor {
  constructor(catId, urls) {
    this.total = urls.length;
    this.succeeded = 0;
    this.failed = 0;
    this.catId = catId;
    this.urls = urls;
    this.allExtensions = 
      // dotted and unique
      AppRegistry.instance.getAllExtensions(true, false);
    this.allExtensionsNonUnique = 
      // dotted and non-unique
      AppRegistry.instance.getAllExtensions(true, true);
    console.log(this.allExtensions);
    console.log(this.allExtensionsNonUnique);
  }

  async processZip(blob) {
    const uz = new Unzip();
    const unzipBlob = await uz.unzip(
      blob, this.allExtensionsNonUnique, this.allExtensions); 
    const name = uz.getName();
    const parts = name ? this.getNameParts(name) : null;

    return [unzipBlob, 
      parts ? parts[0] : null, 
      parts ? parts[1] : null
    ];
  }

  async processUrl(url, nameParts) {
    let title = nameParts[0];
    let ext = nameParts[1];
    let registryGame = {};

    // Check for extension from URL
    let type = AppRegistry.instance.getTypeForExtension(ext);
    if (type) {
      LOG.info("Found type based on extension.");
    }

    // Fetch the file
    const fad = new FetchAppData(url);
    const res = await fad.fetch();

    if (res.ok) {
      // Capture content disposition 
      const headers = fad.getHeaders(res);      
      const disposition = headers['content-disposition'];
      if (disposition) {
        const matches = /.*filename="(.*)".*/gmi.exec(disposition);
        if (matches.length > 1) {
          let match = matches[1];
          match = match.trim();
          if (match.length > 0) {
            // Update name parts based on content disposition
            const parts = this.getNameParts(match);
            title = parts[0];
            ext = parts[1];

            // Check for type from content disposition (if not already resolved)
            if (!type) {
              type = AppRegistry.instance.getTypeForExtension(ext);
              if (type) {
                LOG.info("Found type in content disposition.");
              }    
            }
          }
        }
      }
      
      let blob = await res.blob();      
      if (blob.size === 0) {
        LOG.info("File size is 0.");
        return null;
      }

      // Check for zip, no-op if it is non-zip
      const zipRes = await this.processZip(blob);
      blob = zipRes[0];
      if (zipRes[1] && zipRes[2]) {
        // Update name based on file found in zip
        title = zipRes[1];
        ext = zipRes[2];

        // Check for type from zip (if not already resolved)
        if (!type) {
          type = AppRegistry.instance.getTypeForExtension(ext);
          if (type) {
            LOG.info("Found type in zip.");
          }
        }
      }  

      // Check for type in magic (if not already resolved)      
      if (!type) {        
        const abuffer = await new Response(blob).arrayBuffer();
        type = AppRegistry.instance.testMagic(new Uint8Array(abuffer));              
        if (type) {
          LOG.info("Found type in magic.")
        }
      }
      
      const iMd5 = await AppRegistry.instance.getMd5(blob, type);
      LOG.info(iMd5);      
      registryGame = await GameRegistry.find(iMd5);
      LOG.info(registryGame);
    }

    const game = {
      ...registryGame,
      props: {
        rom: url
      }
    };    

    if (!game.type && type) {
      game.type = type.key;
    }
    if (!game.title && title) {
      game.title = title;
    }

    return(game.type && game.title ? game : null);
  }

  getNameParts(url) {
    let title = decodeURIComponent(url);
    if (title.indexOf('/') !== -1) {
      title = /[^/]*$/.exec(title)[0];
    }
    let ext = "";
    if (title.indexOf('.') !== -1) {
      ext = title.split('.').pop();
    }
    if (ext.length > 0) {
      title = title.substring(0, title.length - ext.length - 1);
    }
    return [title, ext];
  }

  normalize(url) {
    const urlLower = url.toLowerCase();

    // Check for Dropbox
    const DB_PREFIX = "https://www.dropbox.com/";
    if (urlLower.substring(0, DB_PREFIX.length) === DB_PREFIX) {
      url = "https://dl.dropboxusercontent.com/" + url.substring(DB_PREFIX.length);
      url = url.split('?')[0];
      console.log("Dropbox url: '" + url + "'");
    }

    return url;
  }

  async process() {
    const urls = this.urls;
    Global.openBusyScreen(true);

    const items = [];
    try {
      const len = urls.length;
      for (let i = 0; i < urls.length; i++) {
        let url = urls[i];
        try {
          url = this.normalize(url);
          const nameParts = this.getNameParts(url);
          console.log(nameParts);

          Global.openBusyScreen(true,
            len > 1 ?
              `Analyzing ${i + 1} of ${len}...` :
              "Analyzing...");

          const item = await this.processUrl(url, nameParts);
          if (item) {
            this.succeeded++;
            items.push(item);
          }
        } catch (e) {
          LOG.error('Error processing URL: ' + url + ", " + e);
        }
      }

      if (items.length > 0) {
        Global.openBusyScreen(true, "Creating items...");
        console.log(items);
        const feed = Global.getFeed();
        Feed.addItemsToCategory(feed, this.catId, items);
        Global.setFeed({ ...feed });          
      }
    } catch (e) {
      LOG.error('Error processing URLs: ' + e);
    } finally {
      Global.openBusyScreen(false);
    }

    const failed = this.total - this.succeeded;
    console.log("Succeeded: " + this.succeeded + ", Failed: " + failed);

    const failureMessage = (fcount) => {
      if (fcount === 1) {
        return `A failure occurred attempting to add the item.`;
      } else {
        return `Failures occurred attempting to add all items.`;
      }
    }

    const successMessage = (scount) => {
      if (scount === 1) {
        return `Successfully added the item.`;
      } else {
        return `Successfully added ${scount} new items.`;
      }
    }

    let message = null;
    let severity = "success";
    if (this.succeeded > 0 && failed > 0) {
      message = `Successfully added ${this.succeeded} new item${this.succeeded > 1 ? 's' : ''}, Failures occurred on ${failed} item${failed > 1 ? 's' : ''}.`;
      severity = 'warning';
    } else if (this.succeeded > 0) {
      message = successMessage(this.succeeded);
    } else if (failed > 0) {
      message = failureMessage(failed);
      severity = 'error';
    }
    if (message) {
      Global.displayMessage(message, severity);
    }
  }
}

let dropHandlerEnabled = true;

const enableDropHandler = (enable) => {
  dropHandlerEnabled = enable;
}

const dropHandler = (e) => {
  e.preventDefault();
  if (dropHandlerEnabled) {
    e.preventDefault();
    Drop.dropHandler(e, (text) => { process([text]); });
  }
};

const process = (urls) => {
  const catId = Global.getFeedCategoryId();
  if (catId) {
    new Processor(catId, urls).process();
  }
}

export { process, dropHandler, enableDropHandler };