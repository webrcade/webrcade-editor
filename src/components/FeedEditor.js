import * as React from 'react';
import Tab from '@mui/material/Tab';

import * as Util from '../Util';
import BackgroundTab from './common/editor/BackgroundTab';
import GeneralTab from './common/editor/GeneralTab';
import Editor from './common/editor/Editor';
import EditorMultiUrlField from './common/editor/EditorMultiUrlField';
import EditorSelect from './common/editor/EditorSelect';
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

  const [app, setApp] = React.useState("lynx");

  return (
    <EditorTabPanel value={tabValue} index={tabIndex}>
      <div>
        <EditorSelect
          label="Application"
          tooltip="The application (emulator, etc.) to edit feed settings for."
          value={app}
          menuItems={[
            { value: "lynx", name: "Atari Lynx" },
            { value: "coleco", name: "ColecoVision"},
            { value: "pcecd", name: "NEC PC Engine CD"},
            { value: "segacd", name: "Sega CD" },
            { value: "neogeo", name: "SNK Neo Geo" },
            { value: "psx", name: "Sony PlayStation" },
          ]}
          onChange={(e) => {
            setApp(e.target.value);
          }}
          sx={{ mb: 1.5 }}
        />
      </div>
      <div>
        {app === "coleco" && (
          <EditorUrlField
            sx={{ width: '50ch' }}
            label="Coleco ROM (URL)"
            onDropText={(text) => {
              const props = { ...object.props, coleco_rom: text }
              setObject({ ...object, props })
            }}
            onChange={(e) => {
              const props = { ...object.props, coleco_rom: e.target.value }
              setObject({ ...object, props })
            }}
            value={Util.asString(object.props.coleco_rom)}
          />
        )}
      </div>
      <div>
        {app === "lynx" && (
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
        )}
      </div>
      <div>
        {app === "neogeo" && (
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
        )}
      </div>
      <div>
        {app === "pcecd" && (
          <EditorUrlField
            sx={{ width: '50ch' }}
            label="PC Engine CD BIOS (URL)"
            onDropText={(text) => {
              const props = { ...object.props, pcecd_bios: text }
              setObject({ ...object, props })
            }}
            onChange={(e) => {
              const props = { ...object.props, pcecd_bios: e.target.value }
              setObject({ ...object, props })
            }}
            value={Util.asString(object.props.pcecd_bios)}
          />
        )}
      </div>
      <div>
        {app === "psx" && (
          <EditorMultiUrlField
            label="PlayStation BIOS (URLs)"
            rows={5}
            onDropText={(text) => {
              let urls = object.props.psx_bios ? object.props.psx_bios : [];
              if (Array.isArray(text)) {
                urls.push(...text);
              } else {
                urls.push(text);
              }
              urls = Util.removeEmptyItems(urls);
              const props = { ...object.props, psx_bios: urls }
              if (urls.length === 0) {
                delete props.psx_bios;
              }
              setObject({ ...object, props })
            }}
            onChange={(e) => {
              const val = e.target.value;
              let urls = Util.splitLines(val);
              //urls = Util.removeEmptyItems(urls);
              const props = { ...object.props, psx_bios: urls }
              if (urls.length === 0) {
                delete props.psx_bios;
              }
              setObject({ ...object, props })
            }}
            value={object.props.psx_bios && object.props.psx_bios.length > 0 ?
              object.props.psx_bios.join("\n") : ""}
          />
        )}
      </div>
      <div>
        {app === "segacd" && (
          <EditorMultiUrlField
            label="Sega CD BIOS (URLs)"
            rows={5}
            onDropText={(text) => {
              let urls = object.props.segacd_bios ? object.props.segacd_bios : [];
              if (Array.isArray(text)) {
                urls.push(...text);
              } else {
                urls.push(text);
              }
              urls = Util.removeEmptyItems(urls);
              const props = { ...object.props, segacd_bios: urls }
              if (urls.length === 0) {
                delete props.segacd_bios;
              }
              setObject({ ...object, props })
            }}
            onChange={(e) => {
              const val = e.target.value;
              let urls = Util.splitLines(val);
              //urls = Util.removeEmptyItems(urls);
              const props = { ...object.props, segacd_bios: urls }
              if (urls.length === 0) {
                delete props.segacd_bios;
              }
              setObject({ ...object, props })
            }}
            value={object.props.segacd_bios && object.props.segacd_bios.length > 0 ?
              object.props.segacd_bios.join("\n") : ""}
          />
        )}
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
