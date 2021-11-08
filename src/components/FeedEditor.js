import * as React from 'react';
import Tab from '@mui/material/Tab';

import * as Util from '../Util';
import BackgroundTab from './common/editor/BackgroundTab';
import GeneralTab from './common/editor/GeneralTab';
import Editor from './common/editor/Editor';
import EditorValidator from './common/editor/EditorValidator'
import ThumbnailTab from './common/editor/ThumbnailTab';
import { GlobalHolder, Global } from '../Global';

import {
  FeedBackgroundImage,
  FeedThumbImage
} from '@webrcade/app-common'

const validator = new EditorValidator();

const addValidatorCallback = (id, cb) => {
  validator.addCallback(id, cb);
}

export default function FeedEditor(props) {
  const [tabValue, setTabValue] = React.useState(0);
  const [feed, setFeed] = React.useState({});
  const [isOpen, setOpen] = React.useState(false);

  GlobalHolder.setFeedEditorOpen = setOpen;
  GlobalHolder.setEditFeed = setFeed;

  const forceUpdate = Util.useForceUpdate();

  const genTab = 0;
  const thumbTab = 1;
  const bgTab = 2;

  return (
    <Editor
      title="Edit Feed"
      isOpen={isOpen}
      setOpen={setOpen}
      tabValue={tabValue}
      setTabValue={setTabValue}
      onShow={() => {
        validator.reset();
        setFeed(Util.cloneObject(feed))
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
            object={feed}
            setObject={setFeed}
            validator={validator}
            addValidateCallback={addValidatorCallback}
          />
          <ThumbnailTab
            tabValue={tabValue}
            tabIndex={thumbTab}
            thumbSrc={feed.thumbnail}
            defaultThumbSrc={FeedThumbImage}
            onChange={(e) => { setFeed({ ...feed, thumbnail: e.target.value }) }}
          />
          <BackgroundTab
            tabValue={tabValue}
            tabIndex={bgTab}
            thumbSrc={feed.background}
            defaultThumbSrc={FeedBackgroundImage}
            onChange={(e) => { setFeed({ ...feed, background: e.target.value }) }}
          />
        </>
      )}
    />
  );
}
