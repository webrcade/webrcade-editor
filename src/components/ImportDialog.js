import * as React from 'react';
import Tab from '@mui/material/Tab';

import * as Util from '../Util';
import { Global, GlobalHolder } from '../Global';
import Editor from './common/editor/Editor';
import EditorFileChooser from './common/editor/EditorFileChooser'; 
import EditorTabPanel from './common/editor/EditorTabPanel';
import EditorTextField from './common/editor/EditorTextField';
import EditorValidator from './common/editor/EditorValidator';
import * as Feed from '../Feed';

const validator = new EditorValidator();

export default function ImportDialog(props) {
  const [isOpen, setOpen] = React.useState(false);
  const [tabValue, setTabValue] = React.useState(0);
  const [feedUrl, setFeedUrl] = React.useState('');
  const forceUpdate = Util.useForceUpdate();

  GlobalHolder.setImportDialogOpen = setOpen;

  const urlTab = 0;
  const fileTab = 1;

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
        validator.reset();
        forceUpdate();
      }}
      onOk={() => {        
        if (tabValue === urlTab) {
          if (!validator.checkMinLength(urlTab, "feedUrl", feedUrl)) {
            forceUpdate();
            return false;
          }          
          Global.openBusyScreen(true, "Importing feed...");
          Feed.loadFeedFromUrl(feedUrl)
            .then((feed) => {
              Global.setFeed(feed[1]);
            })
            .catch(msg => {
              Global.displayMessage(msg);
            })
            .finally(() => {
              Global.openBusyScreen(false);
            });
        }
        return true;
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
              onChange={(e) => { setFeedUrl(e.target.value); }}
              value={feedUrl}              
              error={!validator.isValid(urlTab, "feedUrl")}
            />
          </EditorTabPanel>
          <EditorTabPanel value={tabValue} index={fileTab}>
            <EditorFileChooser label="Select feed file..."/>
          </EditorTabPanel>
        </>
      )}
    />
  );
}
