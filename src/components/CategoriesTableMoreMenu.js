import * as React from 'react';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';

import * as UrlProcessor from '../UrlProcessor';

export default function CategoriesTableMoreMenu(props) {
  const {
    anchorEl,
    setAnchorEl,
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
      <MenuItem
        disabled={selected.length === 0}
        onClick={() => {
          handleClose();
          UrlProcessor.analyzeCategories(selected);
        }}>
        <ListItemIcon>
          <FindInPageIcon fontSize="small" />
        </ListItemIcon>
        Analyze
      </MenuItem>
    </Menu>
  );
}