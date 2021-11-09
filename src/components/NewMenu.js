import * as React from 'react';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ListItemIcon from '@mui/material/ListItemIcon';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import { styled } from '@mui/material/styles';

import * as Feed from '../Feed';
import { Global } from '../Global';

const StyledPopper = styled(Popper)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1
}));

export default function NewMenu(props) {
  const { anchorEl, setAnchorEl, setOpen } = props;
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  return (
    <StyledPopper
      anchorEl={anchorEl}
      open={open}
      placement="right-start"
      // transition
    >
      {/* {({ TransitionProps }) => (
        <Grow
          {...TransitionProps}
          style={{
            transformOrigin: 'left top'
          }}
        > */}
          <Paper>
            <ClickAwayListener onClickAway={handleClose}>
              <MenuList>
                <MenuItem onClick={() => {
                  const feed = Feed.exampleFeed();
                  Global.setFeed({ ...feed });
                  handleClose();
                }}>
                  <ListItemIcon>
                    <FileCopyIcon fontSize="small" />
                  </ListItemIcon>
                  Clone example feed
                </MenuItem>
                <MenuItem onClick={() => {
                  const feed = Feed.newFeed();
                  Global.setFeed({ ...feed });
                  handleClose();
                }}>
                <ListItemIcon>
                    <InsertDriveFileIcon fontSize="small" />
                  </ListItemIcon>
                  Empty feed
                </MenuItem>
              </MenuList>
            </ClickAwayListener>
          </Paper>
        {/* </Grow>
      )} */}
    </StyledPopper>
  );
}