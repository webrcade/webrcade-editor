import {
  AppRegistry,
  FetchAppData,
  Unzip,
  LOG,
  isValidString,
  md5,
  remapUrl,
  romNameScorer,
  getContentDispositionFilename,
  uuidv4
} from '@webrcade/app-common'

import * as Drop from './Drop';
import * as Feed from './Feed';
import GameRegistry from './GameRegistry';
import { Global } from './Global';

const isDebug = Global.isDebug();

const MD5_PREFIX = "_md5_:";

class Processor {
  constructor(urls, processor, names) {
    this.total = urls.length;
    this.processor = processor;
    this.recordTitleSource = false;
    this.failed = 0;
    this.urls = urls;
    this.names = names;
    this.allExtensions =
      // dotted and unique
      AppRegistry.instance.getAllExtensions(true, false);
    this.allExtensionsNonUnique =
      // dotted and non-unique
      AppRegistry.instance.getAllExtensions(true, true);

    if (isDebug) {
      LOG.info(this.allExtensions);
      LOG.info(this.allExtensionsNonUnique);
    }
  }

  setRecordTitleSource(record) {
    this.recordTitleSource = record;
    return this;
  }

  async processZip(blob) {
    const uz = new Unzip().setDebug(isDebug);
    const unzipBlob = await uz.unzip(
      blob, this.allExtensionsNonUnique, this.allExtensions, romNameScorer);
    const name = uz.getName();
    const parts = name ? this.getNameParts(name) : null;

    return [unzipBlob,
      parts ? parts[0] : null,
      parts ? parts[1] : null
    ];
  }

  async processUrl(url, nameParts, name) {
    let title = nameParts[0];
    let ext = nameParts[1];
    let registryGame = {};

    // Check for extension from URL
    let type = AppRegistry.instance.getTypeForExtension(ext);
    if (type && isDebug) {
      LOG.info("Found type based on extension.");
    }

    if (url.indexOf(MD5_PREFIX) !== -1) {
      const md5 = url.substring(MD5_PREFIX.length);
      registryGame = await GameRegistry.find(md5);
    } else {
      // Fetch the file
      const fad = new FetchAppData(url);
      const res = await fad.fetch();

      if (res.ok) {
        if (name) {
          const parts = this.getNameParts(name);
          title = parts[0];
          ext = parts[1];
          // Check for type from content disposition (if not already resolved)
          if (!type) {
            type = AppRegistry.instance.getTypeForExtension(ext);
            if (type && isDebug) {
              LOG.info("Found type from name.");
            }
          }
        } else {
          // Capture content disposition
          const headers = fad.getHeaders(res);
          if (headers) {
            const match = getContentDispositionFilename(headers);
            if (match) {
              // Update name parts based on content disposition
              const parts = this.getNameParts(match);
              title = parts[0];
              ext = parts[1];

              // Check for type from content disposition (if not already resolved)
              if (!type) {
                type = AppRegistry.instance.getTypeForExtension(ext);
                if (type && isDebug) {
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

        const gameByName = await GameRegistry.findByName(title, ext, blob);
        if (gameByName) {
          registryGame = gameByName;
        } else {
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
              if (type && isDebug) {
                LOG.info("Found type in zip.");
              }
            }
          }

          // Check for type in magic (if not already resolved)
          if (!type) {
            const abuffer = await new Response(blob).arrayBuffer();
            type = AppRegistry.instance.testMagic(new Uint8Array(abuffer));
            if (type && isDebug) {
              LOG.info("Found type in magic.")
            }
          }

          const iMd5 = await AppRegistry.instance.getMd5(blob, type);
          if (isDebug) {
            LOG.info(iMd5);
          }
          registryGame = await GameRegistry.find(iMd5);
        }
        if (isDebug) {
          LOG.info(registryGame);
        }
      }
    }

    let regProps = {}
    if (registryGame.props) {
      regProps = {...registryGame.props};
      delete registryGame.props;
    }

    const game = {
      ...registryGame,
      props: {
        rom: url,
        ...regProps
      }
    };

    if (!game.type && type) {
      game.type = type.key;
    }

    let titleFromReg = true;
    if (!game.title && title) {
      game.title = title;
      titleFromReg = false;
    }
    if (this.recordTitleSource) {
      game._titleFromRegistry = titleFromReg;
    }

    // If the type supports media, remove rom and add media
    if (game.type) {
      const defs = AppRegistry.instance.getDefaultsForType(game.type);
      if (defs.media) {
        game.props.media = [url];
        game.props.uid = uuidv4();
        const metadata = await GameRegistry.getMetaDataByMediaTitle(game.type, game.title);
        console.log(metadata);
        if (metadata) {
          if (metadata.title) {
            game.title = metadata.title;
          }
          if (metadata.description) {
            game.description = metadata.description;
          }
          if (metadata.thumbnail) {
            game.thumbnail = metadata.thumbnail;
          }
          if (metadata.background) {
            game.background = metadata.background;
            game.backgroundPixelated = true;
          }
        }
        delete game.props.rom;
      }
    }

    return (game.type && game.title ? game : null);
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
    return remapUrl(url);
  }

  async process() {
    const urls = this.urls;
    const names = this.names;
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
          if (isDebug) {
            LOG.info(nameParts);
          }
          Global.openBusyScreen(true,
            len > 1 ?
              `Analyzing ${i + 1} of ${len}...` :
              "Analyzing...");

          const item = await this.processUrl(url, nameParts, names && names.length > i ? names[i] : null);
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
    let addManually = "";
    if (isAdd) {
      const themName = (fcount === 1 ? 'it' : 'them');
      addManually = ` Possibly try adding ${themName} manually.`;
    }

    if (fcount === 1) {
      return `Unable to ${opName} 1 item.${addManually}`;
    } else {
      return `Unable to ${opName} ${fcount} items.${addManually}`;
    }
  }

  const successMessage = (scount) => {
    if (scount === 1) {
      return `Successfully ${opedName} 1 item.`;
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
  } else if (!isAdd && succeeded === 0) {
    message = "No items were updated.";
    severity = 'warning';
  }

  return [message, severity];
}

const process = (urls, names) => {
  const catId = Global.getFeedCategoryId();
  if (catId) {
    new Processor(urls,
      (items) => {
        let succeeded = 0;
        if (items.length > 0) {
          Global.openBusyScreen(true, "Creating items...");
          if (isDebug) {
            LOG.info(items);
          }
          try {
            const feed = Global.getFeed();
            Feed.addItemsToCategory(feed, catId, items);
            Global.setFeed({ ...feed });
            succeeded = items.length;
          } catch (e) {
            LOG.error("Error creating items" + e);
          }
        }
        return getMessage(succeeded, urls.length - succeeded);
      }, names).process();
  }
}

const _updateAnalyzeUrls = (categoryId, itemIds, urls, urlToItems) => {
  const feed = Global.getFeed();
  // Create list of URLs to process
  // Map items by their URL
  for (let i = 0; i < itemIds.length; i++) {
    const itemId = itemIds[i];
    const item = Feed.getItem(feed, categoryId, itemId);
    if (item) {
      let romUrl = "";
      if (item.props.rom) {
        romUrl = item.props.rom.trim();
        // Remap URL (fix bug when adding already remapped urls.)
        romUrl = remapUrl(romUrl);
      } else if (item.props.game) {
        romUrl = MD5_PREFIX + md5(item.props.game.trim());
      }
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
}

const _analyze = (urls, urlToItems) => {
  const feed = Global.getFeed();
  const urlArr = Array.from(urls);

  new Processor(urlArr,
    (items) => {
      let updatedItems = 0;
      let errors = 0;
      if (items.length > 0) {
        Global.openBusyScreen(true, "Updating items...");

        // Walk all of the analysis results
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          const currentUrl = item.props.rom;
          const titleFromReg = item._titleFromRegistry;

          if (currentUrl.indexOf(MD5_PREFIX) !== -1) {
            // Remove rom for MD5 hacks (doom, etc.)
            delete item.props.rom;
          }

          // Get the items to update
          const updateItems = urlToItems.get(currentUrl);
          for (let j = 0; j < updateItems.length; j++) {
            try {
              let newType = false;
              const updateItem = updateItems[j];
              const props = [
                'title', 'longTitle', 'description', 'background',
                'thumbnail', 'type', 'props' /* Props is always last */
              ];

              // Copy props from results to item to update
              let updated = false;
              for (let x = 0; x < props.length; x++) {
                const prop = props[x];

                if (prop === 'title' && !titleFromReg) {
                  continue;
                }

                // Copy properties if applicable
                if (prop === 'props') {
                  if (newType) {
                    updateItem.props = {...item.props}
                    LOG.info("Copying props (new type).");
                  }

                  // if (!item.props) {
                  //   item.props = {};
                  // }
                  // if (!updateItem.props) {
                  //   updateItem.props = {};
                  // }
                  // if (Object.keys(item.props).length === Object.keys(updateItem.props).length) {
                  //   let diff = false;
                  //   for (let p in item.props) {
                  //     if (item.props[p] !== updateItem.props[p]) {
                  //       diff = true;
                  //       break;
                  //     }
                  //   }
                  //   if (diff) {
                  //     updated = true;
                  //     updateItem.props = {...item.props}
                  //   }
                  // } else {
                  //   updated = true;
                  //   updateItem.props = {...item.props}
                  // }
                  // Move to the next property
                  continue;
                }

                if (isValidString(item[prop]) && (updateItem[prop] !== item[prop])) {
                  updated = true;
                  if (prop === 'type' && (updateItem[prop] !== item[prop])) {
                    // Reset props for item if type has changed
                    LOG.info('Type has changed.');
                    newType = true;
                    updateItem.props = { rom: currentUrl };
                  } else if (prop === 'background') {
                    // If background was found, force pixelated
                    updateItem.backgroundPixelated = true;
                  }
                  updateItem[prop] = item[prop];
                }
              }
              if (updated) updatedItems++;
            } catch (e) {
              errors++;
              LOG.error("Error updating item: " + e);
            }
          }
        }
        Global.setFeed({ ...feed });
      }
      return getMessage(updatedItems, errors, false);
    }).setRecordTitleSource(true).process();
}

const analyzeCategories = (categoryIds) => {
  const feed = Global.getFeed();
  const urls = new Set();
  const urlToItems = new Map();

  for (let i = 0; i < categoryIds.length; i++) {
    const catId = categoryIds[i];
    const cat = Feed.getCategory(feed, catId);
    const itemIds = [];
    if (cat.items) {
      for (let j = 0; j < cat.items.length; j++) {
        itemIds.push(cat.items[j].id);
      }
      if (itemIds.length > 0) {
        _updateAnalyzeUrls(catId, itemIds, urls, urlToItems);
      }
    }
  }
  _analyze(urls, urlToItems);
}

const analyze = (categoryId, itemIds) => {
  const urls = new Set();
  const urlToItems = new Map();

  _updateAnalyzeUrls(categoryId, itemIds, urls, urlToItems);
  _analyze(urls, urlToItems);
}

export {
  analyze,
  analyzeCategories,
  process,
  dropHandler,
  enableDropHandler
};