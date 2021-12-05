import * as React from 'react';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CommonTable from './common/CommonTable';
import AddBoxIcon from '@mui/icons-material/AddBox';
import Button from '@mui/material/Button';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import TableCell from '@mui/material/TableCell';
import Tooltip from '@mui/material/Tooltip';

import * as WrcCommon from '@webrcade/app-common'
import { Global } from '../Global';
import * as Feed from '../Feed';
import CategoriesTableMoreMenu from './CategoriesTableMoreMenu';
import ImageLabel from './common/ImageLabel';
import ToolbarVerticalDivider from './common/ToolbarVerticalDivider';


function createData(id, title, thumbSrc, itemCount) {
  return {
    id, title, thumbSrc, itemCount
  };
}

export default function CategoriesTable(props) {
  const { feed, showCategoryItems } = props;
  const [moreMenuAnchor, setMoreMenuAnchor] = React.useState(false);

  const rows = [];
  if (feed.categories) {
    feed.categories.forEach((c) => {
      rows.push(createData(
        c.id, c.title, c.thumbnail, c.items ? c.items.length : 0
      ))
    });
  }

  return (
    <CommonTable
      tableName="categories"
      resetKey={feed.id}
      headCells={
        [
          {
            id: 'title',
            numeric: false,
            disablePadding: true,
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
            id: 'items',
            numeric: false,
            disablePadding: false,
            label: 'Item Count'
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
                defaultImageSrc={WrcCommon.CategoryThumbImage}
              />
            </TableCell>
            <TableCell style={{ width: '0%', whiteSpace: 'noWrap' }}>
              <Tooltip title="Edit">
                <IconButton onClick={(e) => {
                  e.stopPropagation();
                  Global.editCategory(
                    Feed.getCategory(feed, row.id)
                  );
                }}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
            </TableCell>
            <TableCell>
              <Button
                variant="text"
                onClick={(e) => {
                  e.stopPropagation();
                  showCategoryItems(row.id)
                }}
              >
                {row.itemCount}
              </Button>
            </TableCell>
          </>
        );
      }}
      renderToolbarItems={(selection, selected) => {
        const hasFeed = feed && feed.categories && feed.categories.length > 0;
        return (
          <>
              <CategoriesTableMoreMenu
                anchorEl={moreMenuAnchor}
                setAnchorEl={setMoreMenuAnchor}
                feed={feed}
                selected={selected}
              />
            <Tooltip title="Create Category">
              <IconButton
                onClick={() => {
                  Global.createNewCategory();
                }}
              >
                <AddBoxIcon />
              </IconButton>
            </Tooltip>
            <ToolbarVerticalDivider />
            <Tooltip title="Move Up">
              <div>
                <IconButton
                  disabled={!selection}
                  onClick={() => {
                    Feed.moveCategoriesUp(feed, selected);
                    Global.setFeed({ ...feed });
                  }}
                >
                  <ArrowUpwardIcon />
                </IconButton>
              </div>
            </Tooltip>
            <Tooltip title="Move Down">
              <div>
                <IconButton
                  disabled={!selection}
                  onClick={() => {
                    Feed.moveCategoriesDown(feed, selected);
                    Global.setFeed({ ...feed });
                  }}
                >
                  <ArrowDownwardIcon />
                </IconButton>
              </div>
            </Tooltip>
            <ToolbarVerticalDivider />
            <Tooltip title="Duplicate">
              <div>
                <IconButton
                  disabled={!selection}
                  onClick={() => {
                    Feed.cloneCategories(feed, selected);
                    Global.setFeed({ ...feed });
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
                    Feed.deleteCategories(feed, selected);
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
  );
}