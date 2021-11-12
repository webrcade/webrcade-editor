import {
  AppRegistry,
  FetchAppData,
  Unzip,
  LOG
} from '@webrcade/app-common'

import * as Feed from './Feed';
import { Global } from './Global';

class Processor {
  constructor(catId, urls) {
    this.total = urls.length;
    this.succeeded = 0;
    this.failed = 0;
    this.catId = catId;
    this.urls = urls;
    this.allExtensions = AppRegistry.instance.getAllExtensions();
    console.log(this.allExtensions);
  }

  async processZip(url, nameParts) {
    const uz = new Unzip();
    const res = await new FetchAppData(url).fetch();
    console.log(res);

    if (res.ok) {
      const blob = await res.blob();
      await uz.unzip(blob, this.allExtensions);
      const name = uz.getName();
      const parts = this.getNameParts(name);
      const ext = parts[1];

      const type = AppRegistry.instance.getTypeForExtension(ext);
      return type ? [parts[0], type] : null;
    }
    return null;
  }

  async processUrl(url, nameParts) {
    let title = nameParts[0];
    const ext = nameParts[1];

    let type = AppRegistry.instance.getTypeForExtension(ext);

    if (!type) {
      const res = await this.processZip(url, nameParts);
      if (res) {
        title = res[0];
        type = res[1];
      }
    }

    return(type ? {
      title: title, type: type.key,
      props: {
        rom: url
      }
    } : null);
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
    console.log('HANDLE DROP!');
    if (e.dataTransfer.items) {
      for (let i = 0; i < e.dataTransfer.items.length; i++) {
        const item = e.dataTransfer.items[i];
        if (item.kind === 'string' &&
          (item.type.match('^text/uri-list') || item.type.match('^text/plain'))) {
          item.getAsString(function (url) {
            process([url])
          });
          break;
        }
      }
    }
  }
}

const process = (urls) => {
  const catId = Global.getFeedCategoryId();
  if (catId) {
    new Processor(catId, urls).process();
  }
}

export { process, dropHandler, enableDropHandler };