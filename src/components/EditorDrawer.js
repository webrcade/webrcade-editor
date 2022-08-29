import * as React from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Divider from '@mui/material/Divider';
import DownloadIcon from '@mui/icons-material/Download';
import Drawer from '@mui/material/Drawer';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import SaveIcon from '@mui/icons-material/Save';
import Toolbar from '@mui/material/Toolbar';
import UploadIcon from '@mui/icons-material/Upload';

import * as WrcCommon from '@webrcade/app-common'

import { Global, GlobalHolder } from '../Global';
import CommonTooltip from './common/CommonTooltip';
import * as Feed from '../Feed';
import NewMenu from './NewMenu';
import Prefs from '../Prefs';

function EditorDrawer(props) {
  const { drawerWidth } = props;

  const [open, setOpen] = React.useState(false);
  const [newMenuAnchor, setNewMenuAnchor] = React.useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  GlobalHolder.toggleDrawer = toggleDrawer;

  const drawer = (
    <div>
      <Toolbar />
      <List>
        <ListItem button key="new" onClick={(e) => {
          if (WrcCommon.config.isPublicServer()) {
            setNewMenuAnchor(e.target);
          } else {
            const feed = Feed.newFeed();
            Global.setFeed({ ...feed });
            setOpen(false);
          }
        }}>
          <ListItemIcon><NoteAddIcon /></ListItemIcon>
          <ListItemText primary="New" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <CommonTooltip
          title="Import a feed from a URL or local file."
        >
          <ListItem button key="import" onClick={(e) => {
            setOpen(false);
            Global.openImportDialog(true);
          }}>
            <ListItemIcon><UploadIcon /></ListItemIcon>
            <ListItemText primary="Import" />
          </ListItem>
        </CommonTooltip>
        <CommonTooltip
          title="Export and download the feed."
        >
          <ListItem button key="export" onClick={() => {
            setOpen(false);
            Global.openExportDialog(true);
          }}>
            <ListItemIcon><DownloadIcon /></ListItemIcon>
            <ListItemText primary="Export" />
          </ListItem>
        </CommonTooltip>
      </List>
      <Divider />
      <List>
        <CommonTooltip
          title="Test the feed in the webЯcade font-end."
        >
          <ListItem button key="test" onClick={() => {
            // The window is opened outside async to support iOS
            const newWindow = window.open();
            newWindow.document.write("<html><body style=\"background-color:black;\"></body></html>");
            (async () => {
              setOpen(false);

              // Store the test feed
              await Prefs.storeTestFeed(GlobalHolder.getFeed())

              // Open webrcade
              let url = (WrcCommon.isDev() ?
                WrcCommon.config.getLocalUrl() : "../../");
              url += `?${WrcCommon.AppProps.RP_EDITOR_TEST}=${WrcCommon.AppProps.RV_EDITOR_TEST_ENABLED}`;
              newWindow.location = url;
            })();
          }}>
            <ListItemIcon><CheckCircleIcon /></ListItemIcon>
            <ListItemText primary="Test" />
          </ListItem>
        </CommonTooltip>
      </List>
      <Divider />
      <List>
        <CommonTooltip
          title="Load feed."
        >
          <ListItem button key="load" onClick={() => {
            setOpen(false);
            Global.openLoadFeedDialog(true);
          }}>
            <ListItemIcon><FileOpenIcon /></ListItemIcon>
            <ListItemText primary="Load" />
          </ListItem>
        </CommonTooltip>
        <CommonTooltip
          title="Save the feed locally."
        >
          <ListItem button key="save" onClick={async () => {
            setOpen(false);
            const feeds = await WrcCommon.loadFeeds(0);
            const feed = Global.getFeed();
            const existing = feeds.isExistingLocalFeed(feed.title);
            const f = async () => {
              let succeeded = false;
              Global.openBusyScreen(true, "Saving feed...");
              try {
                if (await feeds.addLocalFeed(Feed.exportFeed(feed))) {
                  succeeded = true;
                }
              } catch (e) {
                WrcCommon.LOG.error('Error saving feed: ' + e);
              } finally {
                Global.openBusyScreen(false);
              }
              if (succeeded) {
                Global.displayMessage("Succesfully saved feed.", "success");
              } else {
                Global.displayMessage("Error saving feed.", "error");
              }
            }

            if (existing) {
              Global.openConfirmDialog(true,
                "Save Feed", "Continue and overwrite the existing feed?", f);
            } else {
              f();
            }
          }}>
            <ListItemIcon><SaveIcon /></ListItemIcon>
            <ListItemText primary="Save" />
          </ListItem>
        </CommonTooltip>
      </List>
    </div>
  );
  return (
    <>
      <Drawer
        variant="temporary"
        open={open}
        onClose={toggleDrawer}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>
      <NewMenu
        anchorEl={newMenuAnchor}
        setAnchorEl={setNewMenuAnchor}
        setOpen={setOpen}
      />
    </>
  );
}

export default EditorDrawer;