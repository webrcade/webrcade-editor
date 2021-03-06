import * as React from 'react';
import Tab from '@mui/material/Tab';

import * as Util from '../Util';
import BackgroundTab from './common/editor/BackgroundTab';
import GeneralTab from './common/editor/GeneralTab';
import Editor from './common/editor/Editor';
import EditorTabPanel from './common/editor/EditorTabPanel';
import EditorUrlField from './common/editor/EditorUrlField';
import EditorValidator from './common/editor/EditorValidator'
import ThumbnailTab from './common/editor/ThumbnailTab';
import { GlobalHolder, Global } from '../Global';

import {
  FeedBackgroundImage,
  FeedThumbImage
} from '@webrcade/app-common'


function PropertiesTab(props) {
  const {
    tabValue,
    tabIndex,
    setObject,
    object
  } = props;

  return (
    <EditorTabPanel value={tabValue} index={tabIndex}>
      <div>
        <EditorUrlField
          sx={{ width: '50ch' }}
          label="Lynx Boot ROM (URL)"
          onDropText={(text) => {
            const props = { ...object.props, lnx_boot: text }
            setObject({ ...object, props })
          }}
          onChange={(e) => {
            const props = { ...object.props, lnx_boot: e.target.value }
            setObject({ ...object, props })
          }}
          value={Util.asString(object.props.lnx_boot)}
        />
      </div>
      <div>
        <EditorUrlField
          sx={{ width: '50ch' }}
          label="Neo Geo BIOS (URL)"
          onDropText={(text) => {
            const props = { ...object.props, neogeo_bios: text }
            setObject({ ...object, props })
          }}
          onChange={(e) => {
            const props = { ...object.props, neogeo_bios: e.target.value }
            setObject({ ...object, props })
          }}
          value={Util.asString(object.props.neogeo_bios)}
        />
      </div>
    </EditorTabPanel>
  );
}

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
  const propsTab = 1;
  const thumbTab = 2;
  const bgTab = 3;

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
        <Tab label="Properties" key={propsTab} />,
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
          <PropertiesTab
            tabValue={tabValue}
            tabIndex={propsTab}
            object={feed}
            setObject={setFeed}
          />
          <ThumbnailTab
            tabValue={tabValue}
            tabIndex={thumbTab}
            thumbSrc={feed.thumbnail}
            defaultThumbSrc={FeedThumbImage}
            object={feed}
            setObject={setFeed}
          />
          <BackgroundTab
            tabValue={tabValue}
            tabIndex={bgTab}
            thumbSrc={feed.background}
            defaultThumbSrc={FeedBackgroundImage}
            object={feed}
            setObject={setFeed}
          />
        </>
      )}
    />
  );
}
