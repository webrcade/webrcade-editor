import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import ClearIcon from '@mui/icons-material/Clear';

import { Base64, Zip, LOG } from '@webrcade/app-common'
import * as WrcCommon from '@webrcade/app-common'

import * as Util from '../Util';
import { Global, GlobalHolder } from '../Global';
import Editor from './common/editor/Editor';
import EditorButton from './common/editor/EditorButton';
import EditorSwitch from './common/editor/EditorSwitch';
import EditorTabPanel from './common/editor/EditorTabPanel';
import EditorTextField from './common/editor/EditorTextField';
import CommonTooltip from './common/CommonTooltip';
import DashedLabel from './common/DashedLabel';
import { CloudStorage } from './cloud/generate-manifest/CloudStorage';
import { openSelectCloudFolderDialog } from './cloud/generate-manifest/SelectCloudFolderDialog';
import * as Feed from '../Feed';
import Prefs from '../Prefs';

const PREF_IS_ZIPPED = "exportFeed.isZipped";
const PREF_IS_BASE64 = "exportFeed.isBase64";
const PREF_IS_CLOUD = "exportFeed.isCloud";
const PREF_CLOUD_SUBFOLDER = "exportFeed.cloudSubFolder";
const PREF_CLOUD_DEST_FOLDER = "exportFeed.cloudDestFolder";

const LOCAL_TAB = 0;
const CLOUD_TAB = 1;

export default function ExportDialog(props) {
  const cloudEnabled = WrcCommon.settings.isCloudStorageEnabled();

  const [isOpen, setOpen] = React.useState(false);
  const [tabValue, setTabValue] = React.useState(LOCAL_TAB);
  const [isZipped, setZipped] =
    React.useState(Prefs.getBoolPreference(PREF_IS_ZIPPED, false));
  const [isBase64Encoded, setBase64Encoded] =
    React.useState(Prefs.getBoolPreference(PREF_IS_BASE64, false));
  const [destFolder, setDestFolder] = React.useState(
    Prefs.getPreference(PREF_CLOUD_DEST_FOLDER, "/"));
  const [subFolder, setSubFolder] =
    React.useState(Prefs.getPreference(PREF_CLOUD_SUBFOLDER, "/feeds"));

  const getFullPath = (dest, sub) => {
    let d = (dest || "/").trim();
    let s = (sub || "").trim();
    while (s.indexOf("//") >= 0) s = s.replace("//", "/");
    if (s.endsWith("/")) s = s.substring(0, s.length - 1);
    const root = d.endsWith("/") ? d : d + "/";
    const full = root + (s.startsWith("/") ? s.substring(1) : s);
    return (!full.endsWith("/")) ? full + "/" : full;
  };

  const forceUpdate = Util.useForceUpdate();

  GlobalHolder.setExportDialogOpen = setOpen;

  const buildBlob = async (isZip, isBase64Encoded) => {
    let extension = ".json";
    let blob = null;

    let feed = Feed.exportFeed(Global.getFeed());
    const title = feed.title;
    feed = JSON.stringify(feed, null, 2);

    if (isZip) {
      extension = ".zip";

      const zip = new Zip();
      const zipFiles = [];
      const b = new Blob([feed]);
      zipFiles.push({
        name: "feed.json",
        content: b
      });
      blob = await zip.zipFiles(zipFiles);

      if (isBase64Encoded) {
        const promise = new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = function () {
            var base64data = reader.result.split(',')[1];
            resolve(base64data);
          }
        });
        blob = new Blob([await promise]);
        extension = ".b64";
      }
    } else if (isBase64Encoded) {
      feed = Base64.encode(feed);
      extension = ".b64";
      blob = new Blob([feed], { type: "text/plain;base64" });
    } else {
      blob = new Blob([feed], { type: "application/json" });
    }

    return { blob, extension, title };
  }

  const download = async (isZip, isBase64Encoded) => {
    const { blob, extension, title } = await buildBlob(isZip, isBase64Encoded);

    const url = URL.createObjectURL(blob);
    var element = document.createElement('a');
    element.setAttribute('href', url);
    element.setAttribute('download', title + extension);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    // Close the export dialog
    Global.openExportDialog(false);
  }

  const uploadToCloud = async (isZip, isBase64Encoded, folder) => {
    const { blob, extension, title } = await buildBlob(isZip, isBase64Encoded);
    const name = (title || "feed").trim();
    const path = `${folder}${name}${extension}`;

    Global.openBusyScreen(true, "Exporting feed to cloud storage...");
    try {
      const cloudStorage = new CloudStorage();
      await WrcCommon.dropbox.uploadFile(blob, path);
      const url = WrcCommon.remapUrl(await cloudStorage.createSharedLink(path));

      Global.openExportDialog(false);
      setTimeout(() => {
        Global.openCopyLinkDialog(
          true,
          url,
          "Exported Feed URL",
          "Successfully copied the feed URL to the clipboard.",
          true,
          <>
            <p style={{ margin: '0 0 8px 0' }}>
              For a cleaner, more memorable feed URL, consider using a link shortener such as{' '}
              <a href="https://tiny.cc" target="_blank" rel="noopener noreferrer"
                style={{ color: 'white', textDecoration: 'underline', cursor: 'pointer' }}
              >tiny.cc</a>.
              {' '}tiny.cc supports custom link endings (e.g.{' '}
              <span style={{ fontFamily: 'monospace' }}>tiny.cc/myfeed</span>)
              {' '}and works great with Dropbox links.
            </p>
            <p style={{ margin: 0 }}>
              You only need to set this up once. Re-exporting produces the same Dropbox URL,
              so your existing shortened link will continue to work.
            </p>
          </>,
          null
        );
      }, 0);
    } catch (e) {
      LOG.error(e);
      if (e?.error?.error?.required_scope) {
        Global.displayMessage("This operation requires an updated cloud storage token. Please use settings to unlink and relink to cloud storage.", "error");
      } else {
        Global.displayMessage("An error occurred while uploading the feed to cloud storage.", "error");
      }
    } finally {
      Global.openBusyScreen(false);
    }
  }

  const onOk = (isZip, isBase64Encoded, tab) => {
    Prefs.setPreference(PREF_IS_ZIPPED, isZip);
    Prefs.setPreference(PREF_IS_BASE64, isBase64Encoded);
    if (cloudEnabled) {
      Prefs.setPreference(PREF_IS_CLOUD, tab === CLOUD_TAB);
      if (tab === CLOUD_TAB) {
        Prefs.setPreference(PREF_CLOUD_SUBFOLDER, subFolder);
        Prefs.setPreference(PREF_CLOUD_DEST_FOLDER, destFolder);
      }
    }
    if (cloudEnabled && tab === CLOUD_TAB) {
      uploadToCloud(isZip, isBase64Encoded, getFullPath(destFolder, subFolder));
    } else {
      download(isZip, isBase64Encoded);
    }
    return false;
  }

  const tabs = [
    <Tab label="Local file" key={LOCAL_TAB} />,
    ...(cloudEnabled ? [<Tab label="Cloud storage" key={CLOUD_TAB} />] : []),
  ];

  const fullPath = cloudEnabled ? getFullPath(destFolder, subFolder) : "";
  const cloudName = (Global.getFeed().title || "feed").trim();
  const cloudExtension = isZipped ? (isBase64Encoded ? ".b64" : ".zip") : (isBase64Encoded ? ".b64" : ".json");
  const cloudPath = `${fullPath}${cloudName}${cloudExtension}`;

  return (
    <Editor
      title="Export Feed"
      height={cloudEnabled ? 420 : 250}
      maxWidth={false}
      isOpen={isOpen}
      setOpen={Global.openExportDialog}
      tabValue={tabValue}
      setTabValue={setTabValue}
      onShow={() => {
        if (cloudEnabled) {
          const lastIsCloud = Prefs.getBoolPreference(PREF_IS_CLOUD, false);
          setTabValue(lastIsCloud ? CLOUD_TAB : LOCAL_TAB);
        } else {
          setTabValue(LOCAL_TAB);
        }
        forceUpdate();
      }}
      onOk={() => onOk(isZipped, isBase64Encoded, tabValue)}
      tabs={tabs}
      tabPanels={(
        <>
          <Box sx={{ pt: 2 }}>
            <EditorSwitch
              label="Compress (zip)"
              tooltip="Whether to zip the feed."
              onChange={(e) => setZipped(e.target.checked)}
              checked={isZipped}
            />
            <EditorSwitch
              label="Base64 encoding (text)"
              tooltip="Whether to Base64 encode the feed."
              onChange={(e) => setBase64Encoded(e.target.checked)}
              checked={isBase64Encoded}
            />
          </Box>
          <EditorTabPanel value={tabValue} index={LOCAL_TAB}>
          </EditorTabPanel>
          {cloudEnabled && (
            <EditorTabPanel value={tabValue} index={CLOUD_TAB}>
              <Box sx={{ mt: -1 }}>
                <Stack spacing={0} direction="row" alignItems="center">
                  <EditorTextField
                    sx={{ width: '45ch' }}
                    label="Destination Folder"
                    value={destFolder}
                    InputProps={{
                      readOnly: true,
                      endAdornment: destFolder !== '/' ? (
                        <InputAdornment position="end">
                          <CommonTooltip title="Clear selection">
                            <IconButton
                              onClick={() => setDestFolder('/')}
                              size="small"
                              edge="end"
                            >
                              <ClearIcon fontSize="small" />
                            </IconButton>
                          </CommonTooltip>
                        </InputAdornment>
                      ) : null,
                    }}
                  />
                  <EditorButton
                    label="Select..."
                    sx={{ whiteSpace: 'nowrap' }}
                    onClick={() => {
                      openSelectCloudFolderDialog((m, node) => {
                        setDestFolder(node.path);
                      });
                    }}
                  />
                </Stack>
              </Box>
              <Box>
                <EditorTextField
                  sx={{ width: '45ch', mb: 2.5 }}
                  label="Sub-Folder (optional)"
                  value={subFolder}
                  onChange={(e) => setSubFolder(e.target.value)}
                />
              </Box>
              <DashedLabel text={cloudPath} maxWidth="45ch" />
            </EditorTabPanel>
          )}
        </>
      )}
    />
  );
}
