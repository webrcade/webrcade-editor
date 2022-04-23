import * as React from 'react';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import Divider from '@mui/material/Divider';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';

import * as UrlProcessor from '../UrlProcessor';
import { Global } from '../Global';
import { dropboxPicker } from '../Dropbox';

export default function ItemsTableMoreMenu(props) {
  const {
    anchorEl,
    setAnchorEl,
    // feed, 
    category,
    selected
  } = props;
  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      disablePortal
    >
      <MenuItem onClick={() => {
        handleClose();
        Global.openCreateFromUrlDialog(true);
      }}>
        <ListItemIcon>
          <AutoAwesomeIcon fontSize="small" />
        </ListItemIcon>
        Create from URLs...
      </MenuItem>
      <MenuItem onClick={() => {
        handleClose();
        dropboxPicker((res) => {
          UrlProcessor.process(res);
        });
      }}>
        <ListItemIcon>
          <span className="iconify"
            data-icon="mdi:dropbox"
            data-width="20"
            data-height="20"
            sx={{
              color: 'white',
            }}></span>
        </ListItemIcon>
        Add from Dropbox...
      </MenuItem>
      <Divider />
      <MenuItem
        disabled={selected.length === 0}
        onClick={() => {
          handleClose();
          UrlProcessor.analyze(category, selected);
        }}>
        <ListItemIcon>
          <FindInPageIcon fontSize="small" />
        </ListItemIcon>
        Analyze
      </MenuItem>
    </Menu>
  );
}