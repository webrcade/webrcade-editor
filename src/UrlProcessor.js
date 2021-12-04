import {
  AppRegistry,
  FetchAppData,
  Unzip,
  LOG,
  isValidString
} from '@webrcade/app-common'

import * as Drop from './Drop';
import * as Feed from './Feed';
import GameRegistry from './GameRegistry';
import { Global } from './Global';

class Processor {
  constructor(urls, processor) {
    this.total = urls.length;
    this.processor = processor;
    this.failed = 0;
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
    let message = null;

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
            items.push(item);
          }
        } catch (e) {
          LOG.error('Error processing URL: ' + url + ", " + e);
        }
      }

      message = this.processor(items);
    } catch (e) {
      LOG.error('Error processing URLs: ' + e);
    } finally {
      Global.openBusyScreen(false);
    }

    if (message) {
      Global.displayMessage(message[0], message[1]);
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

const getMessage = (succeeded, failed, isAdd = true) => {
  const opName = isAdd ? 'add' : 'update';
  const opedName = isAdd ? 'added' : 'updated';


  const failureMessage = (fcount) => {
    if (fcount === 1) {
      return `A failure occurred attempting to ${opName} the item.`;
    } else {
      return `Failures occurred attempting to ${opName} all items.`;
    }
  }

  const successMessage = (scount) => {
    if (scount === 1) {
      return `Successfully ${opedName} the item.`;
    } else {
      return `Successfully ${opedName} ${scount} items.`;
    }
  }

  let message = null;
  let severity = "success";
  if (succeeded > 0 && failed > 0) {
    message = `Successfully ${opedName} ${succeeded} item${succeeded > 1 ? 's' : ''}, Failures occurred on ${failed} item${failed > 1 ? 's' : ''}.`;
    severity = 'warning';
  } else if (succeeded > 0) {
    message = successMessage(succeeded);
  } else if (failed > 0) {
    message = failureMessage(failed);
    severity = 'error';
  }

  return [message, severity];
}

const process = (urls) => {
  const catId = Global.getFeedCategoryId();
  if (catId) {
    new Processor(urls,
      (items) => {
        let succeeded = 0;
        if (items.length > 0) {
          Global.openBusyScreen(true, "Creating items...");
          console.log(items);
          try {
            const feed = Global.getFeed();
            Feed.addItemsToCategory(feed, catId, items);
            Global.setFeed({ ...feed });                    
            succeeded = items.length;
          } catch(e) {
            LOG.error("Error creating items" + e);
          }
        }
        return getMessage(succeeded, urls.length - succeeded);
      }).process();
  }  
}

const analyze = (categoryId, itemIds) => {
  const feed = Global.getFeed();
  const urls = new Set();
  const urlToItems = new Map();

  // Create list of URLs to process
  // Map items by their URL
  for (let i = 0; i < itemIds.length; i++) {
    const itemId = itemIds[i];
    const item = Feed.getItem(feed, categoryId, itemId);
    if (item && item.props.rom) {
      const romUrl = item.props.rom.trim();
      if (romUrl.length > 0) {
        // Track unique URLs
        urls.add(romUrl);
        // Map items by their URL
        let items = urlToItems.get(romUrl);
        if (!items) {
          items = [item];
        } else {
          items.push(item);
        }
        urlToItems.set(romUrl, items);
      }      
    }
  }

  const urlArr = Array.from(urls);
  if (urlArr.length > 0) {
    new Processor(urlArr,
      (items) => {
        let updatedItems = 0;
        if (items.length > 0) {
          Global.openBusyScreen(true, "Updating items...");

          // Walk all of the analysis results
          for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const currentUrl = item.props.rom;
            delete item.props;

            // Get the items to update
            const updateItems = urlToItems.get(currentUrl);
            for (let j = 0; j < updateItems.length; j++) {
              try {
                const updateItem = updateItems[j];
                const props = [
                  'title', 'longTitle', 'description', 'background', 
                  'thumbnail', 'type'
                ];

                // Copy props from results to item to update
                for (let x = 0; x < props.length; x++) {
                  const prop = props[x];
                  if (isValidString(item[prop])) {
                    if (prop === 'type' && (updateItem[prop] !== item[prop])) {
                      // Reset props for item if type has changed
                      LOG.info('Type has changed.');
                      updateItem.props = {rom: currentUrl};
                    } else if (prop === 'background') {
                      // If background was found, force pixelated
                      updateItem.backgroundPixelated = true;
                    }
                    updateItem[prop] = item[prop];                  
                  }  
                }                
                updatedItems++;
              } catch(e) {
                LOG.error("Error updating item: " + e);
              }
            }
          }
          Global.setFeed({ ...feed });
        }
        return getMessage(updatedItems, itemIds.length - updatedItems, false);
      }).process();
  }
}

export { 
  analyze,
  process, 
  dropHandler, 
  enableDropHandler 
};