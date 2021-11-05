import * as React from 'react';
import CommonTable from './common/CommonTable';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import IconButton from '@mui/material/IconButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import TableCell from '@mui/material/TableCell';
import Tooltip from '@mui/material/Tooltip';

import { Global } from '../Global';
import ImageLabel from './common/ImageLabel';
import ToolbarVerticalDivider from './common/ToolbarVerticalDivider';
import { Router } from '@mui/icons-material';

function createData(id, title, type, thumbSrc, lastUpdate) {
  return {
    title,
    type,
    lastUpdate,
    thumbSrc
  };
}

export default function ItemsTable(props) {
  const { feed, category } = props;

  const rows = [];

  if (feed.categories) {
    for (let i = 0; i < feed.categories.length; i++) {
      const cat = feed.categories[i];
      if (cat.id === category) {
        if (cat.items) {
          cat.items.forEach((item) => {
            rows.push(createData(
              item.id, item.title, item.type, item.thumbnail, ''
            ))
          });      
        }
      }
    }
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
            id: 'play',
            numeric: false,
            disablePadding: false,
            label: 'Play'
          },
          {
            id: 'type',
            numeric: false,
            disablePadding: false,
            label: 'Application'
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
                <IconButton onClick={(e) => {
                  e.stopPropagation(); 
                  Global.editItem({
                    title: row.title,
                    thumbnail: row.thumbSrc
                  });}}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
            </TableCell>
            <TableCell style={{ width: '0%', whiteSpace: 'noWrap' }}>
              <Tooltip title="Play">
                <IconButton onClick={(e) => {e.stopPropagation();}}>
                  <PlayArrowIcon />
                </IconButton>
              </Tooltip>
            </TableCell>
            <TableCell style={{ width: '0%', whiteSpace: 'noWrap' }}>{row.type}</TableCell>
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
            <Tooltip title="Cut">
              <div>
                <IconButton disabled={!selection}>
                  <ContentCutIcon />
                </IconButton>
              </div>
            </Tooltip>
            <Tooltip title="Copy">
              <div>
                <IconButton disabled={!selection}>              
                  <ContentCopyIcon />
                </IconButton>
              </div>
            </Tooltip>
            <Tooltip title="Paste">
              <div>
                <IconButton disabled={!selection}>
                  <ContentPasteIcon />
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