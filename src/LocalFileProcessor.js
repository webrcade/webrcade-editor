/**
 * LocalFileProcessor
 *
 * Handles the local file upload pipeline:
 *   file selection → filtering → analyzing (hash + type) → uploading (TODO)
 *
 * Entry points:
 *   openLocalFilePicker(onFiles)   — triggers the OS file picker
 *   openLocalFolderPicker(onFiles) — triggers the OS directory picker
 *   processFiles(files, cat, feed) — runs the pipeline on an array/FileList of Files
 */

import * as WrcCommon from '@webrcade/app-common';
import { AppRegistry, uuidv4 } from '@webrcade/app-common';
import { Global, GlobalHolder } from './Global';
import { setDefaultsForType } from './components/item-editor/ItemEditor';
import * as Feed from './Feed';
import { processBlob } from './UrlProcessor';
import { ADD_LOCAL_STATES } from './components/AddLocalFilesDialog';
import { resolveCategoryItemsPath } from './Feed';
import { CloudStorage } from './components/cloud/generate-manifest/CloudStorage';
import Repackage from './components/tools/repackage/Repackage';

const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024; // 2 GB — files larger than this are skipped

// Extensions for which hashing should be skipped — these are large disc images
// that take forever to hash and are never matched via the game registry.
const SKIP_HASH_EXTENSIONS = new Set(['.chd', '.pbp']);

async function isBinaryFile(file, sampleSize = 8192) {
  // Only read the first 8KB — plenty for binary detection
  const slice = file.slice(0, sampleSize);
  const buf = await slice.arrayBuffer();
  const bytes = new Uint8Array(buf);

  for (let i = 0; i < bytes.length; i++) {
    if (bytes[i] === 0) return true;
  }
  return false;
}

let _cancelRequested = false;

export function cancelProcessing() {
  _cancelRequested = true;
}

/**
 * Sets the public URL on the correct props field based on the type's defaults:
 *   discs   → props.discs = [url]
 *   archive → props.archive = url
 *   media   → props.media  = [url]
 *   (else)  → props.rom    = url
 */
function applyUrlToGame(game, url) {
  if (!game?.type || !url) return;
  const defs = AppRegistry.instance.getDefaultsForType(game.type) ?? {};
  if ('discs' in defs) {
    game.props.discs = [url];
  } else if ('archive' in defs) {
    game.props.archive = url;
  } else if ('media' in defs) {
    game.props.media = [url];
  } else {
    game.props.rom = url;
  }
}

// Extensions accepted in addition to those registered per app type.
// These have no unique type affinity — any ambiguous match goes to the
// ResolveTypesDialog rather than the defaultType fallback.
const EXTRA_VALID_EXTENSIONS = ['.bin', '.zip'];

let _idCounter = 0;

function getValidExtensions() {
  const all = WrcCommon.AppRegistry.instance.getAllExtensions(true, true);
  const ambiguous = WrcCommon.AppRegistry.instance.getAllAmbiguousExtensions(true);
  return new Set([...all, ...EXTRA_VALID_EXTENSIONS, ...ambiguous]);
}

/**
 * Recursively reads all files from a DataTransferItem directory entry.
 * @param {FileSystemDirectoryEntry} dirEntry
 * @returns {Promise<File[]>}
 */
function readDirectoryEntry(dirEntry) {
  return new Promise((resolve) => {
    const reader = dirEntry.createReader();
    const results = [];
    const readBatch = () => {
      reader.readEntries(async (entries) => {
        if (entries.length === 0) {
          resolve(results);
          return;
        }
        for (const entry of entries) {
          if (entry.isFile) {
            try {
              const file = await new Promise((res, rej) => entry.file(res, rej));
              results.push(file);
            } catch (e) {
              console.warn(`[LocalFileProcessor] Skipping inaccessible file "${entry.name}":`, e);
            }
          } else if (entry.isDirectory) {
            try {
              const subFiles = await readDirectoryEntry(entry);
              results.push(...subFiles);
            } catch (e) {
              console.warn(`[LocalFileProcessor] Skipping inaccessible directory "${entry.name}":`, e);
            }
          }
        }
        readBatch();
      }, (err) => {
        // readEntries error callback — resolve with whatever we have so far
        // so the parent Promise.all is not left hanging.
        console.warn(`[LocalFileProcessor] readEntries error in "${dirEntry.name}":`, err);
        resolve(results);
      });
    };
    readBatch();
  });
}

/**
 * Opens the OS file picker (individual files, multi-select).
 * @param {function(File[])} onFiles - called with the resolved array of Files
 */
export function openLocalFilePicker(onFiles) {
  const input = document.createElement('input');
  input.type = 'file';
  input.multiple = true;
  input.onchange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFiles(Array.from(e.target.files));
    }
  };
  input.click();
}

/**
 * Opens the OS directory picker. All files inside the chosen directory
 * (including subdirectories) are resolved and passed to onFiles.
 * @param {function(File[])} onFiles - called with the resolved array of Files
 */
export function openLocalFolderPicker(onFiles) {
  const input = document.createElement('input');
  input.type = 'file';
  input.webkitdirectory = true;
  input.multiple = true;
  input.onchange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFiles(Array.from(e.target.files));
    }
  };
  input.click();
}

/**
 * Processes files/folders dropped via OS drag-and-drop (DataTransferItemList).
 * Resolves all File objects (recursing into directories) then runs the pipeline.
 * @param {DataTransferItemList} items
 * @param {object} category
 * @param {object} feed
 */
export async function processDroppedItems(items, category, feed) {
  //console.log('[LFP:drop] processDroppedItems called, items.length:', items?.length);
  const files = [];
  const promises = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    //console.log(`[LFP:drop] item[${i}] kind=${item.kind} type=${item.type}`);
    if (item.kind !== 'file') continue;
    const entry = item.webkitGetAsEntry?.();
    //console.log(`[LFP:drop] item[${i}] entry=`, entry, 'isDirectory:', entry?.isDirectory, 'isFile:', entry?.isFile);
    if (entry) {
      if (entry.isDirectory) {
        promises.push(readDirectoryEntry(entry).then(f => {
          //console.log(`[LFP:drop] directory "${entry.name}" resolved ${f.length} files`);
          files.push(...f);
        }));
      } else {
        const file = item.getAsFile();
        //console.log(`[LFP:drop] getAsFile() for "${entry.name}":`, file);
        if (file) files.push(file);
      }
    } else {
      const file = item.getAsFile();
      //console.log(`[LFP:drop] no entry, getAsFile():`, file);
      if (file) files.push(file);
    }
  }

  if (promises.length > 0) await Promise.allSettled(promises);
  //console.error('[LFP:drop] *** Promise.all done, files:', files.length, '— calling processFiles');
  processFiles(files, category, feed);
}

/**
 * Entry point for the processing pipeline.
 * Filters files by valid extension, pushes accepted/skipped to the dialog,
 * then asynchronously analyzes each accepted file (hash + type detection).
 * @param {FileList|File[]} files    - files to process
 * @param {object}          category - the target category object
 * @param {object}          feed     - the current feed object
 */
export async function processFiles(files, category, feed) {
  const fileArray = Array.from(files);
  //console.error('[LFP:process] *** processFiles entry, fileArray.length:', fileArray.length);
  if (fileArray.length === 0) {
    //console.log('[LFP:process] no files — showing warning');
    Global.displayMessage('No accessible files were found in the dropped items.', 'warning');
    return;
  }

  const validExts = getValidExtensions();
  // Set of extensions that should bypass the defaultType fallback and go to
  // the ResolveTypesDialog when magic-byte detection returns nothing.
  const ambiguousExtSet = new Set([
    ...WrcCommon.AppRegistry.instance.getAllAmbiguousExtensions(true),
    ...EXTRA_VALID_EXTENSIONS,
  ]);

  // Separate accepted vs. skipped files
  const rawAccepted = [];
  const skipped = [];

  fileArray.forEach((file) => {
    const nameLower = file.name.toLowerCase();
    const dotIdx = nameLower.lastIndexOf('.');
    const ext = dotIdx > 0 ? nameLower.slice(dotIdx) : null;

    if (!ext) {
      // TODO: Consider whether we should allow files with no extension at all, since some ROMs do come like that.
      // For now we require an extension since it's a strong signal for valid files and we have the ResolveTypesDialog for edge cases,
      // but we could consider adding a "No extension" option to that dialog if users request it.
      skipped.push({
        id: ++_idCounter,
        filename: file.name,
        reason: 'No file extension',
      });
    } else if (!validExts.has(ext)) {
      skipped.push({
        id: ++_idCounter,
        filename: file.name,
        reason: `Unsupported extension: ${ext}`,
      });
    } else if (file.size > MAX_FILE_SIZE) {
      skipped.push({
        id: ++_idCounter,
        filename: file.name,
        reason: 'File too large (exceeds 1 GB limit)',
      });
    } else {
      rawAccepted.push(file);
    }
  });

  //console.log(
  //  `[LocalFileProcessor] accepted: ${rawAccepted.length}, skipped: ${skipped.length}` +
  //  ` → category: "${category?.title ?? '(unknown)'}"`,
  //);

  // ── Phase 1: Analysis ────────────────────────────────────────────────────
  // Show the same busy-screen progress used by URL processing.
  // No dialog yet — results accumulate in the `accepted` and `needsReview` arrays.
  // Update the busy screen message (already visible from the drop handler).
  // Yield briefly so React can repaint before the heavy loop starts.
  Global.openBusyScreen(true, 'Analyzing...');
  await new Promise(r => setTimeout(r, 50));
  const analysisStart = Date.now();
  const accepted = [];
  const needsReview = [];
  const errors = [];
  const len = rawAccepted.length;

  try {
    for (let i = 0; i < len; i++) {
      const file = rawAccepted[i];
      Global.openBusyScreen(
        true,
        len > 1 ? `Analyzing ${(i + 1).toLocaleString()} of ${len.toLocaleString()}...` : 'Analyzing...'
      );

      const dotIdx = file.name.lastIndexOf('.');
      const ext   = dotIdx > 0 ? file.name.slice(dotIdx + 1) : '';
      const extDotted = dotIdx > 0 ? file.name.slice(dotIdx).toLowerCase() : '';
      const title = dotIdx > 0 ? file.name.slice(0, dotIdx)  : file.name;
      const isAmbiguous = ambiguousExtSet.has(extDotted);

      // Skip text files — binary ROMs always contain null bytes
      if (!(await isBinaryFile(file))) {
        skipped.push({
          id: ++_idCounter,
          filename: file.name,
          reason: 'Skipped: appears to be a text file (no binary content detected)',
        });
        continue;
      }

      let game = null;
      try {
        const skipHash = SKIP_HASH_EXTENSIONS.has(extDotted);
        game = await processBlob(file, title, ext, skipHash);
        //console.log(`[LocalFileProcessor] ${file.name}:`, game);
      } catch (e) {
        console.error(`[LocalFileProcessor] Error analyzing ${file.name}:`, e);
      }

      if (game) {
        accepted.push({
            id: ++_idCounter,
            filename: file.name,
            file,
            state:       ADD_LOCAL_STATES.COMPLETE,
            game:        game,
            repackage:   false,
        });
      } else if (isAmbiguous) {
        // Build option list and pre-selection for the ResolveTypesDialog.
        // Normalize impl keys → aliases so the dialog works entirely in alias-space.
        const registry = WrcCommon.AppRegistry.instance;
        const typeOptions = registry.getTypesForAmbiguousExt(extDotted)
          .map(k => registry.getAlias(k) ?? k);
        const catDefault = category?.defaultType ?? null;
        // Normalize catDefault to alias for comparison only; preSelected keeps the original.
        const catAlias = catDefault ? (registry.getAlias(catDefault) ?? catDefault) : null;
        const catAppliesToOptions = typeOptions.length > 0 && typeOptions.includes(catAlias);

        const preSelected =
          typeOptions.length === 1  ? typeOptions[0]                 // system-determined alias
          : catAppliesToOptions     ? catDefault                     // user's choice, valid for ext
          : !typeOptions.length && catDefault ? catDefault           // .bin/.zip → user's choice
          : null;
        needsReview.push({
          id: ++_idCounter,
          filename: file.name,
          file,
          extDotted,
          typeOptions,   // empty = all types; non-empty = filtered list
          preSelected,
        });
      } else {
        errors.push({
          id: ++_idCounter,
          filename: file.name,
          reason: 'Failed to identify file type (no matching application found)',
        });
      }
    }
  } finally {
    // Ensure the busy screen is visible for at least 1200 ms so it doesn't
    // just flash briefly for fast analyses.
    const elapsed = Date.now() - analysisStart;
    if (elapsed < 600) {
      await new Promise(resolve => setTimeout(resolve, 1200 - elapsed));
    }
    Global.openBusyScreen(false);
  }

  // ── Phase 2: Type resolution ──────────────────────────────────────────────
  // If any files couldn't be definitively identified, ask the user to assign
  // a type via the ResolveTypesDialog before proceeding to upload.
  if (needsReview.length > 0) {
    const resolved = await Global.openResolveTypesDialog(needsReview);
    if (resolved?.aborted) {
      // User aborted the entire import — stop here, nothing to upload
      return;
    } else if (resolved) {
      for (const { item, type, repackage } of resolved) {
        if (!type) {
          // User chose Skip
          skipped.push({ id: item.id, filename: item.filename, reason: 'Skipped by user' });
          continue;
        }
        // Build a minimal game object for this file using the chosen type
        const dotIdx = item.filename.lastIndexOf('.');
        const title = dotIdx > 0 ? item.filename.slice(0, dotIdx) : item.filename;
        const game = { title, type, props: {} };
        accepted.push({
          id: item.id,
          filename: item.filename,
          file: item.file,
          state: ADD_LOCAL_STATES.COMPLETE,
          game,
          repackage: repackage ?? false,
        });
      }
    } else {
      // Dialog was cancelled — treat all needsReview files as skipped
      for (const item of needsReview) {
        skipped.push({ id: item.id, filename: item.filename, reason: 'Skipped (type dialog cancelled)' });
      }
    }
  }

  // Push all analyzed results to the dialog, then open it.
  if (GlobalHolder.setLocalFilesData) {
    GlobalHolder.setLocalFilesData({ accepted, skipped, errors });
  }
  Global.openAddLocalFilesDialog(true);

  // ── Phase 3: Upload each accepted file to Dropbox ─────────────────────────
  _cancelRequested = false;
  const uploadDir = resolveCategoryItemsPath(feed, category);
  const cloudStorage = new CloudStorage();
  let tokenErrorShown = false;

  for (const item of accepted) {
    if (_cancelRequested) break;

    const uploadPath = `${uploadDir}${item.filename}`;

    // ── Repackage ──────────────────────────────────────────────────────────
    if (item.repackage) {
      const zipBaseName = item.filename.replace(/\.zip$/i, '');
      const repackagePath = `${uploadDir}repackage/${zipBaseName}/`;

      GlobalHolder.updateLocalFile?.(item.id, {
        state:          ADD_LOCAL_STATES.UPLOADING,
        uploadProgress: 0,
        statusMessage:  'Analyzing archive…',
      });

      try {
        const rp = new Repackage();
        const results = await rp.repackage(item.file);

        await rp.writeToCloud(
          { storage: cloudStorage },
          results,
          repackagePath,
          zipBaseName,
          (manifestUrl) => {
            // onSuccess — apply manifest URL to game and add to feed
            const remapped = WrcCommon.remapUrl(manifestUrl);
            applyUrlToGame(item.game, remapped);
            setDefaultsForType(item.game?.type, item.game);

            const feed = Global.getFeed();
            const catId = Global.getFeedCategoryId();
            const cat = Feed.getCategory(feed, catId);
            const priorLen = cat?.items?.length ?? 0;
            Feed.addItemsToCategory(feed, catId, [item.game]);
            const feedId = cat?.items?.[priorLen]?.id;
            if (feedId) item.game.id = feedId;
            Global.setFeed({ ...feed });

            GlobalHolder.updateLocalFile?.(item.id, {
              state:          ADD_LOCAL_STATES.COMPLETE,
              uploadProgress: undefined,
              statusMessage:  undefined,
              publicUrl:      remapped,
            });
          },
          (message, progress) => {
            // onStatus — forward to the dialog's progress display
            GlobalHolder.updateLocalFile?.(item.id, {
              statusMessage:  message,
              uploadProgress: progress,
            });
          }
        );
      } catch (e) {
        console.error(`[LocalFileProcessor] Repackage failed for "${item.filename}":`, e);
        GlobalHolder.updateLocalFile?.(item.id, {
          state:         ADD_LOCAL_STATES.ERROR,
          statusMessage: undefined,
          reason:        e?.message || 'Repackage failed',
        });
      }
      continue;
    }

    GlobalHolder.updateLocalFile?.(item.id, {
      state:          ADD_LOCAL_STATES.UPLOADING,
      uploadProgress: 0,
    });

    try {
      await WrcCommon.dropbox.uploadFile(item.file, uploadPath, (pct) => {
        GlobalHolder.updateLocalFile?.(item.id, { uploadProgress: pct });
      });

      const sharedUrl = await cloudStorage.createSharedLink(uploadPath);
      const publicUrl = WrcCommon.remapUrl(sharedUrl);
      //console.log(`[LocalFileProcessor] "${item.filename}" → ${publicUrl}`);

      // Place the URL in the right props field and apply type-specific defaults
      applyUrlToGame(item.game, publicUrl);
      setDefaultsForType(item.game?.type, item.game);

      // Add the completed game to the feed and capture the feed-assigned id
      const feed = Global.getFeed();
      const catId = Global.getFeedCategoryId();
      const cat = Feed.getCategory(feed, catId);
      const priorLen = cat?.items?.length ?? 0;
      Feed.addItemsToCategory(feed, catId, [item.game]);
      const feedId = cat?.items?.[priorLen]?.id;
      if (feedId) item.game.id = feedId;
      Global.setFeed({ ...feed });

      GlobalHolder.updateLocalFile?.(item.id, {
        state:          ADD_LOCAL_STATES.COMPLETE,
        uploadProgress: undefined,
        publicUrl,
      });
    } catch (e) {
      console.error(`[LocalFileProcessor] Upload failed for "${item.filename}":`, e);
      const isTokenError = e?.status === 401 || e?.error?.error?.required_scope;
      if (isTokenError && !tokenErrorShown) {
        tokenErrorShown = true;
        Global.displayMessage(
          "This operation requires an updated Dropbox token. Please use settings to unlink and relink to Dropbox.",
          "error"
        );
      }
      GlobalHolder.updateLocalFile?.(item.id, {
        state:          ADD_LOCAL_STATES.ERROR,
        uploadProgress: undefined,
        reason:         isTokenError
          ? 'Upload failed: Dropbox token needs to be updated. Please use settings to unlink and relink to Dropbox.'
          : e?.message || 'Upload failed',
      });
    }
  }

  // TODO: add matched items to feed
}

/**
 * Uploads a single file to Dropbox and returns its public shared URL.
 * Intended for direct field-level uploads (BIOS files, ROMs, etc.).
 * @param {File}   file     - the File to upload
 * @param {string} destPath - the cloud directory path (with trailing slash)
 * @returns {Promise<string>} the public URL
 */
export async function uploadSingleFile(file, destPath, onProgress) {
  const cloudStorage = new CloudStorage();
  const path = `${destPath}${file.name}`;
  await WrcCommon.dropbox.uploadFile(file, path, onProgress ?? null);
  const sharedUrl = await cloudStorage.createSharedLink(path);
  return WrcCommon.remapUrl(sharedUrl);
}

/**
 * Uploads an image file to Dropbox using a collision-safe name and returns
 * its public shared URL. The destination filename is:
 *   <slugified-title>_<new-guid>_<original-filename>
 * @param {File}   file     - the image File to upload
 * @param {string} destPath - the cloud directory path (with trailing slash)
 * @param {string} title    - the feed/category/item title
 * @returns {Promise<string>} the public URL
 */
export async function uploadImageFile(file, destPath, title, onProgress) {
  const cloudStorage = new CloudStorage();
  const slug = Feed.slugify(title || 'untitled');
  const name = `${slug}_${uuidv4()}_${file.name}`;
  const path = `${destPath}${name}`;
  await WrcCommon.dropbox.uploadFile(file, path, onProgress ?? null);
  const sharedUrl = await cloudStorage.createSharedLink(path);
  return WrcCommon.remapUrl(sharedUrl);
}
