import * as React from 'react';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';

import * as UrlProcessor from '../UrlProcessor';
import { Global } from '../Global';

export default function ItemsTableMoreMenu(props) {
  const { anchorEl, setAnchorEl } = props;
  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={() => {
          handleClose();
          Global.openCreateFromUrlDialog(true);
        }}>
          <ListItemIcon>
            <AutoAwesomeIcon fontSize="small" />
          </ListItemIcon>
          Create from URL...
        </MenuItem>
        <MenuItem onClick={() => {
          handleClose();
          const options = {
            linkType: "preview",
            multiselect: true,
            folderselect: false,
            success: function(files) {
              const res = [];
              for (let i = 0; i < files.length; i++) {
                const f = files[i];
                res.push(f.link);
              }
              if (res.length > 0) {
                UrlProcessor.process(res);
              }
            },
            sizeLimit: 65 * 1024 * 1024 // 65mb
          };
          window.Dropbox.choose(options);
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
      </Menu>
    </div>
  );
}