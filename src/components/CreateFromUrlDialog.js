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
    const urls = url.split("\n");
    const validatedUrls = [];
    for (let i = 0; i < urls.length; i++) {
      const curUrl = urls[i].trim();
      if (curUrl.length > 0) {
        validatedUrls.push(curUrl);
      }
    }
    UrlProcessor.process(validatedUrls);
    return true;
  }

  let urlCount = 0;
  const urls = url.split("\n");
  for (let i = 0; i < urls.length; i++) {
    const curUrl = urls[i].trim();
    if (curUrl.length > 0) {
      urlCount++;
    }
  }

  return (
    <Editor
      title="Create Items from URLs"
      height={250}
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
              multiline
              rows={5}
              sx={{ width: '50ch'}}
              label="URLs (one per line)"
              onDropText={(text) => { setUrl(url + (url.trim().length > 0 ? "\n" : "") + text); }}
              onChange={(e) => { setUrl(e.target.value); }}
              value={url}
              error={!validator.isValid(urlTab, "url")}
              inputProps={{ref: input => {if (input) {input.style['white-space']='nowrap'}}}}
              helperText={
                urlCount === 0 ? "" :
                  urlCount === 1 ? "1 URL entered." : `${urlCount} URLs entered.`
              }
            />
          </EditorTabPanel>
        </>
      )}
    />
  );
}