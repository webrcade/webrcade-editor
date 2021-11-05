import * as React from 'react';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import { styled } from '@mui/material/styles';

const StyledPopper = styled(Popper)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1
}));

export default function ImportMenu(props) {
  const { anchorEl, setAnchorEl } = props;
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
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
                <MenuItem onClick={handleClose}>From URL...</MenuItem>
                <MenuItem onClick={handleClose}>From file...</MenuItem>
              </MenuList>
            </ClickAwayListener>
          </Paper>
        {/* </Grow>
      )} */}
    </StyledPopper>
  );
}