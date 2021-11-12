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

const addValidatorCallback = (id, cb) => {
  validator.addCallback(id, cb);
}

export default function CategoryEditor(props) {
  const [tabValue, setTabValue] = React.useState(0);
  const [category, setCategory] = React.useState({});
  const [isOpen, setOpen] = React.useState(false);
  const [isCreate, setCreate] = React.useState(false);

  GlobalHolder.setCategoryEditorOpen = (open, isCreate = false) => {
    setCreate(isCreate);
    setOpen(open);
  }
  GlobalHolder.setEditCategory = setCategory;

  const forceUpdate = Util.useForceUpdate();

  const genTab = 0;
  const thumbTab = 1;
  const bgTab = 2;

  return (
    <Editor
      title={`${isCreate ? "Create" : "Edit"} Category`}
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
        validator.executeCallbacks();
        const minTab = validator.getMinInvalidTab();
        if (minTab >= 0) {
          setTabValue(minTab);
          forceUpdate();
          return false;
        }

        // Get the feed
        const feed = Global.getFeed();
        // Replace the category in the feed
        if (isCreate) {
          Feed.addCategoryToFeed(feed, category);
        } else {
          Feed.replaceCategory(feed, category.id, category);
        }
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
            addValidateCallback={addValidatorCallback}
          />
          <ThumbnailTab
            tabValue={tabValue}
            tabIndex={thumbTab}
            thumbSrc={category.thumbnail}
            defaultThumbSrc={CategoryThumbImage}
            object={category}
            setObject={setCategory}
          />
          <BackgroundTab
            tabValue={tabValue}
            tabIndex={bgTab}
            thumbSrc={category.background}
            defaultThumbSrc={CategoryBackgroundImage}
            object={category}
            setObject={setCategory}
          />
        </>
      )}
    />
  );
}
