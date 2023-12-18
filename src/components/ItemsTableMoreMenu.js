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

export default function ItemsTableMoreMenu(props) {
  const {
    anchorEl,
    setAnchorEl,
    feed,
    category,
    selected,
    lastSelected,
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
          dropboxPicker((res, names) => {
            UrlProcessor.process(res, names);
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
        <MenuItem
          disabled={!lastSelected}
          onClick={() => {
            handleClose();

            const app = Feed.getItem(feed, category, lastSelected);
            if (!app) {
              return;
            }

            const feedProps = feed.props ? feed.props : {};
            let location = WrcCommon.getStandaloneLocation();

            if (WrcCommon.isDev()) {
              location += "/";
            } else {
              let path = window.location.href;
              const index = path.toLowerCase().indexOf('app/editor');
              location = path.substring(0, index) + location;
            }
            const reg = WrcCommon.AppRegistry.instance;
            let icon = reg.getThumbnail(app);

            // Hack for default icons
            if (icon.startsWith("images/app/")) {
              icon = "../../" + icon;
            }

            const appLocation = reg.getLocation(
              app, WrcCommon.AppProps.RV_CONTEXT_STANDALONE, feedProps,
              {icon: icon});
            const qIndex = appLocation.indexOf("?")
            location += "?app=" + encodeURIComponent(appLocation.substring(0, qIndex)) + "&" + appLocation.substring(qIndex + 1);

            Global.openCopyLinkDialog(true, location);
          }}>
          <ListItemIcon>
            <LinkIcon fontSize="small" />
          </ListItemIcon>
          Copy stand-alone link...
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