import * as React from 'react';

import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';

import EditorTextField from './EditorTextField';
import { dropboxPicker } from '../../../Dropbox';

function AddMenu(props) {
  const {
    anchorEl,
    multiselect,
    onDropText,
    setAnchorEl,
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
        dropboxPicker((res) => {
          if (onDropText) {
            onDropText(res.length > 1 ? res : res[0]);
          }
        }, multiselect ? true : false);
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
        Select from Dropbox...
      </MenuItem>
    </Menu>
  );
}

export default function EditorUrlField(props) {
  const [menuAnchor, setMenuAnchor] = React.useState(false);
  const {
    multiselect,
    ...other
  } = props;

  return (
    <>
      <Stack
        spacing={0}
        direction="row"
        alignItems="center"
      >
        <EditorTextField
          {...other}
        />
        <Tooltip title="Select">
          <IconButton
            sx={{ ml: -.8 }}
            onClick={(e) => {
              setMenuAnchor(e.target)
            }}>
            <ArrowDropDownCircleIcon />
          </IconButton>
        </Tooltip>
      </Stack>
      <AddMenu
        anchorEl={menuAnchor}
        setAnchorEl={setMenuAnchor}
        onDropText={other.onDropText}
        multiselect={multiselect}
      />
    </>
  );
}
