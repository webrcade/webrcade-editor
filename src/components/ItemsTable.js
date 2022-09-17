import * as React from 'react';
import CommonTable from './common/CommonTable';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import IconButton from '@mui/material/IconButton';
// import LinkIcon from '@mui/icons-material/Link';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import TableCell from '@mui/material/TableCell';
import Tooltip from '@mui/material/Tooltip';

import {
  AppRegistry
} from '@webrcade/app-common'

import { Global } from '../Global';
import * as Util from '../Util';
import * as Feed from '../Feed';
import ImageLabel from './common/ImageLabel';
import ItemsTableMoreMenu from './ItemsTableMoreMenu';
import ToolbarVerticalDivider from './common/ToolbarVerticalDivider';

const DATE_FORMAT = {
  month: '2-digit', day: '2-digit', year: '2-digit',
  hour: '2-digit', minute: '2-digit'
};

function createData(id, title, type, typeName, thumbSrc, addedTime, item) {
  return {
    id,
    title,
    type,
    typeName,
    thumbSrc,
    addedTime,
    item
  };
}

function cloneSelectedItems(feed, category, selection) {
  const cloned = [];
  selection.forEach((id) => {
    const item = Feed.getItem(feed, category, id);
    if (item) {
      const clone = Util.cloneObject(item);
      if (clone) {
        Feed.addId(clone);
        cloned.push(clone);
      }
    }
  });
  return cloned;
}

export default function ItemsTable(props) {
  const { feed, category } = props;
  const [clipboard, setClipboard] = React.useState([]);
  const [moreMenuAnchor, setMoreMenuAnchor] = React.useState(false);

  const rows = [];

  if (feed.categories) {
    for (let i = 0; i < feed.categories.length; i++) {
      const cat = feed.categories[i];
      if (cat.id === category) {
        if (cat.items) {
          cat.items.forEach((item) => {
            rows.push(createData(
              item.id,
              item.title,
              item.type,
              AppRegistry.instance.getShortNameForType(item.type),
              item.thumbnail,
              item.added ? item.added : 0,
              item
            ))
          });
        }
      }
    }
  }

  return (
    <>
      <CommonTable
        tableName="items"
        resetKey={category}
        defaultSortColumn="title"
        headCells={
          [
            {
              id: 'title',
              numeric: false,
              disablePadding: true,
              sortable: true,
              label: 'Title',
              width: '1%'
            },
            {
              id: 'edit',
              numeric: false,
              disablePadding: false,
              label: 'Edit',
              width: '1%'
            },
            {
              id: 'play',
              numeric: false,
              disablePadding: false,
              label: 'Play',
              width: '1%'
            },
            // {
            //   id: 'link',
            //   numeric: false,
            //   disablePadding: false,
            //   label: 'Link',
            //   width: '1%'
            // },
            {
              id: 'typeName',
              numeric: false,
              disablePadding: false,
              sortable: true,
              label: 'Application',
              width: '1%'
            },
            {
              id: 'addedTime',
              numeric: false,
              disablePadding: false,
              sortable: true,
              label: 'Date Added'
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
                  imageSrc={
                    AppRegistry.instance.getThumbnailForType(row.type, row.thumbSrc)
                  }
                  defaultImageSrc={
                    AppRegistry.instance.getDefaultThumbnailForType(row.type)
                  }
                />
              </TableCell>
              <TableCell style={{ width: '0%', whiteSpace: 'noWrap' }}>
                <Tooltip title="Edit">
                  <IconButton onClick={(e) => {
                    e.stopPropagation();
                    Global.editItem(
                      Feed.getItem(feed, category, row.id)
                    );
                  }}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
              <TableCell style={{ width: '0%', whiteSpace: 'noWrap' }}>
                <Tooltip title="Play">
                  <IconButton onClick={(e) => {
                    e.stopPropagation();
                    Global.setApp(row.item);
                  }}>
                    <PlayArrowIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
              {/* <TableCell style={{ width: '0%', whiteSpace: 'noWrap' }}>
                <Tooltip title="Link">
                  <IconButton onClick={(e) => {
                    e.stopPropagation();
                    Global.setApp(row.item);
                  }}>
                    <LinkIcon />
                  </IconButton>
                </Tooltip>
              </TableCell> */}
              <TableCell style={{ width: '0%', whiteSpace: 'noWrap' }}>
                {row.typeName}
              </TableCell>
              <TableCell style={{ whiteSpace: 'noWrap' }}>{
                row.addedTime > 0 ?
                  new Date(row.addedTime).toLocaleString([], DATE_FORMAT) : ""
              }</TableCell>
            </>
          );
        }}
        renderToolbarItems={(selection, selected, lastSelected) => {
          const hasFeed = feed && feed.categories && feed.categories.length > 0;
          return (
            <>
              <ItemsTableMoreMenu
                anchorEl={moreMenuAnchor}
                setAnchorEl={setMoreMenuAnchor}
                feed={feed}
                category={category}
                selected={selected}
                lastSelected={lastSelected}
              />
              <Tooltip title="Create Item">
                <div>
                  <IconButton
                    disabled={!hasFeed}
                    onClick={() => {
                      Global.createNewItem();
                    }}>
                    <AddBoxIcon />
                  </IconButton>
                </div>
              </Tooltip>
              <ToolbarVerticalDivider />
              <Tooltip title="Cut">
                <div>
                  <IconButton
                    disabled={!selection}
                    onClick={() => {
                      setClipboard(cloneSelectedItems(feed, category, selected));
                      Feed.deleteItemsFromCategory(feed, category, selected);
                      Global.setFeed({ ...feed });
                    }}
                  >
                    <ContentCutIcon />
                  </IconButton>
                </div>
              </Tooltip>
              <Tooltip title="Copy">
                <div>
                  <IconButton
                    disabled={!selection}
                    onClick={() => {
                      setClipboard(cloneSelectedItems(feed, category, selected));
                    }}
                  >
                    <ContentCopyIcon />
                  </IconButton>
                </div>
              </Tooltip>
              <Tooltip title="Paste">
                <div>
                  <IconButton
                    disabled={clipboard.length === 0}
                    onClick={() => {
                      Feed.addItemsToCategory(feed, category, clipboard);
                      Global.setFeed({ ...feed });
                    }}
                  >
                    <ContentPasteIcon />
                  </IconButton>
                </div>
              </Tooltip>
              <ToolbarVerticalDivider />
              <Tooltip title="Delete">
                <div>
                  <IconButton disabled={!selection}
                    onClick={() => {
                      Feed.deleteItemsFromCategory(feed, category, selected);
                      Global.setFeed({ ...feed });
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              </Tooltip>
              <ToolbarVerticalDivider />
              <Tooltip title="More">
                <div>
                  <IconButton disabled={!hasFeed}
                    onClick={(e) => {
                      setMoreMenuAnchor(e.target);
                    }}
                  >
                    <MoreHorizIcon />
                  </IconButton>
                </div>
              </Tooltip>
              <ToolbarVerticalDivider />
            </>
          );
        }}
      />
    </>
  );
}