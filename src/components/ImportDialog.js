import * as React from 'react';
import Tab from '@mui/material/Tab';

import * as Util from '../Util';
import { Global, GlobalHolder } from '../Global';
import Editor from './common/editor/Editor';
import EditorFileChooser from './common/editor/EditorFileChooser';
import EditorTabPanel from './common/editor/EditorTabPanel';
import EditorTextField from './common/editor/EditorTextField';
import EditorValidator from './common/editor/EditorValidator';
import Prefs from '../Prefs';
import * as Feed from '../Feed';

const validator = new EditorValidator();

function importFeed(obj, isFile = false) {
  Global.openBusyScreen(true, "Importing feed...");
  (isFile ?
    Feed.loadFeedFromFile(obj) :
    Feed.loadFeedFromUrl(obj))
    .then((feed) => {
      Global.setFeed(feed);
    })
    .catch(msg => {
      Global.displayMessage(msg);
    })
    .finally(() => {
      Global.openBusyScreen(false);
    });
}

export default function ImportDialog(props) {
  const [isOpen, setOpen] = React.useState(false);
  const [tabValue, setTabValue] = React.useState(0);
  const [feedUrl, setFeedUrl] = React.useState('');
  const forceUpdate = Util.useForceUpdate();
  
  GlobalHolder.setImportDialogOpen = setOpen;

  const urlTab = 0;
  const fileTab = 1;

  const onOk = () => {
    if (tabValue === urlTab) {
      if (!validator.checkMinLength(urlTab, "feedUrl", feedUrl)) {
        forceUpdate();
        return false;
      }
      Prefs.setLastFeedUrl(feedUrl);
      importFeed(feedUrl);
    }
    return true;
  }

  return (
    <Editor
      title="Import Feed"
      height={250}
      maxWidth={false}
      isOpen={isOpen}
      setOpen={Global.openImportDialog}
      tabValue={tabValue}
      setTabValue={setTabValue}
      onShow={() => {
        setFeedUrl(Prefs.getLastFeedUrl());
        validator.reset();
        forceUpdate();
      }}
      onOk={onOk}
      onSubmit={() =>{
        if (tabValue === urlTab && onOk()) { 
          setOpen(false);
        }        
      }}
      tabs={[
        <Tab label="URL" key={urlTab} />,
        <Tab label="File" key={fileTab} />,
      ]}
      tabPanels={(
        <>
          <EditorTabPanel value={tabValue} index={urlTab}>
            <EditorTextField
              required
              sx={{ width: '50ch' }}
              label="Feed location (URL)"
              onDropText={(text) => { setFeedUrl(text); }}
              onChange={(e) => { setFeedUrl(e.target.value); }}
              value={feedUrl}
              error={!validator.isValid(urlTab, "feedUrl")}
            />
          </EditorTabPanel>
          <EditorTabPanel value={tabValue} index={fileTab}>
            <EditorFileChooser
              label="Select feed file..."
              onChange={
                (e) => {
                  const files = e.target.files;
                  if (files.length > 0) {
                    const f = files[0];
                    setOpen(false);
                    importFeed(f, true);
                  }
                }
              }
            />
          </EditorTabPanel>
        </>
      )}
    />
  );
}
