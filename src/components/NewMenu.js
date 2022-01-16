import * as React from 'react';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import * as Feed from '../Feed';
import { Global } from '../Global';

export default function NewMenu(props) {
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
        const feed = Feed.exampleFeed();
        Global.setFeed({ ...feed });
        setOpen(false);
        handleClose();
      }}>
        <ListItemIcon>
          <FileCopyIcon fontSize="small" />
        </ListItemIcon>
        Clone example feed
      </MenuItem>
      <MenuItem onClick={() => {
        Global.openBusyScreen(true, "Cloning feed...");
        Feed.loadFeedFromUrl(Feed.getDefaultFeedUrl())
          .then((feed) => {
            Global.setFeed(feed);
          })
          .catch(msg => {
            Global.displayMessage(msg);
          })
          .finally(() => {
            Global.openBusyScreen(false);
            setOpen(false);
            handleClose();
          });
      }}>
        <ListItemIcon>
          <FileCopyIcon fontSize="small" />
        </ListItemIcon>
        Clone default feed
      </MenuItem>
      <MenuItem onClick={() => {
        const feed = Feed.newFeed();
        Global.setFeed({ ...feed });
        setOpen(false);
        handleClose();
      }}>
        <ListItemIcon>
          <InsertDriveFileIcon fontSize="small" />
        </ListItemIcon>
        Empty feed
      </MenuItem>
    </Menu>
  );
}