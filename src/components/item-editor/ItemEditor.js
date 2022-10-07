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
  return GameRegistry.getAutoCompleteOptions(alias);
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
  for (const p in defaults) {
    if (item.props[p] === undefined) {
      item.props[p] = defaults[p];
    }
  }
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

export default function ItemEditor(props) {
  const [tabValue, setTabValue] = React.useState(0);
  const [item, setItem] = React.useState({});
  const [isOpen, setOpen] = React.useState(false);
  const [isCreate, setCreate] = React.useState(false);

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

  const genTab = 0;
  const propsTab = 1;
  const thumbTab = 2;
  const bgTab = 3;

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
          if (!isEmptyString(type)) {
            clone.type = type;
            // Set defaults
            // TODO: Move to common location, hide specific types
            setDefaultForDoom(type, clone);
            setDefaultForPsx(type, clone);
          }
        }
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

        //  console.log(AppRegistry.instance.getDefaultsForType(item.type));
        //  console.log(item);

        // Remove the default values
        removeDefaults(item, AppRegistry.instance.getDefaultsForType(item.type));
        // PSX
        setDefaultForPsx(item.type, item); // TODO: Find a better way, maybe required id? on the type

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
                    const type = e.target.value;
                    applyDefaults(item, type)

                    if (isCreate) {
                      Prefs.setLastNewType(type);
                    }

                    //  Set the default when Doom type is selected
                    setDefaultForDoom(type, item);
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
