import * as React from 'react';
import Tab from '@mui/material/Tab';

import * as Feed from '../../Feed';
import * as Util from '../../Util';
import BackgroundTab from '../common/editor/BackgroundTab';
import GeneralTab from '../common/editor/GeneralTab';
import Editor from '../common/editor/Editor';
import EditorValidator from '../common/editor/EditorValidator'
import PropertiesTab from './PropertiesTab';
import SelectType from './SelectType';
import ThumbnailTab from '../common/editor/ThumbnailTab';
import { GlobalHolder, Global } from '../../Global';

import {
  AppRegistry, APP_TYPE_KEYS, LOG, isEmptyString
} from '@webrcade/app-common'
import Prefs from '../../Prefs';

// import * as deepmerge from 'deepmerge'
// const a = {a: 'a', b: { b1: 'b1', b2: 'b2'}}
// const b = {a: 'ba', b: { b1: 'bb1', b4: 'bb2'}}
// console.log(deepmerge(a,b));

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
            // Set default for doom type
            setDefaultForDoom(type, clone);
          }          
        }
        setItem(clone)

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
