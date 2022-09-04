import * as React from 'react';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import Divider from '@mui/material/Divider';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import LinkIcon from '@mui/icons-material/Link';
import ListItemIcon from '@mui/material/ListItemIcon';
import * as Feed from '../Feed';

import * as UrlProcessor from '../UrlProcessor';
import { Global } from '../Global';
import { dropboxPicker } from '../Dropbox';

import * as WrcCommon from '@webrcade/app-common';

var copyToClipboard = function (elementId, value) {
  var input = document.getElementById(elementId);
  input.value = value;
  var isiOSDevice = navigator.userAgent.match(/ipad|iphone/i);
  if (isiOSDevice) {
    var editable = input.contentEditable;
    var readOnly = input.readOnly;
    input.contentEditable = true;
    input.readOnly = false;
    var range = document.createRange();
    range.selectNodeContents(input);
    var selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    input.setSelectionRange(0, 999999);
    input.contentEditable = editable;
    input.readOnly = readOnly;
  } else {
    input.select();
  }
  document.execCommand('copy');
}

export default function ItemsTableMoreMenu(props) {
  const {
    anchorEl,
    setAnchorEl,
    feed,
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
        <input type="text" id="copyField" value="" style={{ opacity: '0', top: '0', position: 'absolute', zIndex: '-100' }} />
        <MenuItem
          disabled={selected.length !== 1}
          onClick={() => {
            handleClose();
            const app = Feed.getItem(feed, category, selected[0]);
            const feedProps = feed.props ? feed.props : {};
            let location = "";
            if (WrcCommon.isDev()) {
              location = WrcCommon.config.getLocalUrl() + "/";
            } else {
              let path = window.location.href;
              const index = path.toLowerCase().indexOf('app/editor');
              location = path.substring(0, index);
            }
            location += "app.html?app=" + WrcCommon.AppRegistry.instance.getLocation(
              app, WrcCommon.AppProps.RV_CONTEXT_STANDALONE, feedProps);
            copyToClipboard('copyField', location);
            Global.displayMessage("Successfully copied direct link (URL) to clipboard.", "success");
          }}>
          <ListItemIcon>
            <LinkIcon fontSize="small" />
          </ListItemIcon>
          Copy Direct Link (URL)
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