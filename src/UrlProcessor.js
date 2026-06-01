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

import * as WrcCommon from '@webrcade/app-common';
import * as Drop from './Drop';
import { processDroppedItems } from './LocalFileProcessor';
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

  async _buildGame(registryGame, type, title, romUrl = null) {
    const titleFromName = registryGame._titleFromName ?? false;
    if (registryGame._titleFromName) delete registryGame._titleFromName;

    let regProps = {};
    if (registryGame.props) {
      regProps = { ...registryGame.props };
      delete registryGame.props;
    }

    const game = {
      ...registryGame,
      props: {
        ...(romUrl ? { rom: romUrl } : {}),
        ...regProps,
      },
    };

    if (!game.type && type) game.type = type.key;

    let titleFromReg = true;
    if (!game.title && !titleFromName && title) {
      game.title = title;
      titleFromReg = false;
    } else if (titleFromName && title) {
      // Hash miss + title lookup — use filename title to differentiate variants
      game.title = title;
      game.longTitle = title;
      titleFromReg = false;
    }

    if (this.recordTitleSource) game._titleFromRegistry = titleFromReg;

    if (game.type) {
      const defs = AppRegistry.instance.getDefaultsForType(game.type);
      if (defs.media) {
        game.props.uid = uuidv4();
        if (romUrl) game.props.media = [romUrl];
        delete game.props.rom;
        const metadata = await GameRegistry.getMetaDataByMediaTitle(game.type, game.title);
        // console.log(metadata);
        if (metadata) {
          if (metadata.title)       game.title = metadata.title;
          if (metadata.description) game.description = metadata.description;
          if (metadata.thumbnail)   game.thumbnail = metadata.thumbnail;
          if (metadata.background) {
            game.background = metadata.background;
            game.backgroundPixelated = true;
          }
        }
      }
    }

    return (game.type && game.title ? game : null);
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

          // Fallback to title lookup if hash miss
          if (!registryGame?.type && type && title) {
            const meta = await GameRegistry.getMetaDataByMediaTitle(type.key, title);
            if (meta) registryGame = { ...meta, _titleFromName: true };
          }
        }
        if (isDebug) {
          LOG.info(registryGame);
        }
      }
    }

    return this._buildGame(registryGame, type, title, url);

    // let regProps = {}
    // if (registryGame.props) {
    //   regProps = {...registryGame.props};
    //   delete registryGame.props;
    // }

    // const game = {
    //   ...registryGame,
    //   props: {
    //     rom: url,
    //     ...regProps
    //   }
    // };

    // if (!game.type && type) {
    //   game.type = type.key;
    // }

    // let titleFromReg = true;
    // if (!game.title && title) {
    //   game.title = title;
    //   titleFromReg = false;
    // }
    // if (this.recordTitleSource) {
    //   game._titleFromRegistry = titleFromReg;
    // }

    // // If the type supports media, remove rom and add media
    // if (game.type) {
    //   const defs = AppRegistry.instance.getDefaultsForType(game.type);
    //   if (defs.media) {
    //     game.props.media = [url];
    //     game.props.uid = uuidv4();
    //     const metadata = await GameRegistry.getMetaDataByMediaTitle(game.type, game.title);
    //     console.log(metadata);
    //     if (metadata) {
    //       if (metadata.title) {
    //         game.title = metadata.title;
    //       }
    //       if (metadata.description) {
    //         game.description = metadata.description;
    //       }
    //       if (metadata.thumbnail) {
    //         game.thumbnail = metadata.thumbnail;
    //       }
    //       if (metadata.background) {
    //         game.background = metadata.background;
    //         game.backgroundPixelated = true;
    //       }
    //     }
    //     delete game.props.rom;
    //   }
    // }

    // return (game.type && game.title ? game : null);
  }

  async processBlob (blob, filename, extension, defaultType = null, skipHash = false) {
    const _t0 = isDebug ? performance.now() : 0;
    const _mb = (b) => `${(b / (1024*1024)).toFixed(2)} MB`;
    if (isDebug) console.log(`[processBlob] START  "${filename}" ext=${extension} size=${_mb(blob.size)} skipHash=${skipHash} defaultType=${defaultType}`);

    let title = filename;
    let ext = extension;
    let registryGame = {};

    let type = AppRegistry.instance.getTypeForExtension(ext);
    if (type) {
      if (isDebug) console.log(`[processBlob] type from extension: ${type.key}`);
      if (isDebug) LOG.info("Found type based on extension.");
    }

    if (blob.size === 0) {
      LOG.info("File size is 0.");
      return null;
    }

    const MAX_HASH_SIZE = 512 * 1024 * 1024; // 512 MB — skip registry hash lookup above this size
    const MAX_ZIP_SIZE  = 256 * 1024 * 1024; // 256 MB — skip zip extraction above this size (covers all but the largest DS carts; oversized zips are almost certainly multi-file archives)

    const gameByName = await GameRegistry.findByName(title, ext, blob);
    if (gameByName) {
      if (isDebug) console.log(`[processBlob] found by name in ${(performance.now()-_t0).toFixed(0)}ms`);
      registryGame = gameByName;
    } else {
      let zipFailed = false;
      let extractedTinyRelativeToZip = false;
      const originalZipSize = blob.size;
      try {
        // Skip zip extraction for large disc images (e.g. .chd, .pbp) — they are
        // never zipped ROMs and reading them just for zip detection is very slow.
        // Also skip for files exceeding MAX_ZIP_SIZE — legitimately zipped ROMs are
        // never that large (DS max cart is 256 MB); anything bigger is almost
        // certainly a multi-file archive package and is handled by the type dialog.
        if (skipHash || blob.size > MAX_ZIP_SIZE) {
          if (isDebug) console.log(`[processBlob] skipping zip extraction — ${skipHash ? 'skipHash=true' : `size ${_mb(blob.size)} > MAX_ZIP_SIZE ${_mb(MAX_ZIP_SIZE)}`}`);
          throw new Error('skip');
        }
        if (isDebug) console.log(`[processBlob] calling processZip...`);
        const _tz = isDebug ? performance.now() : 0;
        const zipRes = await this.processZip(blob);
        if (isDebug) console.log(`[processBlob] processZip done in ${(performance.now()-_tz).toFixed(0)}ms — extracted name: ${zipRes[1] ?? '(none)'}`);
        const extractedBlob = zipRes[0];
        if (zipRes[1] && zipRes[2]) {
          // Check if the extracted file is suspiciously small relative to the zip.
          // If so, and the defaultType is an archive type, the zip is likely a
          // multi-file game package (DOSBox, ScummVM) with a stray ROM-extension
          // file inside — not a real ROM zip.
          const TINY_RATIO = 0.05; // 5% threshold
          if (extractedBlob.size < originalZipSize * TINY_RATIO) {
            if (isDebug) console.log(`[processBlob] extracted blob (${_mb(extractedBlob.size)}) is tiny relative to zip (${_mb(originalZipSize)}) — treating as multi-file archive`);
            extractedTinyRelativeToZip = true;
          } else {
            blob = extractedBlob;
            title = zipRes[1];
            ext = zipRes[2];
            if (isDebug) console.log(`[processBlob] using extracted file: "${title}.${ext}" size=${_mb(blob.size)}`);
            if (!type) {
              type = AppRegistry.instance.getTypeForExtension(ext);
              if (type) {
                if (isDebug) console.log(`[processBlob] type from zip: ${type.key}`);
                if (isDebug) LOG.info("Found type in zip.");
              }
            }
          }
        } else {
          if (isDebug) console.log(`[processBlob] processZip returned no named file — keeping original blob`);
          blob = extractedBlob;
        }
      } catch (e) {
        // No recognized ROM inside the zip — keep original blob and fall through
        if (isDebug && e.message !== 'skip') {
          console.log(`[processBlob] processZip threw: ${e.message} — zipFailed=true`);
        }
        zipFailed = true;
      }

      const skipMagicForZip = (extension === 'zip' && zipFailed);
      if (!type) {
        // Skip magic-byte detection for large disc images — reading the entire
        // file into memory just to test magic bytes would be extremely slow.
        // Also skip for .zip files that failed extraction — the blob is the raw zip
        // and magic on a zip is useless (it'll just detect 'zip', not the game type).
        if (!skipHash && !skipMagicForZip) {
          if (isDebug) console.log(`[processBlob] running magic detection on ${_mb(blob.size)} blob...`);
          const _tm = isDebug ? performance.now() : 0;
          const abuffer = await new Response(blob).arrayBuffer();
          type = AppRegistry.instance.testMagic(new Uint8Array(abuffer));
          if (isDebug) console.log(`[processBlob] magic done in ${(performance.now()-_tm).toFixed(0)}ms — type: ${type?.key ?? '(none)'}`);
          if (type && isDebug) LOG.info("Found type in magic.");
        } else {
          if (isDebug) console.log(`[processBlob] skipping magic detection (${skipHash ? 'skipHash=true' : 'zip extraction failed'})`);
        }
      }

      if (!type && defaultType) {
        const defs = AppRegistry.instance.getDefaultsForType(defaultType) ?? {};
        const isArchiveType = 'archive' in defs;
        // Block defaultType fallback when we're confident this isn't an archive game:
        //   - zip had no recognized content at all (zipFailed) and type isn't archive-based
        //   - zip had a recognized file but it was tiny relative to the zip,
        //     suggesting a stray ROM-extension file in a multi-file package, but
        //     only override toward archive if defaultType actually is archive-based
        const block = (zipFailed && !isArchiveType) ||
                      (extractedTinyRelativeToZip && !isArchiveType);
        if (!block) {
          type = AppRegistry.instance.APP_TYPES[defaultType] ?? null;
          if (isDebug && type) console.log(`[processBlob] type from defaultType fallback: ${type.key}`);
          if (type && isDebug) LOG.info("Found type from category default.");
        } else {
          if (isDebug) console.log(`[processBlob] defaultType fallback blocked (zipFailed=${zipFailed} extractedTiny=${extractedTinyRelativeToZip} isArchiveType=${isArchiveType})`);
        }
      }

      // Also skip hashing if the file is a .zip that failed extraction — hashing
      // the raw zip archive is pointless since we'd never find it in the registry.
      const skipHashForZip = (extension === 'zip' && zipFailed);
      if (!skipHash && !skipHashForZip && blob.size <= MAX_HASH_SIZE) {
        if (isDebug) console.log(`[processBlob] hashing ${_mb(blob.size)} blob...`);
        const _th = isDebug ? performance.now() : 0;
        const iMd5 = await AppRegistry.instance.getMd5(blob, type);
        if (isDebug) console.log(`[processBlob] hash done in ${(performance.now()-_th).toFixed(0)}ms — md5=${iMd5}`);
        if (isDebug) LOG.info(iMd5);
        registryGame = await GameRegistry.find(iMd5);
        // Fallback to title lookup if hash miss
        if (!registryGame?.type && type && title) {
          const meta = await GameRegistry.getMetaDataByMediaTitle(type.key, title);
          if (meta) registryGame = { ...meta, _titleFromName: true };
        }
      } else if (isDebug) {
        if (skipHash) {
          console.log(`[processBlob] skipping hash — extension is in SKIP_HASH_EXTENSIONS`);
          LOG.info('Skipping hash lookup — extension is in SKIP_HASH_EXTENSIONS.');
        } else if (skipHashForZip) {
          console.log(`[processBlob] skipping hash — zip extraction failed, no ROM found inside`);
          LOG.info('Skipping hash lookup — zip extraction failed, no ROM found inside.');
        } else {
          console.log(`[processBlob] skipping hash — size ${_mb(blob.size)} exceeds ${_mb(MAX_HASH_SIZE)}`);
          LOG.info(`Skipping hash lookup — file exceeds ${MAX_HASH_SIZE / (1024 * 1024)} MB.`);
        }
      }
    }
    if (isDebug) LOG.info(registryGame);

    const result = blobProcessor._buildGame(registryGame, type, title);
    if (isDebug) console.log(`[processBlob] DONE  "${filename}" in ${(performance.now()-_t0).toFixed(0)}ms — type=${type?.key ?? '(none)'}`);
    return result;
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

const isDropHandlerEnabled = () => dropHandlerEnabled;

const enableDropHandler = (enable) => {
  dropHandlerEnabled = enable;
}

const dropHandler = (e) => {
  e.preventDefault();
  if (!dropHandlerEnabled) return;

  // Check if any dropped item is a file/folder (OS drag-and-drop)
  const items = e.dataTransfer?.items;
  if (items) {
    for (let i = 0; i < items.length; i++) {
      if (items[i].kind === 'file') {
        if (!WrcCommon.settings.isCloudStorageEnabled()) {
          Global.displayMessage(
            'Cloud storage must be enabled to add local files and folders.',
            'warning'
          );
        } else {
          const feed = Global.getFeed();
          const catId = Global.getFeedCategoryId();
          const cat = Feed.getCategory(feed, catId);
          Global.openBusyScreen(true, 'Reading files...');
          processDroppedItems(items, cat, feed);
        }
        return;
      }
    }
  }

  // No files — fall through to URL drop handling
  Drop.dropHandler(e, (text) => { process([text]); });
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

// Analyze items that may span multiple categories (used by search)
const analyzeItems = (itemIds) => {
  const feed = Global.getFeed();
  const urls = new Set();
  const urlToItems = new Map();

  // Group item IDs by their category
  const catMap = new Map();
  itemIds.forEach(itemId => {
    const cat = Feed.getCategoryForItem(feed, itemId);
    if (cat) {
      if (!catMap.has(cat.id)) catMap.set(cat.id, []);
      catMap.get(cat.id).push(itemId);
    }
  });

  catMap.forEach((ids, catId) => {
    _updateAnalyzeUrls(catId, ids, urls, urlToItems);
  });
  _analyze(urls, urlToItems);
}

const blobProcessor = new Processor([], null);

const processBlob = async (blob, filename, extension, skipHash = false) => {
  return await blobProcessor.processBlob(blob, filename, extension, null, skipHash);
}

export {
  analyze,
  analyzeCategories,
  analyzeItems,
  process,
  dropHandler,
  enableDropHandler,
  isDropHandlerEnabled,
  processBlob,
};