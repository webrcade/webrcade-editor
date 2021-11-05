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
import { Global, GlobalHolder } from '../Global';

function EditorDrawer(props) {
  const {drawerWidth} = props;

  const [open, setOpen] = React.useState(false);  

  const toggleDrawer = () => {
    setOpen(!open);
  };

  GlobalHolder.toggleDrawer = toggleDrawer;

  const drawer = (
    <div>
      <Toolbar />
      <List>
        <ListItem button key="new">
          <ListItemIcon><NoteAddIcon /></ListItemIcon>
          <ListItemText primary="New" />
        </ListItem>
        <ListItem button key="import" onClick={(e) => {
           Global.openImportDialog(true);
        }}>
          <ListItemIcon><UploadIcon /></ListItemIcon>
          <ListItemText primary="Import" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button key="download">
          <ListItemIcon><DownloadIcon /></ListItemIcon>
          <ListItemText primary="Download" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button key="test" onClick={() => {
          const url = (
            WrcCommon.isDev() ?
              WrcCommon.config.getLocalUrl() :
              (WrcCommon.isStaging() ? 
                "https://webrcade.github.io/webrcade-staging" :
                "https://play.webrcade.com"));
          window.open(url, "_webrcade")
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
    </>
  );
}

export default EditorDrawer;