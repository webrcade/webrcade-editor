class Holder {
  static instance = Holder.instance || new Holder();

  setBusyScreenOpen = null;
  setBusyScreenMessage = null;
  setEditItem = null;
  setFeed = null;
  setFeedCategoryId = null;
  setMessage = null;  
  setMessageSeverity = null;
  toggleDrawer = null;
  setItemEditorOpen = null;
  setImportDialogOpen = null;
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
    GlobalHolder.setEditItem(item);
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
    GlobalHolder.setFeedCategoryId( 
      feed.categories && feed.categories.length > 0 ?
        feed.categories[0].id : "");
  }  
}

export { Global, GlobalHolder };