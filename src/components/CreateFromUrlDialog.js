import * as React from 'react';
import Tab from '@mui/material/Tab';

import * as UrlProcessor from '../UrlProcessor';
import * as Util from '../Util';
import { Global, GlobalHolder } from '../Global';
import Editor from './common/editor/Editor';
import EditorMultiUrlField from './common/editor/EditorMultiUrlField';
import EditorTabPanel from './common/editor/EditorTabPanel';
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
    const urls = Util.splitLines(url);
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
  const urls = Util.splitLines(url);
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
            <EditorMultiUrlField
              required
              label="URLs (one per line)"
              onDropText={(text) => {
                if (Array.isArray(text)) {
                  text = text.join("\n");
                }
                setUrl(url + (url.trim().length > 0 ? "\n" : "") + text);
              }}
              onChange={(e) => { setUrl(e.target.value); }}
              value={url}
              error={!validator.isValid(urlTab, "url")}
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