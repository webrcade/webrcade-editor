import {
  AppProps,
  UrlUtil
} from '@webrcade/app-common'

import { addId } from './Feed';
import Prefs from './Prefs';
import * as Util from './Util';

class Holder {
  static instance = Holder.instance || new Holder();

  setBusyScreenOpen = null;
  setBusyScreenMessage = null;
  setEditItem = null;
  setFeed = null;
  setApp = null;
  getFeed = null;
  setFeedCategoryId = null;
  getFeedCategoryId = null;
  setMessage = null;
  setMessageSeverity = null;
  toggleDrawer = null;
  setItemEditorOpen = null;
  setImportDialogOpen = null;
  setCategoryEditorOpen = null;
  setEditCategory = null;
  setFeedEditorOpen = null;
  setEditFeed = null;
  setCreateFromUrlDialogOpen = null;
  setConfirmDialogOpen = null;
  setConfirmDialogProps = null;
  setLoadFeedDialogOpen = null;
  isDebug = UrlUtil.getBoolParam(window.location.search, AppProps.RP_DEBUG); 
}

const GlobalHolder = Holder.instance;

const THUMB_SIZE = [400, 300];

const Global = {
  isDebug: () => {
    return GlobalHolder.isDebug
  },
  openBusyScreen: (open, message = null) => {
    GlobalHolder.setBusyScreenOpen(open);
    if (open && message) {
      GlobalHolder.setBusyScreenMessage(message);
    } else {
      GlobalHolder.setBusyScreenMessage("");
    }
  },
  openItemEditor: (open, isCreate = false) => {
    GlobalHolder.setItemEditorOpen(open, isCreate);
  },
  openLoadFeedDialog: (open) => {
    GlobalHolder.setLoadFeedDialogOpen(true);
  },
  openConfirmDialog: (open, title, message, callback) => {    
    if (title && message && callback) {
      GlobalHolder.setConfirmDialogProps({
        title: title,
        message: message,
        callback: callback
      });
    }
    GlobalHolder.setConfirmDialogOpen(open);
  },
  openImportDialog: (open) => {
    GlobalHolder.setImportDialogOpen(open);
  },
  openCreateFromUrlDialog: (open) => {
    GlobalHolder.setCreateFromUrlDialogOpen(open);
  },
  editItem: (item) => {
    Global.openItemEditor(true);
    GlobalHolder.setEditItem(Util.cloneObject(item));
  },
  createNewItem: () => {
    Global.openItemEditor(true, true);
    const newItem = {
      props: {}, type: "2600"
    };
    addId(newItem);
    GlobalHolder.setEditItem(newItem);
  },
  openCategoryEditor: (open, isCreate = false) => {
    GlobalHolder.setCategoryEditorOpen(open, isCreate);
  },
  openFeedEditor: (open) => {
    GlobalHolder.setFeedEditorOpen(open);
  },
  editCategory: (cat) => {
    Global.openCategoryEditor(true);
    GlobalHolder.setEditCategory(Util.cloneObject(cat));
  },
  createNewCategory: () => {
    Global.openCategoryEditor(true, true);
    const newCat = {};
    addId(newCat);
    GlobalHolder.setEditCategory(newCat);
  },
  editFeed: (feed) => {
    Global.openFeedEditor(true);
    GlobalHolder.setEditFeed(Util.cloneObject(feed));
  },
  toggleDrawer: () => {
    GlobalHolder.toggleDrawer();
  },
  displayMessage(message, severity) {
    GlobalHolder.setMessage(message);
    GlobalHolder.setMessageSeverity(severity);
  },
  setFeed: (feed) => {
    GlobalHolder.setFeed(feed);
    Prefs.setFeed(feed);
  },
  getFeed: () => {
    return GlobalHolder.getFeed();
  },
  getFeedCategoryId: () => {
    return GlobalHolder.getFeedCategoryId();
  },
  setFeedCategoryId: (id) => {
    return GlobalHolder.setFeedCategoryId(id);
  },
  getThumbSize: () => {
    return THUMB_SIZE;
  },
  setApp: (app) => {
    GlobalHolder.setApp(app);
  }
}

export { Global, GlobalHolder };