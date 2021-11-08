import * as React from 'react';
import Tab from '@mui/material/Tab';

import * as Feed from '../../Feed';
import * as Util from '../../Util';
import BackgroundTab from '../common/editor/BackgroundTab';
import GeneralTab from '../common/editor/GeneralTab';
import Editor from '../common/editor/Editor';
import EditorTabPanel from '../common/editor/EditorTabPanel';
import EditorValidator from '../common/editor/EditorValidator'
import ThumbnailTab from '../common/editor/ThumbnailTab';
import { GlobalHolder, Global } from '../../Global';

import { 
  AppRegistry
} from '@webrcade/app-common'

// import * as deepmerge from 'deepmerge'
// const a = {a: 'a', b: { b1: 'b1', b2: 'b2'}}
// const b = {a: 'ba', b: { b1: 'bb1', b4: 'bb2'}}
// console.log(deepmerge(a,b));

const validator = new EditorValidator();

const addValidatorCallback = (id, cb) => {
  validator.addCallback(id, cb);
}

export default function ItemEditor(props) {
  const [tabValue, setTabValue] = React.useState(0);
  const [item, setItem] = React.useState({});
  const [isOpen, setOpen] = React.useState(false);

  GlobalHolder.setItemEditorOpen = setOpen;
  GlobalHolder.setEditItem = setItem;

  const forceUpdate = Util.useForceUpdate();

  let defaultThumbnail = "";
  let defaultBackground = "";
  if (item.type) {
    defaultThumbnail = 
      AppRegistry.instance.getDefaultThumbnailForType(item.type);
    defaultBackground = 
      AppRegistry.instance.getDefaultBackgroundForType(item.type);
  }

  const genTab = 0;
  const propsTab = 1;
  const thumbTab = 2;
  const bgTab = 3;

  return (
    <Editor
      title="Edit Item"
      isOpen={isOpen}
      setOpen={setOpen}
      tabValue={tabValue}
      setTabValue={setTabValue}
      onShow={() => {
        validator.reset();
        setItem(Util.cloneObject(item))
        forceUpdate();
      }}
      onOk={() => {
        validator.executeCallbacks();
        const minTab = validator.getMinInvalidTab();                
        if (minTab >= 0) {
          setTabValue(minTab);
          forceUpdate();
          return false;
        }

        // Get the feed
        const feed = Global.getFeed();
        // Replace the item in the feed
        Feed.replaceItem(feed, Global.getFeedCategoryId(), item.id, item);
        // Update the feed (shallow clone)
        Global.setFeed({...feed});
        
        return true;
      }}
      tabs={[
        <Tab label="General" key={genTab} />,
        <Tab label="Properties" key={propsTab} />,
        <Tab label="Thumbnail" key={thumbTab} />,
        <Tab label="Background" key={bgTab} />,
      ]}
      tabPanels={(
        <>
          <GeneralTab
            tabValue={tabValue}
            tabIndex={genTab}
            object={item}
            setObject={setItem}
            validator={validator}
            addValidateCallback={addValidatorCallback}
          />
          <EditorTabPanel value={tabValue} index={propsTab}>
            Item Two
          </EditorTabPanel>
          <ThumbnailTab
            tabValue={tabValue}
            tabIndex={thumbTab}
            thumbSrc={item.thumbnail}
            defaultThumbSrc={defaultThumbnail}
            onChange={(e) => {setItem({ ...item, thumbnail: e.target.value })}}          
          />
          <BackgroundTab
            tabValue={tabValue}
            tabIndex={bgTab}
            thumbSrc={item.background}
            defaultThumbSrc={defaultBackground}
            onChange={(e) => {setItem({ ...item, background: e.target.value })}}
          />
        </>
      )}
    />
  );
}
