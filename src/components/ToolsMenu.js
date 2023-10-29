import * as React from 'react';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import FolderZipRoundedIcon from '@mui/icons-material/FolderZipRounded';
import SimCardDownloadRoundedIcon from '@mui/icons-material/SimCardDownloadRounded';

import * as WrcCommon from '@webrcade/app-common'

import { openManifestDialog } from './cloud/generate-manifest/GenerateManifestDialog';
import { openRepackageDialog } from './tools/repackage/RepackageDialog';

export default function ToolsMenu(props) {
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
        openRepackageDialog();
        setOpen(false);
        handleClose();
      }}>
        <ListItemIcon>
          <FolderZipRoundedIcon />
        </ListItemIcon>
        Repackage Archive...
      </MenuItem>
      {WrcCommon.settings.isCloudStorageEnabled() &&
        <Divider />
      }
      {WrcCommon.settings.isCloudStorageEnabled() &&
        <MenuItem onClick={() => {
          openManifestDialog();
          setOpen(false);
          handleClose();
        }}>
          <ListItemIcon>
            <SimCardDownloadRoundedIcon />
          </ListItemIcon>
          Generate Package Manifest File...
        </MenuItem>
      }
    </Menu>
  );
}