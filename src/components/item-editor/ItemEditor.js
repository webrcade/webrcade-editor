import * as React from 'react';
import Tab from '@mui/material/Tab';

import * as Feed from '../../Feed';
import * as Util from '../../Util';
import Editor from '../common/editor/Editor';
import EditorImage from '../common/editor/EditorImage';
import EditorTabPanel from '../common/editor/EditorTabPanel';
import EditorTextField from '../common/editor/EditorTextField';
import EditorValidator from '../common/editor/EditorValidator'
import { GlobalHolder, Global } from '../../Global';

// import * as deepmerge from 'deepmerge'
// const a = {a: 'a', b: { b1: 'b1', b2: 'b2'}}
// const b = {a: 'ba', b: { b1: 'bb1', b4: 'bb2'}}
// console.log(deepmerge(a,b));

const validator = new EditorValidator();

export default function ItemEditor(props) {
  const [tabValue, setTabValue] = React.useState(0);
  const [item, setItem] = React.useState({});
  const [isOpen, setOpen] = React.useState(false);

  GlobalHolder.setItemEditorOpen = setOpen;
  GlobalHolder.setEditItem = setItem;

  const forceUpdate = Util.useForceUpdate();

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
        validator.checkMinLength(genTab, "title", item.title);
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
          <EditorTabPanel value={tabValue} index={genTab}>
            <div>
              <EditorTextField 
                required
                label="Title"
                onChange={(e) => { setItem({ ...item, title: e.target.value }) }}
                value={Util.asString(item.title)}
                error={!validator.isValid(genTab, "title")}
              />
            </div>
            <div>
              <EditorTextField
                sx={{ width: '50ch' }}
                label="Long title"
                onChange={(e) => { setItem({ ...item, longTitle: e.target.value }) }}
                value={Util.asString(item.longTitle)}
              />
            </div>
            <div>
              <EditorTextField
                sx={{ width: '50ch' }}
                label="Description" 
                multiline
                rows={4} 
                onChange={(e) => { setItem({ ...item, description: e.target.value }) }}
                value={Util.asString(item.description)}
              />
            </div>
          </EditorTabPanel>
          <EditorTabPanel value={tabValue} index={propsTab}>
            Item Two
          </EditorTabPanel>
          <EditorTabPanel value={tabValue} index={thumbTab}>
            <div>
              <EditorTextField
                sx={{ width: '50ch' }}
                label="Thumbnail location (URL)"
                onChange={(e) => { setItem({ ...item, thumbnail: e.target.value }) }}
                value={Util.asString(item.thumbnail)}
              />
            </div>
            <div>
              <EditorImage src={item.thumbnail} />
            </div>
          </EditorTabPanel>
          <EditorTabPanel value={tabValue} index={bgTab}>
            <div>
              <EditorTextField
                sx={{ width: '50ch' }}
                label="Background location (URL)"
                onChange={(e) => { setItem({ ...item, background: e.target.value }) }}
                value={Util.asString(item.background)}
              />
            </div>
            <div>
              <EditorImage sx={{
                objectFit: 'cover',
                height: '100%'
              }} src={item.background} />
            </div>
          </EditorTabPanel>
        </>
      )}
    />
  );
}
