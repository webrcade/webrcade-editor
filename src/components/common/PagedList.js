/**
 * PagedList
 *
 * Generic wrapper that adds a debounced filter input and prev/next pagination
 * to any list of items.  The scroll area lives inside so the filter bar and
 * pagination controls stay anchored at top/bottom.
 *
 * Props:
 *   items         — array of data items
 *   renderRow     — (item) => ReactElement  (should be stable / useCallback)
 *   getFilterText — (item) => string | null  (pure function; used for search)
 */

import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';

const PAGE_SIZE = 100;

export default function PagedList({ items, renderRow, getFilterText }) {
  const [inputValue,    setInputValue   ] = React.useState('');
  const [appliedFilter, setAppliedFilter] = React.useState('');
  const [page,          setPage         ] = React.useState(0);
  const timerRef = React.useRef(null);

  // Cancel pending timer on unmount
  React.useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const onInputChange = React.useCallback((value) => {
    setInputValue(value);
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    if (!value.trim()) {
      setAppliedFilter('');
    } else {
      const captured = value;
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        setAppliedFilter(captured);
      }, 500);
    }
  }, []); // setInputValue, setAppliedFilter, timerRef are all stable

  // Only re-filter when the committed filter or item list actually changes
  const filtered = React.useMemo(() => {
    if (!appliedFilter.trim()) return items;
    const lower = appliedFilter.toLowerCase();
    return items.filter(item => {
      const text = getFilterText(item);
      return text != null && text.toLowerCase().includes(lower);
    });
  // getFilterText is a stable pure function; excluding it avoids re-running on every parent render
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, appliedFilter]);

  // Reset to first page whenever the committed filter changes
  React.useEffect(() => { setPage(0); }, [appliedFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage  = Math.min(page, pageCount - 1);
  const pageItems = React.useMemo(
    () => filtered.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE),
    [filtered, safePage]
  );
  // Memoize rendered elements — if pageItems and renderRow are both stable,
  // React skips reconciling the rows entirely, making keystrokes free of row re-renders.
  const rowElements = React.useMemo(
    () => pageItems.map(item => renderRow(item)),
    [pageItems, renderRow]
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* ── Filter input ──────────────────────────────────────────────── */}
      <Box sx={{ px: 1, pt: 0.5, pb: 0.5, flexShrink: 0 }}>
        <TextField
          size="small"
          fullWidth
          placeholder="Filter…"
          value={inputValue}
          onChange={e => onInputChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 18 }} />
              </InputAdornment>
            ),
            endAdornment: inputValue ? (
              <InputAdornment position="end">
                <IconButton size="small" edge="end" onClick={() => onInputChange('')}>
                  <ClearIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </InputAdornment>
            ) : null,
          }}
        />
      </Box>

      {/* ── Rows ──────────────────────────────────────────────────────── */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        {pageItems.length > 0
          ? rowElements
          : (
            <Typography
              variant="body2"
              sx={{ color: 'text.secondary', p: 2, textAlign: 'center' }}
            >
              {appliedFilter ? 'No items match the filter.' : 'No items.'}
            </Typography>
          )
        }
      </Box>

      {/* ── Pagination ────────────────────────────────────────────────── */}
      {pageCount > 1 && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1.5,
            py: 0.75,
            flexShrink: 0,
            borderTop: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <IconButton
            size="small"
            disabled={safePage === 0}
            onClick={() => setPage(p => p - 1)}
          >
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
          <Typography variant="caption">
            Page {safePage + 1} of {pageCount}
          </Typography>
          <IconButton
            size="small"
            disabled={safePage >= pageCount - 1}
            onClick={() => setPage(p => p + 1)}
          >
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        </Box>
      )}

    </Box>
  );
}
