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
import EditorTextField from './common/editor/EditorTextField';
import EditorValidator from './common/editor/EditorValidator'
import ThumbnailTab from './common/editor/ThumbnailTab';
import { GlobalHolder, Global } from '../Global';

import {
  AppRegistry,
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

  const is5200Enabled = AppRegistry.instance.getAppTypes()["5200"];

  const [app, setApp] = React.useState("3do");

  const items = [
    { value: "3do", name: "3DO" },
    { value: "lynx", name: "Atari Lynx" },
    { value: "coleco", name: "ColecoVision"},
    { value: "commodore", name: "Commodore (8-bit)"},
    { value: "pcecd", name: "NEC PC Engine CD"},
    { value: "pcfx", name: "NEC PC-FX"},
    { value: "ds", name: "Nintendo DS" },
    { value: "nes", name: "Nintendo NES"},
    { value: "segacd", name: "Sega CD" },
    { value: "neogeo", name: "SNK Neo Geo" },
    { value: "neogeocd", name: "SNK Neo Geo CD" },
    { value: "psx", name: "Sony PlayStation" },
  ]
  if (is5200Enabled) {
    items.splice(1, 0, { value: "5200", name: "Atari 5200" });
  }

  return (
    <EditorTabPanel value={tabValue} index={tabIndex}>
      <div>
        <EditorSelect
          label="Application"
          tooltip="The application (emulator, etc.) to edit feed settings for."
          value={app}
          menuItems={items}
          onChange={(e) => {
            setApp(e.target.value);
          }}
          sx={{ mb: 1.5 }}
        />
      </div>
      <div>
        {is5200Enabled && app === "5200" && (
          <EditorUrlField
            sx={{ width: '50ch' }}
            label="Atari 5200 ROM (URL)"
            onDropText={(text) => {
              const props = { ...object.props, atari5200_rom: text }
              setObject({ ...object, props })
            }}
            onChange={(e) => {
              const props = { ...object.props, atari5200_rom: e.target.value }
              setObject({ ...object, props })
            }}
            value={Util.asString(object.props.atari5200_rom)}
          />
        )}
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
        {app === "nes" && (
          <EditorUrlField
            sx={{ width: '50ch' }}
            label="Famicom Disk System ROM (URL)"
            onDropText={(text) => {
              const props = { ...object.props, fds_bios: text }
              setObject({ ...object, props })
            }}
            onChange={(e) => {
              const props = { ...object.props, fds_bios: e.target.value }
              setObject({ ...object, props })
            }}
            value={Util.asString(object.props.fds_bios)}
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
        {app === "neogeocd" && (
          <EditorUrlField
            sx={{ width: '50ch' }}
            label="Neo Geo CD BIOS (URL)"
            onDropText={(text) => {
              const props = { ...object.props, neogeocd_bios: text }
              setObject({ ...object, props })
            }}
            onChange={(e) => {
              const props = { ...object.props, neogeocd_bios: e.target.value }
              setObject({ ...object, props })
            }}
            value={Util.asString(object.props.neogeocd_bios)}
          />
        )}
      </div>
      <div>
        {app === "3do" && (
          <EditorUrlField
            sx={{ width: '50ch' }}
            label="3DO BIOS (URL)"
            onDropText={(text) => {
              const props = { ...object.props, threedo_bios: text }
              setObject({ ...object, props })
            }}
            onChange={(e) => {
              const props = { ...object.props, threedo_bios: e.target.value }
              setObject({ ...object, props })
            }}
            value={Util.asString(object.props.threedo_bios)}
          />
        )}
      </div>
      <div>
        {app === "3do" && (
          <EditorUrlField
            sx={{ width: '50ch' }}
            label="3DO Fonts (URL)"
            helperText="Required for some Japanese games (optional)"
            onDropText={(text) => {
              const props = { ...object.props, threedo_fonts: text }
              setObject({ ...object, props })
            }}
            onChange={(e) => {
              const props = { ...object.props, threedo_fonts: e.target.value }
              setObject({ ...object, props })
            }}
            value={Util.asString(object.props.threedo_fonts)}
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
        {app === "pcfx" && (
          <EditorUrlField
            sx={{ width: '50ch' }}
            label="PC-FX BIOS (URL)"
            onDropText={(text) => {
              const props = { ...object.props, pcfx_bios: text }
              setObject({ ...object, props })
            }}
            onChange={(e) => {
              const props = { ...object.props, pcfx_bios: e.target.value }
              setObject({ ...object, props })
            }}
            value={Util.asString(object.props.pcfx_bios)}
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
        {app === "ds" && (
          <EditorMultiUrlField
            label="Nintendo DS (URLs)"
            rows={5}
            onDropText={(text) => {
              let urls = object.props.ds_bios ? object.props.ds_bios : [];
              if (Array.isArray(text)) {
                urls.push(...text);
              } else {
                urls.push(text);
              }
              urls = Util.removeEmptyItems(urls);
              const props = { ...object.props, ds_bios: urls }
              if (urls.length === 0) {
                delete props.ds_bios;
              }
              setObject({ ...object, props })
            }}
            onChange={(e) => {
              const val = e.target.value;
              let urls = Util.splitLines(val);
              //urls = Util.removeEmptyItems(urls);
              const props = { ...object.props, ds_bios: urls }
              if (urls.length === 0) {
                delete props.ds_bios;
              }
              setObject({ ...object, props })
            }}
            value={object.props.ds_bios && object.props.ds_bios.length > 0 ?
              object.props.ds_bios.join("\n") : ""}
          />
        )}
      </div>
      <div>
        {app === "ds" && (
            <EditorTextField
              label="Nickname"
              onDropText={(text) => {
                const props = { ...object.props, ds_nickname: text }
                setObject({ ...object, props })
              }}
              onChange={(e) => {
                const props = { ...object.props, ds_nickname: e.target.value }
                setObject({ ...object, props })
              }}
              value={Util.asString(object.props.ds_nickname)}
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
      <div>
        {app === "commodore" && (
          <EditorMultiUrlField
            label="Commodore (8-bit) BIOS (URLs)"
            rows={5}
            onDropText={(text) => {
              let urls = object.props.commodore8bit_bios ? object.props.commodore8bit_bios : [];
              if (Array.isArray(text)) {
                urls.push(...text);
              } else {
                urls.push(text);
              }
              urls = Util.removeEmptyItems(urls);
              const props = { ...object.props, commodore8bit_bios: urls }
              if (urls.length === 0) {
                delete props.commodore8bit_bios;
              }
              setObject({ ...object, props })
            }}
            onChange={(e) => {
              const val = e.target.value;
              let urls = Util.splitLines(val);
              //urls = Util.removeEmptyItems(urls);
              const props = { ...object.props, commodore8bit_bios: urls }
              if (urls.length === 0) {
                delete props.commodore8bit_bios;
              }
              setObject({ ...object, props })
            }}
            value={object.props.commodore8bit_bios && object.props.commodore8bit_bios.length > 0 ?
              object.props.commodore8bit_bios.join("\n") : ""}
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
