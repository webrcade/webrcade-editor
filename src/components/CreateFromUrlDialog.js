import * as React from 'react';
import Tab from '@mui/material/Tab';

import * as UrlProcessor from '../UrlProcessor';
import * as Util from '../Util';
import { Global, GlobalHolder } from '../Global';
import Editor from './common/editor/Editor';
import EditorTabPanel from './common/editor/EditorTabPanel';
import EditorTextField from './common/editor/EditorTextField';
import EditorValidator from './common/editor/EditorValidator';

const validator = new EditorValidator();

const setTabValue = () => {};

export default function CreateFromUrlDialog(props) {
  const [isOpen, setOpen] = React.useState(false);
  const [url, setUrl] = React.useState('');
  const forceUpdate = Util.useForceUpdate();

  GlobalHolder.setCreateFromUrlDialogOpen = setOpen;

  const urlTab = 0;

  const onOk = () => {
    if (!validator.checkMinLength(urlTab, "url", url)) {
      forceUpdate();
      return false;
    }
    UrlProcessor.process([url]);
    return true;
  }

  return (
    <Editor
      title="Create Item from URL"
      height={190}
      maxWidth={false}
      isOpen={isOpen}
      setOpen={Global.openCreateFromUrlDialog}
      tabValue={urlTab}
      setTabValue={setTabValue}
      onShow={() => {
        setUrl('');
        validator.reset();        
        forceUpdate();
      }}
      onOk={onOk}
      onSubmit={() => {
        if (onOk()) {
          setOpen(false);
        }
      }}
      tabs={[
        <Tab label="URL" key={urlTab} />,
      ]}
      tabPanels={(
        <>
          <EditorTabPanel value={urlTab} index={urlTab}>
            <EditorTextField
              required
              sx={{ width: '50ch' }}
              label="URL"
              onDropText={(text) => { setUrl(text); }}
              onChange={(e) => { setUrl(e.target.value); }}
              value={url}
              error={!validator.isValid(urlTab, "url")}
            />
          </EditorTabPanel>
        </>
      )}
    />
  );
}