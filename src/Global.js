import * as Util from './Util';

class Holder {
  static instance = Holder.instance || new Holder();

  setBusyScreenOpen = null;
  setBusyScreenMessage = null;
  setEditItem = null;
  setFeed = null;
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
}

const GlobalHolder = Holder.instance;

const Global = {
  openBusyScreen: (open, message = null) => {
    GlobalHolder.setBusyScreenOpen(open);
    if (open && message) {
      GlobalHolder.setBusyScreenMessage(message);
    }
  },
  openItemEditor: (open) => {
    GlobalHolder.setItemEditorOpen(open);
  },
  openImportDialog: (open) => {
    GlobalHolder.setImportDialogOpen(open);
  },
  editItem: (item) => {
    Global.openItemEditor(true);
    GlobalHolder.setEditItem(Util.cloneObject(item));
  },
  openCategoryEditor: (open) => {
    GlobalHolder.setCategoryEditorOpen(open);
  },
  editCategory: (cat) => {
    Global.openCategoryEditor(true);
    GlobalHolder.setEditCategory(Util.cloneObject(cat));
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
  },
  getFeed: () => {
    return GlobalHolder.getFeed();
  },
  getFeedCategoryId: () => {
    return GlobalHolder.getFeedCategoryId();
  },
  setFeedCategoryId: (id) => {
    return GlobalHolder.setFeedCategoryId(id);
  }
}

export { Global, GlobalHolder };