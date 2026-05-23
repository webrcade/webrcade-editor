import * as React from 'react';

import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import UploadFileIcon from '@mui/icons-material/UploadFile';

import EditorTextField from './EditorTextField';
import { dropboxPicker } from '../../../Dropbox';
import { GlobalHolder } from '../../../Global';

const LARGE_FILE_THRESHOLD = 5 * 1024 * 1024; // 5 MB

function AddMenu(props) {
  const {
    anchorEl,
    extraMenuItems,
    multiselect,
    onDropText,
    onFileUpload,
    setAnchorEl,
  } = props;
  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFileMenuClick = () => {
    handleClose();
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = Boolean(multiselect);
    input.onchange = (e) => {
      const files = Array.from(e.target.files);
      if (files.length > 0) onFileUpload(files);
    };
    input.click();
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      disablePortal
    >
      {extraMenuItems && extraMenuItems.map((item, i) => (
        <MenuItem key={i} onClick={() => { handleClose(); item.onClick(); }}>
          {item.icon ? <ListItemIcon>{item.icon}</ListItemIcon> : null}
          {item.label}
        </MenuItem>
      ))}
      {extraMenuItems && extraMenuItems.length > 0 && <Divider />}
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
      {onFileUpload && <Divider />}
      {onFileUpload && (
        <MenuItem onClick={handleFileMenuClick}>
          <ListItemIcon>
            <UploadFileIcon fontSize="small" />
          </ListItemIcon>
          Add file{multiselect ? 's' : ''}...
        </MenuItem>
      )}
    </Menu>
  );
}

export default function EditorUrlField(props) {
  const [menuAnchor, setMenuAnchor] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const {
    extraMenuItems,
    multiselect,
    onFileUpload,
    onDropText,
    ...other
  } = props;

  const handleFileUpload = React.useCallback(async (files) => {
    if (!onFileUpload) return;
    setIsUploading(true);
    let overlayOpen = false;
    try {
      const urls = [];
      for (const file of files) {
        const isLarge = file.size >= LARGE_FILE_THRESHOLD;
        if (isLarge) {
          GlobalHolder.setUploadProgressMessage(`Uploading ${file.name}...`);
          GlobalHolder.setUploadProgressValue(0);
          GlobalHolder.setUploadProgressOpen(true);
          overlayOpen = true;
        }
        const url = await onFileUpload(
          file,
          isLarge ? (pct) => GlobalHolder.setUploadProgressValue(pct) : null
        );
        urls.push(url);
      }
      if (onDropText) {
        onDropText(urls.length === 1 ? urls[0] : urls);
      }
    } catch (e) {
      console.error('[EditorUrlField] Upload failed:', e);
      GlobalHolder.setMessage(e?.message || 'Upload failed.');
      GlobalHolder.setMessageSeverity('error');
    } finally {
      if (overlayOpen) {
        GlobalHolder.setUploadProgressOpen(false);
      }
      setIsUploading(false);
    }
  }, [onFileUpload, onDropText]);

  return (
    <>
      <Stack
        spacing={0}
        direction="row"
        alignItems="center"
      >
        <EditorTextField
          {...other}
          onDropText={onDropText}
          onFileDrop={onFileUpload ? handleFileUpload : undefined}
          uploading={isUploading}
        />
        <Tooltip title="Select">
          <IconButton
            sx={{ ml: -.8 }}
            disabled={isUploading}
            onClick={(e) => {
              setMenuAnchor(e.target)
            }}>
            <ArrowDropDownCircleIcon />
          </IconButton>
        </Tooltip>
      </Stack>
      <AddMenu
        anchorEl={menuAnchor}
        extraMenuItems={extraMenuItems}
        setAnchorEl={setMenuAnchor}
        onDropText={onDropText}
        onFileUpload={onFileUpload ? handleFileUpload : undefined}
        multiselect={multiselect}
      />
    </>
  );
}
