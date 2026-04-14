import * as React from 'react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SearchIcon from '@mui/icons-material/Search';
import TableCell from '@mui/material/TableCell';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';

import { AppRegistry } from '@webrcade/app-common';

import { Global, GlobalHolder } from '../Global';
import * as Feed from '../Feed';
import * as UrlProcessor from '../UrlProcessor';
import * as Util from '../Util';
import CommonTable from './common/CommonTable';
import ImageLabel from './common/ImageLabel';
import ToolbarVerticalDivider from './common/ToolbarVerticalDivider';

const DATE_FORMAT = {
  month: '2-digit', day: '2-digit', year: '2-digit',
  hour: '2-digit', minute: '2-digit'
};

function createData(id, categoryTitle, title, type, typeName, thumbSrc, addedTime, item) {
  return { id, categoryTitle, title, type, typeName, thumbSrc, addedTime, item };
}

function SearchMoreMenu(props) {
  const { anchorEl, setAnchorEl, selected } = props;
  const open = Boolean(anchorEl);
  const handleClose = () => setAnchorEl(null);

  return (
    <Menu anchorEl={anchorEl} open={open} onClose={handleClose} disablePortal>
      <MenuItem
        disabled={selected.length === 0}
        onClick={() => {
          handleClose();
          UrlProcessor.analyzeItems(selected);
        }}
      >
        <ListItemIcon>
          <FindInPageIcon fontSize="small" />
        </ListItemIcon>
        Analyze
      </MenuItem>
    </Menu>
  );
}

export default function SearchTab(props) {
  const { feed } = props;
  const inputRef = React.useRef(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [debouncedTerm, setDebouncedTerm] = React.useState('');
  const [moreMenuAnchor, setMoreMenuAnchor] = React.useState(null);

  GlobalHolder.focusSearch = () => {
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedTerm(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const trimmed = (searchTerm.trim() === '' ? '' : debouncedTerm).trim().toLowerCase();

  const rows = [];
  if (trimmed.length > 0 && feed.categories) {
    feed.categories.forEach((cat) => {
      if (cat.items) {
        cat.items.forEach((item) => {
          if (item.title && item.title.toLowerCase().includes(trimmed)) {
            rows.push(createData(
              item.id,
              cat.title,
              item.title,
              item.type,
              AppRegistry.instance.getShortNameForType(item.type),
              item.thumbnail,
              item.added ? item.added : 0,
              item
            ));
          }
        });
      }
    });
    rows.sort((a, b) => a.title.localeCompare(b.title));
  }

  return (
    <>
      <TextField
        inputRef={inputRef}
        label="Search"
        variant="outlined"
        size="small"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ marginBottom: 3, marginTop: 0.5, minWidth: 300 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
      />

      <CommonTable
          tableName="search"
          resetKey={debouncedTerm}
          defaultSortColumn="title"
          headCells={[
            {
              id: 'title',
              numeric: false,
              disablePadding: true,
              sortable: true,
              label: 'Title',
              width: '1%'
            },
            {
              id: 'categoryTitle',
              numeric: false,
              disablePadding: false,
              sortable: true,
              label: 'Category',
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
          ]}
          rows={rows}
          renderRow={(row) => (
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
                  imageSrc={AppRegistry.instance.getThumbnailForType(row.type, row.thumbSrc)}
                  defaultImageSrc={AppRegistry.instance.getDefaultThumbnailForType(row.type)}
                />
              </TableCell>
              <TableCell style={{ width: '0%', whiteSpace: 'noWrap' }}>
                {row.categoryTitle}
              </TableCell>
              <TableCell style={{ width: '0%', whiteSpace: 'noWrap' }}>
                <Tooltip title="Edit">
                  <IconButton onClick={(e) => {
                    e.stopPropagation();
                    const cat = Feed.getCategoryForItem(feed, row.id);
                    const item = Feed.getItemById(feed, row.id);
                    if (cat && item) {
                      Global.setFeedCategoryId(cat.id);
                      Global.editItem(item);
                    }
                  }}>
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
              <TableCell style={{ width: '0%', whiteSpace: 'noWrap' }}>
                {row.typeName}
              </TableCell>
              <TableCell style={{ whiteSpace: 'noWrap' }}>
                {row.addedTime > 0
                  ? new Date(row.addedTime).toLocaleString([], DATE_FORMAT)
                  : ''}
              </TableCell>
            </>
          )}
          renderToolbarItems={(selection, selected) => {
            return (
              <>
                <SearchMoreMenu
                  anchorEl={moreMenuAnchor}
                  setAnchorEl={setMoreMenuAnchor}
                  selected={selected}
                />
                <Tooltip title="Copy">
                  <div>
                    <IconButton
                      disabled={!selection}
                      onClick={() => {
                        const cloned = [];
                        selected.forEach((id) => {
                          const item = Feed.getItemById(feed, id);
                          if (item) {
                            const clone = Util.cloneObject(item);
                            if (clone) {
                              Feed.addId(clone);
                              cloned.push(clone);
                            }
                          }
                        });
                        Global.setItemClipboard(cloned);
                        Global.displayMessage(`${cloned.length} ${cloned.length === 1 ? 'item' : 'items'} copied to clipboard.`, 'success');
                      }}
                    >
                      <ContentCopyIcon />
                    </IconButton>
                  </div>
                </Tooltip>
                <ToolbarVerticalDivider />
                <Tooltip title="Delete">
                  <div>
                    <IconButton
                      disabled={!selection}
                      onClick={() => {
                        const byCategory = {};
                        selected.forEach((id) => {
                          const cat = Feed.getCategoryForItem(feed, id);
                          if (cat) {
                            if (!byCategory[cat.id]) byCategory[cat.id] = [];
                            byCategory[cat.id].push(id);
                          }
                        });
                        Object.entries(byCategory).forEach(([catId, ids]) => {
                          Feed.deleteItemsFromCategory(feed, catId, ids);
                        });
                        Global.setFeed({ ...feed });
                        Global.displayMessage(`${selected.length} ${selected.length === 1 ? 'item' : 'items'} deleted.`, 'success');
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </Tooltip>
                <ToolbarVerticalDivider />
                <Tooltip title="More">
                  <div>
                    <IconButton
                      disabled={rows.length === 0}
                      onClick={(e) => setMoreMenuAnchor(e.target)}
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
