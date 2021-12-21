import * as React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import IconButton from '@mui/material/IconButton';
import TableCell from '@mui/material/TableCell';
import Tooltip from '@mui/material/Tooltip';

import * as WrcCommon from '@webrcade/app-common'
import { Global } from '../../Global';
import CommonTable from '../common/CommonTable';
import * as Feed from '../../Feed';
import ImageLabel from '../common/ImageLabel';
import Prefs from '../../Prefs';
import ToolbarVerticalDivider from '../common/ToolbarVerticalDivider';

import EditorSwitch from '../common/editor/EditorSwitch';

function createData(id, title, thumbSrc, location, localId) {
  return {
    id, title, thumbSrc, location, localId
  };
}

const PREF_SHOW_REMOTE = "loadFeeds.showRemote";

export default function FeedsTable(props) {
  const {feeds, setOpen, onDelete} = props;
  const [showRemote, setShowRemote] = 
    React.useState(Prefs.getBoolPreference(PREF_SHOW_REMOTE, true));

  const rows = [];
  if (feeds) {
    const distinctFeeds = feeds.getDistinctFeeds();
    distinctFeeds.forEach((f) => {
      if (showRemote || !f.url) {
        rows.push(createData(
          f.feedId, f.title, f.thumbnail, f.url ? f.url : "", f.localId
        ))
      }
    });
  }

  return (
    <CommonTable
      tableName="feeds"
      defaultSortColumn="title"
      resetKey={null}
      size={'small'}
      headCells={
        [
          {
            id: 'title',
            numeric: false,
            disablePadding: true,
            sortable: true,
            label: 'Feed',
            width: '1%'
          },
          {
            id: 'load',
            numeric: false,
            disablePadding: false,
            label: 'Load',
            width: '1%'
          },
          {
            id: 'location',
            numeric: false,
            disablePadding: false,
            sortable: true,
            label: 'Location'
          }
        ]
      }
      rows={rows}
      renderRow={(row, index) => {
        return (
          <>
            <TableCell
              component="th"
              id={row.id}
              scope="row"
              padding="checkbox"
              style={{ width: '0%', whiteSpace: 'noWrap' }}
            >
              <ImageLabel
                label={row.title}
                imageSrc={row.thumbSrc}
                defaultImageSrc={WrcCommon.FeedThumbImage}
              />
            </TableCell>
            <TableCell style={{ width: '0%', whiteSpace: 'noWrap' }}>
              <Tooltip title="Load">
                <IconButton onClick={async (e) => {
                  e.stopPropagation();
                  Global.openBusyScreen(true, "Loading feed...");
                  try {
                    let feed = null;
                    if (row.localId) {
                      const localFeed = await feeds.getLocalFeed(row.localId);
                      if (localFeed) {
                        feed = await Feed.loadFeed(localFeed);
                      } 
                    } else if (row.location && row.location.trim().length > 0) {
                      feed = await Feed.loadFeedFromUrl(row.location);
                    }
                    if (feed) {
                      Global.setFeed({...feed});
                      setOpen(false);
                    } else {
                      Global.displayMessage("The feed no longer exists.", "error");
                    }
                  } catch (e) {
                    Global.displayMessage("An error occurrred attempting to load the feed.", "error");
                  } finally {
                    Global.openBusyScreen(false);
                  }
                }}
                >
                  <FileOpenIcon />
                </IconButton>
              </Tooltip>
            </TableCell>
            <TableCell>{row.location ? row.location : "(Local)"}</TableCell>
          </>
        );
      }}
      renderToolbarItems={(selection, selected) => {
        return (
          <>            
            <div>
              <EditorSwitch
                label="Show Remote Feeds"
                tooltip="Whether to display feeds that are remotely hosted."
                onChange={(e) => { 
                  const checked = e.target.checked;
                  setShowRemote(checked); 
                  Prefs.setPreference(PREF_SHOW_REMOTE, checked);
                }}
                checked={showRemote}
              />
            </div>
            <ToolbarVerticalDivider />
            <Tooltip title="Delete">
              <div>
                <IconButton
                  disabled={!selection}
                  onClick={() => {
                    const single = selected.length === 1;
                    Global.openConfirmDialog(
                      true,
                      `Delete Feed${single ? "" : "s"}`,
                      `Are you sure you want to delete the selected feed${single ? "" : "s"}?`,
                      async () => {
                        try {
                          Global.openBusyScreen(true, `Deleting feed${single ? "" : "s"}...`);
                          for (let i = 0; i < selected.length; i++) {
                            const id = selected[i];
                            await feeds.removeFeed(id);
                          }
                          if (onDelete) await onDelete();
                        } finally {
                          Global.openBusyScreen(false);                            
                        }
                      }
                    );
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            </Tooltip>
            <ToolbarVerticalDivider />
          </>
        );
      }}
    />
  );
}