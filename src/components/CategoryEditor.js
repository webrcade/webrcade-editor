import * as React from 'react';
import Tab from '@mui/material/Tab';

import * as Feed from '../Feed';
import * as Util from '../Util';
import BackgroundTab from './common/editor/BackgroundTab';
import GeneralTab from './common/editor/GeneralTab';
import Editor from './common/editor/Editor';
import EditorValidator from './common/editor/EditorValidator'
import ThumbnailTab from './common/editor/ThumbnailTab';
import { GlobalHolder, Global } from '../Global';

import {
  CategoryBackgroundImage,
  CategoryThumbImage
} from '@webrcade/app-common'

const validator = new EditorValidator();

export default function CategoryEditor(props) {
  const [tabValue, setTabValue] = React.useState(0);
  const [category, setCategory] = React.useState({});
  const [isOpen, setOpen] = React.useState(false);

  GlobalHolder.setCategoryEditorOpen = setOpen;
  GlobalHolder.setEditCategory = setCategory;

  const forceUpdate = Util.useForceUpdate();

  let defaultThumbnail = "";
  let defaultBackground = "";
  defaultThumbnail = CategoryThumbImage;
  defaultBackground = CategoryBackgroundImage;

  const genTab = 0;
  const thumbTab = 1;
  const bgTab = 2;

  return (
    <Editor
      title="Edit Category"
      isOpen={isOpen}
      setOpen={setOpen}
      tabValue={tabValue}
      setTabValue={setTabValue}
      onShow={() => {
        validator.reset();
        setCategory(Util.cloneObject(category))
        forceUpdate();
      }}
      onOk={() => {
        validator.checkMinLength(genTab, "title", category.title);
        const minTab = validator.getMinInvalidTab();
        if (minTab >= 0) {
          setTabValue(minTab);
          forceUpdate();
          return false;
        }

        // Get the feed
        const feed = Global.getFeed();
        // Replace the category in the feed
        Feed.replaceCategory(feed, category.id, category);
        // Update the feed (shallow clone)
        Global.setFeed({ ...feed });

        return true;
      }}
      tabs={[
        <Tab label="General" key={genTab} />,
        <Tab label="Thumbnail" key={thumbTab} />,
        <Tab label="Background" key={bgTab} />,
      ]}
      tabPanels={(
        <>
          <GeneralTab
            tabValue={tabValue}
            tabIndex={genTab}
            object={category}
            setObject={setCategory}
            validator={validator}
          />
          <ThumbnailTab
            tabValue={tabValue}
            tabIndex={thumbTab}
            thumbSrc={category.thumbnail}
            defaultThumbSrc={defaultThumbnail}
            onChange={(e) => { setCategory({ ...category, thumbnail: e.target.value }) }}
          />
          <BackgroundTab
            tabValue={tabValue}
            tabIndex={bgTab}
            thumbSrc={category.background}
            defaultThumbSrc={defaultBackground}
            onChange={(e) => { setCategory({ ...category, background: e.target.value }) }}
          />
        </>
      )}
    />
  );
}
