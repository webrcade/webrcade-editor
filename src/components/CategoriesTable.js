import * as React from 'react';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CommonTable from './common/CommonTable';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import IconButton from '@mui/material/IconButton';
import TableCell from '@mui/material/TableCell';
import Tooltip from '@mui/material/Tooltip';

import ImageLabel from './common/ImageLabel';
import ToolbarVerticalDivider from './common/ToolbarVerticalDivider';

function createData(id, title, thumbSrc, lastUpdate) {
  return {
    id, title, thumbSrc, lastUpdate
  };
}

export default function CategoriesTable(props) {
  const { feed } = props;

  const rows = [];
  if (feed.categories) {
    feed.categories.forEach((c) => {
      rows.push(createData(
        c.id, c.title, c.thumbnail, ''
      ))
    });
  }

  return (
    <CommonTable
      defaultSortColumn="title"
      headCells={
        [
          {
            id: 'title',
            numeric: false,
            disablePadding: true,
            label: 'Title'
          },
          {
            id: 'edit',
            numeric: false,
            disablePadding: false,
            label: 'Edit'
          },
          {
            id: 'lastUpdate',
            numeric: false,
            disablePadding: false,
            label: 'Updated'
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
              <ImageLabel label={row.title} imageSrc={row.thumbSrc} />
            </TableCell>
            <TableCell style={{ width: '0%', whiteSpace: 'noWrap' }}>
              <Tooltip title="Edit">
                <IconButton onClick={(e) => {e.stopPropagation();}}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
            </TableCell>
            <TableCell>{row.lastUpdate}</TableCell>
          </>
        );
      }}
      renderToolbarItems={(selection) => {
        return (
          <>
            <Tooltip title="Add">
              <IconButton>
                <AddBoxIcon />
              </IconButton>
            </Tooltip>
            <ToolbarVerticalDivider />
            <Tooltip title="Move Up">
              <div>
                <IconButton disabled={!selection}>              
                  <ArrowUpwardIcon />
                </IconButton>
              </div>
            </Tooltip>            
            <Tooltip title="Move Down">
              <div>
                <IconButton disabled={!selection}>              
                  <ArrowDownwardIcon />
                </IconButton>
              </div>
            </Tooltip>            
            <ToolbarVerticalDivider />
            <Tooltip title="Duplicate">
              <div>
                <IconButton disabled={!selection}>              
                  <ContentCopyIcon />
                </IconButton>
              </div>
            </Tooltip>            
            <ToolbarVerticalDivider />
            <Tooltip title="Delete">
              <div>
                <IconButton disabled={!selection}>
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