import * as React from 'react';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { FetchAppData } from '@webrcade/app-common';

import Editor from '../../common/editor/Editor';
import EditorTabPanel from '../../common/editor/EditorTabPanel';

const BASE_URL = 'https://raw.githubusercontent.com/webrcade-assets/libdb/master/';

const ROWS_PER_PAGE = 10;

function decodeHtml(str) {
  const txt = document.createElement('textarea');
  txt.innerHTML = str;
  return txt.value;
}

function buildUrl(path, filename, ext) {
  const encodedPath = path.split('/').map(encodeURIComponent).join('/');
  const base = filename.replace(/\.cht$/i, '');
  return `${BASE_URL}${encodedPath}/${encodeURIComponent(base + ext)}`;
}

export default function CheatDatabaseDialog(props) {
  const { open, onClose, onSelect, cheatEntry, initialSearch } = props;

  const [tabValue, setTabValue] = React.useState(0);
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(0);
  const [sortBy, setSortBy] = React.useState('name');
  const [sortDir, setSortDir] = React.useState('asc');
  const [tableVisible, setTableVisible] = React.useState(true);
  const [cheatsVisible, setCheatsVisible] = React.useState(true);
  const [selectedName, setSelectedName] = React.useState(null);
  const [cheats, setCheats] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [fetchError, setFetchError] = React.useState(false);

  const { path, games } = cheatEntry || { path: '', games: {} };

  const allNames = React.useMemo(
    () => Object.keys(games).sort((a, b) => a.localeCompare(b)),
    [games]
  );

  const filteredNames = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return allNames;
    return allNames.filter(n => n.toLowerCase().includes(q));
  }, [allNames, search]);

  const handleGameSelect = async (name) => {
    if (name === selectedName) return;
    setCheatsVisible(false);
    setSelectedName(name);
    setCheats(null);
    setFetchError(false);
    setLoading(true);
    try {
      const entry = games[name];
      const filename = entry.file || entry;
      const url = buildUrl(path, filename, '.json');
      const res = await new FetchAppData(url).setRetries(0).setProxyDisabled(true).fetch();
      if (res.ok) {
        const data = await res.json();
        setCheats(Array.isArray(data) ? [...new Set(data)].sort((a, b) => a.localeCompare(b)).map(decodeHtml) : []);
      } else {
        setFetchError(true);
      }
    } catch (e) {
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  };

  const onOk = () => {
    if (selectedName) {
      const entry = games[selectedName];
      const filename = entry.file || entry;
      onSelect(buildUrl(path, filename, '.cht'));
    }
    return true;
  };

  const handleSort = (col) => {
    if (col === sortBy) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(col);
      setSortDir('asc');
    }
    setPage(0);
  };

  const handlePageChange = (e, newPage) => {
    setTableVisible(false);
    setTimeout(() => {
      setPage(newPage);
      setTableVisible(true);
    }, 300);
  };

  const onShow = () => {
    isFirstRender.current = true;
    setSearch(initialSearch || '');
    setSelectedName(null);
    setCheats(null);
    setLoading(false);
    setFetchError(false);
    setPage(0);
    setSortBy('name');
    setSortDir('asc');
    setTableVisible(true);
    setCheatsVisible(true);
  };

  const isFirstRender = React.useRef(true);

  // Fade left panel when search changes (skip on initial mount)
  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setTableVisible(false);
    const timer = setTimeout(() => {
      setPage(0);
      setTableVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fade right panel in when loading finishes
  React.useEffect(() => {
    if (!loading) {
      setTimeout(() => setCheatsVisible(true), 16);
    }
  }, [loading]);

  // Auto-select when exactly one result, or when there's an exact name match
  React.useEffect(() => {
    if (filteredNames.length === 1 && filteredNames[0] !== selectedName) {
      handleGameSelect(filteredNames[0]);
    } else if (filteredNames.length > 1 && search.trim()) {
      const q = search.trim().toLowerCase();
      const exact = filteredNames.find(n => n.toLowerCase() === q);
      if (exact && exact !== selectedName) {
        handleGameSelect(exact);
      }
    }
  }, [filteredNames]); // eslint-disable-line react-hooks/exhaustive-deps

  const okDisabled = !selectedName || loading || fetchError || cheats === null;

  const sortedNames = React.useMemo(() => {
    const arr = [...filteredNames];
    if (sortBy === 'count') {
      arr.sort((a, b) => {
        const ca = games[a]?.count ?? 0;
        const cb = games[b]?.count ?? 0;
        return sortDir === 'asc' ? ca - cb : cb - ca;
      });
    } else {
      arr.sort((a, b) => sortDir === 'asc' ? a.localeCompare(b) : b.localeCompare(a));
    }
    return arr;
  }, [filteredNames, sortBy, sortDir, games]);

  const pagedNames = sortedNames.slice(page * ROWS_PER_PAGE, (page + 1) * ROWS_PER_PAGE);

  const panelSx = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid',
    borderColor: 'divider',
    borderRadius: 1,
    overflow: 'hidden',
    minWidth: 0,
  };

  return (
    <Editor
      title="Cheat Database"
      height={440}
      isOpen={open}
      setOpen={(v) => { if (!v) onClose(); }}
      tabValue={tabValue}
      setTabValue={setTabValue}
      onShow={onShow}
      onOk={onOk}
      okDisabled={okDisabled}
      tabs={[<Tab label="Search" key={0} />]}
      tabPanels={
        <EditorTabPanel value={tabValue} index={0}>
          <TextField
            autoFocus
            size="small"
            label="Search"
            variant="outlined"
            fullWidth
            sx={{ mb: 1.5 }}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedName(null);
              setCheats(null);
              setFetchError(false);
            }}
          />
          <Box sx={{ display: 'flex', gap: 2, height: 340 }}>

            {/* Left: paged game table */}
            <Box sx={panelSx}>
              {/* Always-visible header */}
              <Box sx={{ flexShrink: 0 }}>
              <Table size="small" sx={{ tableLayout: 'fixed' }}>
                <colgroup><col /><col style={{ width: '110px' }} /></colgroup>
                <TableHead>
                  <TableRow>
                    <TableCell sortDirection={sortBy === 'name' ? sortDir : false}>
                      <TableSortLabel
                        active={sortBy === 'name'}
                        direction={sortBy === 'name' ? sortDir : 'asc'}
                        onClick={() => handleSort('name')}
                      >
                        Cheat File
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="right" sortDirection={sortBy === 'count' ? sortDir : false} sx={{ whiteSpace: 'nowrap' }}>
                      <TableSortLabel
                        active={sortBy === 'count'}
                        direction={sortBy === 'count' ? sortDir : 'asc'}
                        onClick={() => handleSort('count')}
                      >
                        Cheats
                      </TableSortLabel>
                    </TableCell>
                  </TableRow>
                </TableHead>
              </Table>
              </Box>
              {/* Fading rows */}
              <Box sx={{ opacity: tableVisible ? 1 : 0, transition: tableVisible ? 'opacity 0.25s ease-in' : 'none', flex: 1, overflow: 'auto' }}>
                <Table size="small" sx={{ tableLayout: 'fixed' }}>
                  <colgroup><col /><col style={{ width: '90px' }} /></colgroup>
                  <TableBody>
                    {pagedNames.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={2}>
                          <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
                            No files matching current search.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : pagedNames.map((name) => (
                      <TableRow
                        key={name}
                        hover
                        selected={name === selectedName}
                        onClick={() => handleGameSelect(name)}
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                            <span
                              className="iconify"
                              data-icon="mdi:lightning-bolt"
                              data-width="18"
                              data-height="18"
                            />
                            {name}
                          </Box>
                        </TableCell>
                        <TableCell align="right">{games[name].count ?? ''}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
              <Divider />
              <TablePagination
                component="div"
                count={filteredNames.length}
                rowsPerPage={ROWS_PER_PAGE}
                page={page}
                onPageChange={handlePageChange}
                rowsPerPageOptions={[ROWS_PER_PAGE]}
              />
            </Box>

            {/* Right: cheat preview */}
            <Box sx={panelSx}>
              <Box sx={{ opacity: cheatsVisible ? 1 : 0, transition: cheatsVisible ? 'opacity 0.25s ease-in' : 'none', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              {!selectedName && (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <Typography variant="body2" color="text.secondary">
                    Select a cheat file to view its cheats.
                  </Typography>
                </Box>
              )}
              {selectedName && loading && (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <CircularProgress size={48} />
                </Box>
              )}
              {selectedName && !loading && fetchError && (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <Typography variant="body2" color="error">Unable to load cheats.</Typography>
                </Box>
              )}
              {selectedName && !loading && !fetchError && cheats !== null && (
                cheats.length === 0 ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <Typography variant="body2" color="text.secondary">No cheats found.</Typography>
                  </Box>
                ) : (
                  <Box
                    component="textarea"
                    readOnly
                    value={cheats.join('\n')}
                    sx={{
                      width: '100%',
                      height: '100%',
                      resize: 'none',
                      border: 'none',
                      outline: 'none',
                      fontFamily: 'inherit',
                      fontSize: '0.875rem',
                      lineHeight: 1.9,
                      p: 1,
                      bgcolor: 'transparent',
                      color: 'inherit',
                      overflowY: 'auto',
                      boxSizing: 'border-box',
                    }}
                  />
                )
              )}
              </Box>
            </Box>
          </Box>
        </EditorTabPanel>
      }
    />
  );
}
