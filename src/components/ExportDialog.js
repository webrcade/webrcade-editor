import * as React from 'react';
import Tab from '@mui/material/Tab';

import { Base64, Zip } from '@webrcade/app-common'

import * as Util from '../Util';
import { Global, GlobalHolder } from '../Global';
import Editor from './common/editor/Editor';
import EditorSwitch from './common/editor/EditorSwitch';
import EditorTabPanel from './common/editor/EditorTabPanel';
import * as Feed from '../Feed';
import Prefs from '../Prefs';

const PREF_IS_ZIPPED = "exportFeed.isZipped";
const PREF_IS_BASE64 = "exportFeed.isBase64";

export default function ImportDialog(props) {
  const [isOpen, setOpen] = React.useState(false);
  const [tabValue, setTabValue] = React.useState(0);
  const [isZipped, setZipped] =
    React.useState(Prefs.getBoolPreference(PREF_IS_ZIPPED, false));
  const [isBase64Encoded, setBase64Encoded] =
    React.useState(Prefs.getBoolPreference(PREF_IS_BASE64, false));

  const forceUpdate = Util.useForceUpdate();

  GlobalHolder.setExportDialogOpen = setOpen;

  const exportTab = 0;

  const download = async (isZip, isBase64Encoded) => {
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

  const onOk = (isZip, isBase64Encoded) => {
    Prefs.setPreference(PREF_IS_ZIPPED, isZip);
    Prefs.setPreference(PREF_IS_BASE64, isBase64Encoded);
    download(isZip, isBase64Encoded);
    return false;
  }

  return (
    <Editor
      title="Export Feed"
      height={250}
      maxWidth={false}
      isOpen={isOpen}
      setOpen={Global.openExportDialog}
      tabValue={tabValue}
      setTabValue={setTabValue}
      onShow={() => {
        // setFeedUrl(Prefs.getLastFeedUrl());
        forceUpdate();
      }}
      onOk={() => onOk(isZipped, isBase64Encoded)}
      tabs={[
        <Tab label="Export" key={exportTab} />,
      ]}
      tabPanels={(
        <>
          <EditorTabPanel value={tabValue} index={exportTab}>
            <EditorSwitch
              label="Compress (zip)"
              tooltip="Whether to zip the feed."
              onChange={(e) => {
                setZipped(e.target.checked);
              }}
              checked={isZipped}
            />
            <EditorSwitch
              label="Base64 encoding"
              tooltip="Whether to Base64 encode the feed."
              onChange={(e) => {
                setBase64Encoded(e.target.checked);
              }}
              checked={isBase64Encoded}
            />
          </EditorTabPanel>
        </>
      )}
    />
  );
}
