import * as React from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Divider from '@mui/material/Divider';
import DownloadIcon from '@mui/icons-material/Download';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import Toolbar from '@mui/material/Toolbar';
import UploadIcon from '@mui/icons-material/Upload';

import * as WrcCommon from '@webrcade/app-common'
import * as Feed from '../Feed';
import Prefs from '../Prefs';
import { Global, GlobalHolder } from '../Global';
import NewMenu from './NewMenu';

function downloadFeed() {
  const feed = Feed.exportFeed(Global.getFeed());
  var element = document.createElement('a');
  element.setAttribute('href',
    'data:text/json;charset=utf-8,' +
    encodeURIComponent(JSON.stringify(feed, null, 2)));
  element.setAttribute('download', feed.title + '.json');
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

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
          setNewMenuAnchor(e.target);
        }}>
          <ListItemIcon><NoteAddIcon /></ListItemIcon>
          <ListItemText primary="New" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button key="import" onClick={(e) => {
          setOpen(false);
          Global.openImportDialog(true);
        }}>
          <ListItemIcon><UploadIcon /></ListItemIcon>
          <ListItemText primary="Import" />
        </ListItem>
        <ListItem button key="download" onClick={() => {
          setOpen(false);
          downloadFeed();
        }}>
          <ListItemIcon><DownloadIcon /></ListItemIcon>
          <ListItemText primary="Download" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button key="test" onClick={() => {          
          setOpen(false);
          // Store the test feed
          Prefs.storeTestFeed(GlobalHolder.getFeed())

          // Open webrcade
          let url = (WrcCommon.isDev() ? 
            WrcCommon.config.getLocalUrl() : "../../");
          url += `?${WrcCommon.AppProps.RP_EDITOR_TEST}=${WrcCommon.AppProps.RV_EDITOR_TEST_ENABLED}`;
          window.open(url/*, "_webrcade"*/)
        }}>
          <ListItemIcon><CheckCircleIcon /></ListItemIcon>
          <ListItemText primary="Test" />
        </ListItem>
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