import * as React from 'react';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Tab from '@mui/material/Tab';

import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';

import * as Feed from '../../Feed';
import * as Util from '../../Util';
import BackgroundTab from '../common/editor/BackgroundTab';
import GeneralTab from '../common/editor/GeneralTab';
import Editor from '../common/editor/Editor';
import EditorTextField from '../common/editor/EditorTextField';
import EditorValidator from '../common/editor/EditorValidator'
import GameRegistry from '../../GameRegistry';
import PropertiesTab from './PropertiesTab';
import SelectType from './SelectType';
import ThumbnailTab from '../common/editor/ThumbnailTab';
import { GlobalHolder, Global } from '../../Global';

import A2600ControllersTab from './a2600/A2600ControllersTab';
import A5200DescriptionsTab from './a5200/A5200DescriptionsTab';
import A5200MappingsTab from './a5200/A5200MappingsTab';
import ColecoDescriptionsTab from './coleco/ColecoDescriptionsTab';
import ColecoMappingsTab from './coleco/ColecoMappingsTab';
import C64MappingsTab from './c64/C64MappingsTab';

import {
  AppRegistry, APP_TYPE_KEYS, LOG, isEmptyString, uuidv4
} from '@webrcade/app-common'
import Prefs from '../../Prefs';

// import * as deepmerge from 'deepmerge'
// const a = {a: 'a', b: { b1: 'b1', b2: 'b2'}}
// const b = {a: 'ba', b: { b1: 'bb1', b4: 'bb2'}}
// console.log(deepmerge(a,b));

const filterOptions = createFilterOptions({
  matchFrom: 'any',
  limit: 50,
});

const getAutoCompleteOptions = (type) => {
  if (!type) return [];
  const alias = AppRegistry.instance.getAlias(type);
  if (!alias) return [];
  const options = GameRegistry.getAutoCompleteOptions(alias);
  if (options) {
    options.sort(
      function(a, b) {
        a = a.title.toLowerCase();
        b = b.title.toLowerCase();
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
    });
  }
  return options;
}

const isDebug = Global.isDebug();
const validator = new EditorValidator();

const addValidatorCallback = (id, cb) => {
  validator.addCallback(id, cb);
}

const removeDefaults = (item, defaults) => {
  const clonedProps = Util.cloneObject(item.props);
  for (const p in clonedProps) {
    if (defaults[p] === undefined ||
      defaults[p] === clonedProps[p]) {
      delete item.props[p];
    }
  }
}

const applyDefaults = (item, type) => {
  const defaults = AppRegistry.instance.getDefaultsForType(type);
  console.log(defaults)
  for (const p in defaults) {
    if (item.props[p] === undefined) {
      item.props[p] = defaults[p];
    }
  }
  console.log(item)
}

const setDefaultForDoom = (type, item) => {
  //  Set the default when Doom type is selected
  if (type === APP_TYPE_KEYS.PRBOOM ||
    type === APP_TYPE_KEYS.DOOM) {
    if (isEmptyString(item.props.game)) {
      item.props.game = 'freedoom1';
    }
  }
}

const setDefaultForPsx = (type, item) => {
  if (type === APP_TYPE_KEYS.BEETLE_PSX ||
    type === APP_TYPE_KEYS.PSX) {
    if (isEmptyString(item.props.uid)) {
      item.props.uid = uuidv4();
    }
  }
}

const setDefaultForSegaCd = (type, item) => {
  if (type === APP_TYPE_KEYS.RETRO_GENPLUSGX_SEGACD ||
    type === APP_TYPE_KEYS.SEGACD) {
    if (isEmptyString(item.props.uid)) {
      item.props.uid = uuidv4();
    }
  }
}

const setDefaultForPcEngineCd = (type, item) => {
  if (type === APP_TYPE_KEYS.RETRO_PCE_FAST ||
    type === APP_TYPE_KEYS.PCECD) {
    if (isEmptyString(item.props.uid)) {
      item.props.uid = uuidv4();
    }
  }
}

const setDefaultForNeoGeoCd = (type, item) => {
  if (type === APP_TYPE_KEYS.RETRO_NEOCD ||
    type === APP_TYPE_KEYS.NEOGEOCD) {
    if (isEmptyString(item.props.uid)) {
      item.props.uid = uuidv4();
    }
    if (item.props.cdSpeedHack === undefined) {
      item.props.cdSpeedHack = true;
    }
    if (item.props.skipCdLoading === undefined) {
      item.props.skipCdLoading = true;
    }
  }
}

const setDefaultFor3do = (type, item) => {
  if (type === APP_TYPE_KEYS.RETRO_OPERA ||
    type === APP_TYPE_KEYS.THREEDO) {
    if (isEmptyString(item.props.uid)) {
      item.props.uid = uuidv4();
    }
  }
}

const setDefaultForCommodore8Bit = (type, item) => {
  if (type === APP_TYPE_KEYS.COMMODORE_C64 ||
    type === APP_TYPE_KEYS.RETRO_COMMODORE_C64) {
    if (isEmptyString(item.props.uid)) {
      item.props.uid = uuidv4();
    }
    if (item.props.saveDisks === undefined) {
      item.props.saveDisks = 1;
    }
    if (!item.props.mappings || Object.keys(item.props.mappings).length === 0) {
      item.props.mappings = {
        "start": "return",
        // "left": "joy-left",
        // "right": "joy-right",
        // "up": "joy-up",
        // "down": "joy-down",
        "a": "fire1",
        "b": "fire2",
        "y": "space",
        "lb": "runstop",
        "rb": "f1"
      };
    }
  }
}


const setDefaultForSaturn = (type, item) => {
  if (type === APP_TYPE_KEYS.RETRO_YABAUSE ||
    type === APP_TYPE_KEYS.SATURN) {
    if (isEmptyString(item.props.uid)) {
      item.props.uid = uuidv4();
    }
  }
}

const setDefaultForPcfx = (type, item) => {
  if (type === APP_TYPE_KEYS.BEETLE_PCFX ||
    type === APP_TYPE_KEYS.PCFX) {
    if (isEmptyString(item.props.uid)) {
      item.props.uid = uuidv4();
    }
  }
}

const setDefaultForColeco = (type, item) => {
  if (type === APP_TYPE_KEYS.COLECO ||
    type === APP_TYPE_KEYS.COLEM) {
    if (!item.props.mappings || Object.keys(item.props.mappings).length === 0) {
      item.props.mappings = {
        "a": "firel",
        "b": "firer",
      };
    }
  }
}

const setDefaultForA5200 = (type, item) => {
  if (type === APP_TYPE_KEYS.A5200 ||
    type === APP_TYPE_KEYS.RETRO_A5200) {
    if (!item.props.mappings || Object.keys(item.props.mappings).length === 0) {
      item.props.mappings = {
        "a": "bottomfire",
        "b": "topfire",
      };
    }
  }
}

const setDefaultForQuake = (type, item) => {
  if (type === APP_TYPE_KEYS.QUAKE ||
    type === APP_TYPE_KEYS.TYRQUAKE) {
    if (isEmptyString(item.props.uid)) {
      item.props.uid = uuidv4();
    }
  }
}

const setDefaultForDosBox = (type, item) => {
  if (type === APP_TYPE_KEYS.DOS ||
    type === APP_TYPE_KEYS.RETRO_DOSBOX_PURE) {
    if (isEmptyString(item.props.uid)) {
      item.props.uid = uuidv4();
    }
  }
}


const setDefaultForScumm = (type, item) => {
  if (type === APP_TYPE_KEYS.SCUMM ||
    type === APP_TYPE_KEYS.SCUMMVM) {
    if (isEmptyString(item.props.uid)) {
      item.props.uid = uuidv4();
    }
  }
}

export default function ItemEditor(props) {
  const [tabValue, setTabValue] = React.useState(0);
  const [item, setItem] = React.useState({});
  const [isOpen, setOpen] = React.useState(false);
  const [isCreate, setCreate] = React.useState(false);

  const isColeco = (item.type === APP_TYPE_KEYS.COLEM || item.type === APP_TYPE_KEYS.COLECO);
  const isC64 = (item.type === APP_TYPE_KEYS.COMMODORE_C64 || item.type === APP_TYPE_KEYS.RETRO_COMMODORE_C64);
  const isA5200 = (item.type === APP_TYPE_KEYS.A5200 || item.type === APP_TYPE_KEYS.RETRO_A5200);
  const isA2600 = (item.type === APP_TYPE_KEYS.A2600 || item.type === APP_TYPE_KEYS.RETRO_STELLA || item.type === APP_TYPE_KEYS.RETRO_STELLA_LATEST);

  GlobalHolder.setItemEditorOpen = (open, isCreate = false) => {
    setCreate(isCreate);
    setOpen(open);
  }

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

  let index = 0;
  let genTab = index++;
  let propsTab = index++;

  let a5200MappingsTab = 0;
  let a5200DescriptionsTab = 0;
  if (isA5200) {
    a5200MappingsTab = index++;
    a5200DescriptionsTab = index++;
  }

  let colecoMappingsTab = 0;
  let colecoDescriptionsTab = 0;
  if (isColeco) {
    colecoMappingsTab = index++;
    colecoDescriptionsTab = index++;
  }

  let a2600ControllersTab = 0;
  if (isA2600) {
    a2600ControllersTab = index++;
  }

  let c64MappingsTab = 0;
  if (isC64) {
    c64MappingsTab = index++;
  }

  let thumbTab = index++;
  let bgTab = index++;

  const tabs = [
    <Tab label="General" key={genTab} />,
    <Tab label="Properties" key={propsTab} />
  ];
  if (isA5200) {
    tabs.push(<Tab label="Mappings" key={a5200MappingsTab} />);
    tabs.push(<Tab label="Descriptions" key={a5200DescriptionsTab} />);
  }
  if (isColeco) {
    tabs.push(<Tab label="Mappings" key={colecoMappingsTab} />);
    tabs.push(<Tab label="Descriptions" key={colecoDescriptionsTab} />);
  }
  if (isA2600) {
    tabs.push(<Tab label="Controllers" key={a2600ControllersTab} />);
  }
  if (isC64) {
    tabs.push(<Tab label="Mappings" key={c64MappingsTab} />);
  }
  tabs.push(<Tab label="Thumbnail" key={thumbTab} />);
  tabs.push(<Tab label="Background" key={bgTab} />);

  const setDefaultsForType = (type, object) => {
    setDefaultForDoom(type, object);
    setDefaultForPsx(type, object);
    setDefaultForSegaCd(type, object);
    setDefaultForPcEngineCd(type, object);
    setDefaultForPcfx(type, object);
    setDefaultForColeco(type, object);
    setDefaultForA5200(type, object);
    setDefaultForQuake(type, object);
    setDefaultForDosBox(type, object);
    setDefaultForScumm(type, object);
    setDefaultForNeoGeoCd(type, object);
    setDefaultFor3do(type, object);
    setDefaultForCommodore8Bit(type, object);
    setDefaultForSaturn(type, object);
  }

  return (
    <Editor
      title={`${isCreate ? "Create" : "Edit"} Item`}
      isOpen={isOpen}
      setOpen={setOpen}
      tabValue={tabValue}
      setTabValue={setTabValue}
      onShow={() => {
        validator.reset();
        const clone = Util.cloneObject(item);
        if (isCreate) {
          const type = Prefs.getLastNewType();
          if (!isEmptyString(type) && AppRegistry.instance.getAppTypes()[type]) {
            clone.type = type;
          }
        }
        setDefaultsForType(clone.type, clone);
        setItem(clone);
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

        // Remove the default values
        removeDefaults(item, AppRegistry.instance.getDefaultsForType(item.type));
        setDefaultsForType(item.type, item);

        if (isDebug) {
          LOG.info(item);
        }

        // Get the feed
        const feed = Global.getFeed();

        if (isCreate) {
          Feed.addItemsToCategory(feed, Global.getFeedCategoryId(), [item]);
        } else {
          // Replace the item in the feed
          Feed.replaceItem(feed, Global.getFeedCategoryId(), item.id, item);
        }
        // Update the feed (shallow clone)
        Global.setFeed({ ...feed });

        return true;
      }}
      tabs={tabs}
      tabPanels={(
        <>
          <GeneralTab
            tabValue={tabValue}
            tabIndex={genTab}
            object={item}
            setObject={setItem}
            validator={validator}
            addValidateCallback={addValidatorCallback}
            nameField={
              <div>
                <Autocomplete
                  id="title autocomplete"
                  // sx={{ width: 300 }}
                  options={getAutoCompleteOptions(item.type)}
                  getOptionLabel={(option) => {return option && option.title ? option.title : option}}
                  filterOptions={filterOptions}
                  freeSolo
                  inputValue={Util.asString(item.title)}
                  disableClearable
                  onChange={(e, v, r) => {
                    let title = "";
                    if (r === 'selectOption') {
                      title = v.title;
                      Global.openBusyScreen(true, "Loading...", true, false);
                      setTimeout(async () => {
                        try {
                          const info = v.byName ?
                            await GameRegistry.findByName(v.key, null, null, true, false) :
                            await GameRegistry.find(v.key);

                          const update = {
                            title: title,
                            description: "",
                            thumbnail: "",
                            background: ""
                          }
                          if (info.description) {
                            update.description = info.description;
                          }
                          if (info.thumbnail) {
                            update.thumbnail = info.thumbnail;
                          }
                          if (info.background) {
                            update.background = info.background;
                            update.backgroundPixelated = true;
                          }

                          // Set 3DO hack.
                          // TODO: This should be moved to common location for use by all
                          // types.
                          let props = null;
                          if (item.type === '3do') {
                            props = {hack: 0}
                            const hack = info.props?.hack;
                            if (hack) {
                              props.hack = hack;
                            }
                          }

                          if (props) {
                            update.props = {...item.props, ...props}
                          }

                          setItem({...item, ...update})
                        } finally {
                          Global.openBusyScreen(false);
                        }
                      }, 0);
                    }
                    if (r === 'createOption') {
                      title = v;
                    }
                    if (r === 'clear') {
                      title = "";
                    }

                    setItem({ ...item, title: title })
                  }}
                  renderInput={(params) => (
                    <EditorTextField
                      {...params}
                      required
                      label="Title"
                      onDropText={(text) => { setItem({ ...item, title: text }) }}
                      onChange={(e) => { setItem({ ...item, title: e.target.value }) }}
                      // value={Util.asString(item.title)}
                      error={!validator.isValid(genTab, "title")}
                    />
                  )}
                  renderOption={(props, option, { inputValue }) => {
                    const matches = match(option.title, inputValue);
                    const parts = parse(option.title, matches);
                    return (
                      <li {...props}>
                        <div>
                          {parts.map((part, index) => (
                            <span
                              key={index}
                              style={{
                                fontWeight: part.highlight ? 700 : 400,
                              }}
                            >
                              {part.text}
                            </span>
                          ))}
                        </div>
                      </li>
                    );
                  }}
                />
              </div>
            }
            otherFields={
              <div>
                <SelectType
                  item={item}
                  setItem={setItem}
                  onChange={(e) => {
                    const oldType = item.type;
                    const type = e.target.value;

                    let sameBaseType = false;
                    if (oldType && type) {
                      // If the old and new have the same alias, don't clear
                      const oldAlias = AppRegistry.instance.getAlias(oldType);
                      const newAlias = AppRegistry.instance.getAlias(type);
                      if (oldAlias === newAlias) {
                        sameBaseType = true;
                      }
                    }

                    if (!sameBaseType) {
                      // Clear props on type change
                      item.props = {};
                    }

                    applyDefaults(item, type)
                    setDefaultsForType(type, item);
                    if (isCreate) {
                      Prefs.setLastNewType(type);
                    }
                  }}
                />
              </div>
            }
          />
          <PropertiesTab
            tabValue={tabValue}
            tabIndex={propsTab}
            object={item}
            setObject={setItem}
            validator={validator}
            addValidateCallback={addValidatorCallback}
          />
          {isA5200 && <A5200MappingsTab
            tabValue={tabValue}
            tabIndex={a5200MappingsTab}
            object={item}
            setObject={setItem}
          />}
          {isA5200 && <A5200DescriptionsTab
            tabValue={tabValue}
            tabIndex={a5200DescriptionsTab}
            object={item}
            setObject={setItem}
          />}
          {isC64 && <C64MappingsTab
            tabValue={tabValue}
            tabIndex={c64MappingsTab}
            object={item}
            setObject={setItem}
          />}
          {isColeco && <ColecoMappingsTab
            tabValue={tabValue}
            tabIndex={colecoMappingsTab}
            object={item}
            setObject={setItem}
          />}
          {isColeco && <ColecoDescriptionsTab
            tabValue={tabValue}
            tabIndex={colecoDescriptionsTab}
            object={item}
            setObject={setItem}
          />}
          {isA2600 && <A2600ControllersTab
            tabValue={tabValue}
            tabIndex={a2600ControllersTab}
            object={item}
            setObject={setItem}
          />}
          <ThumbnailTab
            tabValue={tabValue}
            tabIndex={thumbTab}
            thumbSrc={item.thumbnail}
            defaultThumbSrc={defaultThumbnail}
            object={item}
            setObject={setItem}
          />
          <BackgroundTab
            tabValue={tabValue}
            tabIndex={bgTab}
            thumbSrc={item.background}
            defaultThumbSrc={defaultBackground}
            object={item}
            setObject={setItem}
          />
        </>
      )}
    />
  );
}
