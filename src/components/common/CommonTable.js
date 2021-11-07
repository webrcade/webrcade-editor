import * as React from 'react';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { alpha } from '@mui/material/styles';
import { visuallyHidden } from '@mui/utils';
import * as Util from '../../Util';

function descendingComparator(a, b, orderBy) {
  let aVal = a[orderBy];
  let bVal = b[orderBy];
  if (aVal.toUpperCase && bVal.toUpperCase) {
    aVal = aVal.toUpperCase();
    bVal = bVal.toUpperCase();
  }
  if (bVal < aVal) {
    return -1;
  }
  if (bVal > aVal) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function EnhancedTableHead(props) {
  const { headCells, onSelectAllClick, order, orderBy,
    numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={
              headCell.sortable && orderBy === headCell.id ? order : false
            }
          >
            {headCell.sortable ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            ) : <>{headCell.label}</>
            }
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const EnhancedTableToolbar = (props) => {
  const { selected, renderToolbarItems } = props;
  const numSelected = selected.length;
  const selection = numSelected > 0;

  return (
    <Toolbar
      sx={{
        pl: { xs: 1 },
        pr: { xs: 2 },
        ...(numSelected >= 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.hoverOpacity),
        }),
      }}
    >
      {renderToolbarItems(selection, selected)}
      {selection ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
          align="right"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
          align="right"
        >
        </Typography>
      )}
    </Toolbar>
  );
};


function performSort(arr, comparator, firstSort) {
  let rows = arr;
  if (firstSort) {
    rows = rows.sort(getComparator('asc', firstSort));
  }
  return rows.sort(comparator);
}

export default function CommonTable(props) {
  const {
    defaultSortColumn,
    headCells,
    rows,
    renderToolbarItems,
    renderRow,
    resetKey
  } = props;

  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState(defaultSortColumn);
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const prevRows = Util.usePrevious(rows);
  const prevResetKey = Util.usePrevious(resetKey);

  // Reset page (if applicable)
  React.useEffect(() => {
    // See if reset key changed
    if (prevResetKey !== resetKey) {
      setPage(0);
    } else {
      // See if we are passed last page
      if (rowsPerPage * page >= rows.length) {
        // Determine last page
        if (rows.length === 0) {
          setPage(0);
        } else {
          setPage(((rows.length - 1) / rowsPerPage) | 0);
        }
      }
    }
  }, [resetKey, prevResetKey, rowsPerPage, rows, page, setPage]);

  // Reset the selected items when rows change
  React.useEffect(() => {
    if (rows !== prevRows) {
      if (selected.length > 0) {
        const selMap = {};
        selected.forEach((e) => {
          selMap[e] = true;
        });
        const newSel = [];
        rows.forEach((r) => {
          if (selMap[r.id]) {
            newSel.push(r.id);
          }
        });
        setSelected(newSel);
      }
    }
  }, [rows, selected, prevRows, setPage]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar
          selected={selected}
          renderToolbarItems={renderToolbarItems}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 500 }}
            size={'medium'}
          >
            <EnhancedTableHead
              headCells={headCells}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {(orderBy ?
                performSort(rows, getComparator(order, orderBy),
                  (defaultSortColumn === orderBy ? null : defaultSortColumn)) : rows)
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.id);

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.id)}
                      role="checkbox"
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                        />
                      </TableCell>
                      {renderRow(row, index)}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          // style={{ display:"flex" }} 
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}