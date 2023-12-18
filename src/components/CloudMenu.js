import * as React from 'react';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
// import ListRoundedIcon from '@mui/icons-material/ListRounded';
import SimCardDownloadRoundedIcon from '@mui/icons-material/SimCardDownloadRounded';

import { openManifestDialog } from './cloud/generate-manifest/GenerateManifestDialog';


export default function CloudMenu(props) {
  const { anchorEl, setAnchorEl, setOpen } = props;
  const isOpen = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={isOpen}
      placement="right-start"
      onClose={handleClose}
      anchorOrigin={{
        vertical: "center",
        horizontal: "center",
      }}
    >
      <MenuItem onClick={() => {
        openManifestDialog();
        setOpen(false);
        handleClose();
      }}>
        <ListItemIcon>
          <SimCardDownloadRoundedIcon />
        </ListItemIcon>
        Generate Package<br/>Manifest File...
      </MenuItem>
   </Menu>
  );
}