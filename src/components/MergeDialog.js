/**
 * MergeDialog (v2)
 *
 * Two-tab dialog for merging multi-disc/media items.
 *   Tab 1 — Select Primary: radio cards + live preview panel
 *   Tab 2 — Media Order: draggable numbered list with group headers
 *
 * Open via:  Global.openMergeDialog(items, mediaField)
 * Returns:   Promise<{ primaryId, mediaUrls }> or null if cancelled.
 */

import * as React from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Radio from '@mui/material/Radio';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import { AppRegistry } from '@webrcade/app-common';
import { GlobalHolder } from '../Global';
import { enableDropHandler } from '../UrlProcessor';
import EditorButton from './common/editor/EditorButton';

// --- Helpers ------------------------------------------------------------------

function computeScore(item, mediaField) {
  let score = 0;
  if (item.description) score += 10;
  if (item.thumbnail)   score += 10;
  if (item.background)  score += 10;
  score += (item.props?.[mediaField] ?? []).length;
  return score;
}

function buildOrderedEntries(items, mediaField) {
  const entries = [];
  for (const item of items) {
    const urls = item.props?.[mediaField] ?? [];
    for (const url of urls) {
      entries.push({
        id: `${item.id}::${url}`,
        url,
        sourceItemId: item.id,
        sourceItemTitle: item.title ?? '(untitled)',
        sourceItemMediaCount: urls.length,
      });
    }
  }
  return entries;
}

function getFilename(url) {
  try {
    const parts = url.split('/');
    const name = decodeURIComponent(parts[parts.length - 1]);
    return name || url;
  } catch (_) {
    return url;
  }
}

function getTypeThumb(item) {
  try { return AppRegistry.instance.getDefaultThumbnailForType(item.type); } catch (_) {}
  return null;
}

function getTypeBg(item) {
  try { return AppRegistry.instance.getDefaultBackgroundForType(item.type); } catch (_) {}
  return null;
}

// --- PrimaryCard ---------------------------------------------------------------

const PrimaryCard = React.memo(function PrimaryCard({
  item, mediaField, primaryId, recommendedId, onSelect,
}) {
  const isSelected    = primaryId === item.id;
  const isRecommended = recommendedId === item.id;
  const mediaCount    = (item.props?.[mediaField] ?? []).length;
  const mediaLabel    = mediaField === 'discs' ? 'disc' : 'media';
  const thumbSrc      = item.thumbnail || getTypeThumb(item);

  return (
    <Box
      onClick={() => onSelect(item.id)}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        p: 1,
        mb: 0.75,
        borderRadius: 1,
        border: '1px solid',
        borderColor: isSelected ? 'primary.main' : 'rgba(255,255,255,0.12)',
        bgcolor: isSelected ? 'rgba(144,202,249,0.08)' : 'transparent',
        cursor: 'pointer',
        transition: 'border-color 0.15s, background-color 0.15s',
        '&:hover': { borderColor: isSelected ? 'primary.main' : 'rgba(255,255,255,0.3)' },
      }}
    >
      <Radio
        checked={isSelected}
        onChange={() => onSelect(item.id)}
        size="small"
        onClick={e => e.stopPropagation()}
        sx={{ p: 0.5, flexShrink: 0 }}
      />

      <Box sx={{
        width: 56, height: 42, flexShrink: 0, borderRadius: 0.5,
        overflow: 'hidden', bgcolor: 'rgba(255,255,255,0.07)',
      }}>
        {thumbSrc && (
          <img src={thumbSrc} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        )}
      </Box>

      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.4, flexWrap: 'wrap' }}>
          <Typography variant="body2" noWrap sx={{ fontWeight: isSelected ? 600 : 400, lineHeight: 1.3 }}>
            {item.title || '(untitled)'}
          </Typography>
          {isRecommended && (
            <Chip
              label="Recommended"
              size="small"
              color="primary"
              variant="outlined"
              sx={{ fontSize: '0.63rem', height: 16, '& .MuiChip-label': { px: 0.75 } }}
            />
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          {[['desc', item.description], ['image', item.thumbnail], ['bg', item.background]].map(([lbl, val]) => (
            <Chip
              key={lbl}
              label={`${lbl} ${val ? '✓' : '✗'}`}
              size="small"
              sx={{ fontSize: '0.63rem', height: 16, opacity: val ? 1 : 0.4, '& .MuiChip-label': { px: 0.75 } }}
            />
          ))}
          <Chip
            label={`${mediaCount} ${mediaLabel}${mediaCount !== 1 ? 's' : ''}`}
            size="small"
            sx={{ fontSize: '0.63rem', height: 16, '& .MuiChip-label': { px: 0.75 } }}
          />
        </Box>
      </Box>
    </Box>
  );
});

// --- PreviewCarousel ----------------------------------------------------------

const PREVIEW_PAGES = [
  { key: 'thumbnail',   label: 'Thumbnail'        },
  { key: 'background',  label: 'Background Image' },
  { key: 'description', label: 'Description'      },
];

function PreviewCarousel({ item }) {
  const [page, setPage] = React.useState(0);
  const [visible, setVisible] = React.useState(true);
  const fadeTimerRef = React.useRef(null);

  // Reset to first page whenever the selected primary changes.
  const itemId = item?.id ?? null;
  React.useEffect(() => { setPage(0); setVisible(true); }, [itemId]);

  // Clean up fade timer on unmount.
  React.useEffect(() => () => { if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current); }, []);

  const goToPage = React.useCallback((next) => {
    if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    setVisible(false);
    fadeTimerRef.current = setTimeout(() => {
      setPage(next);
      setVisible(true);
      fadeTimerRef.current = null;
    }, 110);
  }, []);

  if (!item) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <Typography variant="caption" color="text.disabled">Select an item to preview</Typography>
      </Box>
    );
  }

  const thumbSrc = item.thumbnail || getTypeThumb(item);
  const bgSrc    = item.background || getTypeBg(item);
  const desc     = item.description || null;

  const total    = PREVIEW_PAGES.length;
  const prevPage = () => goToPage((page + total - 1) % total);
  const nextPage = () => goToPage((page + 1) % total);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* ── Page content (fills available space) ─────────────────── */}
      <Box
        sx={{
          flexGrow: 1,
          minHeight: 0,
          overflow: 'hidden',
          opacity: visible ? 1 : 0,
          transition: visible ? 'opacity 0.25s ease-in' : 'opacity 0.1s ease-out',
        }}
      >
        {/* Page 0 — Thumbnail */}
        {page === 0 && (
          <Box sx={{
            width: '100%', height: '100%',
            bgcolor: 'rgba(255,255,255,0.04)', borderRadius: 1, overflow: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {thumbSrc
              ? <img src={thumbSrc} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
              : <Typography variant="caption" color="text.disabled">No thumbnail available</Typography>
            }
          </Box>
        )}

        {/* Page 1 — Background Image */}
        {page === 1 && (
          <Box sx={{
            width: '100%', height: '100%',
            bgcolor: 'rgba(255,255,255,0.04)', borderRadius: 1, overflow: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {bgSrc
              ? <img src={bgSrc} alt="Background" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
              : <Typography variant="caption" color="text.disabled">No background image available</Typography>
            }
          </Box>
        )}

        {/* Page 2 — Description */}
        {page === 2 && (
          <Box sx={{
            width: '100%', height: '100%',
            bgcolor: 'rgba(255,255,255,0.04)', borderRadius: 1, p: 1.5,
            overflowY: 'auto',
          }}>
            {desc
              ? <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.7, display: 'block' }}>{desc}</Typography>
              : <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <Typography variant="caption" color="text.disabled">No description available</Typography>
                </Box>
            }
          </Box>
        )}
      </Box>

      {/* ── Navigation footer ────────────────────────────────────── */}
      <Box sx={{ flexShrink: 0, pt: 0.75 }}>
        {/* Page label */}
        <Typography
          variant="caption"
          sx={{ display: 'block', textAlign: 'center', color: 'text.disabled', mb: 0.5, userSelect: 'none' }}
        >
          {PREVIEW_PAGES[page].label}
        </Typography>
        {/* Arrows + dots */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <IconButton size="small" onClick={prevPage} sx={{ p: 0.25 }}>
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
          {PREVIEW_PAGES.map((_, i) => (
            <Box
              key={i}
              onClick={() => goToPage(i)}
              sx={{
                width: 6, height: 6, borderRadius: '50%',
                bgcolor: i === page ? 'primary.main' : 'rgba(255,255,255,0.2)',
                cursor: 'pointer',
                transition: 'background-color 0.15s',
                flexShrink: 0,
              }}
            />
          ))}
          <IconButton size="small" onClick={nextPage} sx={{ p: 0.25 }}>
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

    </Box>
  );
}

// --- MediaEntryRow ------------------------------------------------------------

const MediaEntryRow = React.memo(function MediaEntryRow({
  entry, entryIndex, displayNumber, isDragOver, onDragStart, onDragOver, onDrop, onDragEnd,
}) {
  const label = entry.sourceItemMediaCount === 1
    ? entry.sourceItemTitle
    : getFilename(entry.url);

  return (
    <Box
      draggable
      onDragStart={() => onDragStart(entryIndex)}
      onDragOver={e => { e.preventDefault(); onDragOver(entryIndex); }}
      onDrop={e => { e.preventDefault(); onDrop(entryIndex); }}
      onDragEnd={onDragEnd}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 1,
        py: 0.75,
        mb: 0.5,
        borderRadius: 1,
        border: '1px solid',
        borderColor: isDragOver ? 'primary.main' : 'rgba(255,255,255,0.08)',
        bgcolor: isDragOver ? 'rgba(144,202,249,0.08)' : 'transparent',
        cursor: 'grab',
        userSelect: 'none',
        transition: 'border-color 0.1s, background-color 0.1s',
      }}
    >
      <DragHandleIcon sx={{ fontSize: 18, color: 'text.secondary', flexShrink: 0 }} />
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Typography variant="body2" noWrap>
          {label}
        </Typography>
        <Typography
          variant="caption"
          noWrap
          sx={{ color: 'text.disabled', display: 'block' }}
          title={entry.url}
        >
          {entry.url}
        </Typography>
      </Box>
      <Typography variant="caption" sx={{ color: 'text.disabled', flexShrink: 0, minWidth: 24, textAlign: 'right' }}>
        {displayNumber}
      </Typography>
    </Box>
  );
});

// --- MergeDialog --------------------------------------------------------------

export default function MergeDialog() {
  const [open,           setOpen          ] = React.useState(false);
  const [items,          setItems         ] = React.useState([]);
  const [mediaField,     setMediaField    ] = React.useState('discs');
  const [primaryId,       setPrimaryId     ] = React.useState(null);
  const [recommendedId,  setRecommendedId ] = React.useState(null);
  const [orderedEntries, setOrderedEntries] = React.useState([]);
  const [activeTab,      setActiveTab     ] = React.useState(0);
  const [dragOverIndex,  setDragOverIndex ] = React.useState(null);
  const dragFromRef = React.useRef(null);
  const resolveRef  = React.useRef(null);
  const theme       = useTheme();
  const fullScreen  = useMediaQuery(theme.breakpoints.down('md'));

  const primaryItem = React.useMemo(
    () => items.find(item => item.id === primaryId) ?? null,
    [items, primaryId],
  );

  // Reorder entries so the primary item's entries come first.
  const reorderEntriesForPrimary = React.useCallback((entries, newPrimaryId) => {
    const primaryEntries = entries.filter(e => e.sourceItemId === newPrimaryId);
    const otherEntries  = entries.filter(e => e.sourceItemId !== newPrimaryId);
    return [...primaryEntries, ...otherEntries];
  }, []);

  GlobalHolder.openMergeDialogPrompt = React.useCallback((dialogItems, field) => {
    const sorted  = [...dialogItems].sort((a, b) => computeScore(b, field) - computeScore(a, field));
    const bestId  = sorted[0]?.id ?? null;
    const firstId = dialogItems[0]?.id ?? null;
    const entries = buildOrderedEntries(dialogItems, field);
    setItems(dialogItems);
    setMediaField(field);
    setPrimaryId(firstId);
    setRecommendedId(bestId);
    setOrderedEntries(firstId ? reorderEntriesForPrimary(entries, firstId) : entries);
    setActiveTab(0);
    setDragOverIndex(null);
    dragFromRef.current = null;
    setOpen(true);
    enableDropHandler(false);
    return new Promise(resolve => { resolveRef.current = resolve; });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCancel = React.useCallback(() => {
    setOpen(false);
    enableDropHandler(true);
    resolveRef.current?.(null);
    resolveRef.current = null;
  }, []);

  const handleMerge = React.useCallback(() => {
    setOpen(false);
    enableDropHandler(true);
    resolveRef.current?.({ primaryId, mediaUrls: orderedEntries.map(e => e.url) });
    resolveRef.current = null;
  }, [primaryId, orderedEntries]);

  const handleDragStart = React.useCallback((index) => { dragFromRef.current = index; }, []);
  const handleDragOver  = React.useCallback((index) => { setDragOverIndex(index); }, []);
  const handleDragEnd   = React.useCallback(() => { dragFromRef.current = null; setDragOverIndex(null); }, []);

  const handleDrop = React.useCallback((targetIndex) => {
    const fromIndex = dragFromRef.current;
    if (fromIndex !== null && fromIndex !== targetIndex) {
      setOrderedEntries(prev => {
        const arr = [...prev];
        const [removed] = arr.splice(fromIndex, 1);
        arr.splice(targetIndex, 0, removed);
        return arr;
      });
    }
    dragFromRef.current = null;
    setDragOverIndex(null);
  }, []);

  // Build render list: inject non-draggable group headers before runs of
  // multi-disc entries from the same source item.
  const renderList = React.useMemo(() => {
    const list = [];
    let lastGroupId = null;
    for (let i = 0; i < orderedEntries.length; i++) {
      const entry = orderedEntries[i];
      if (entry.sourceItemMediaCount > 1 && entry.sourceItemId !== lastGroupId) {
        list.push({ type: 'header', key: `hdr-${entry.sourceItemId}-${i}`, title: entry.sourceItemTitle });
        lastGroupId = entry.sourceItemId;
      } else if (entry.sourceItemMediaCount === 1) {
        lastGroupId = null;
      }
      list.push({ type: 'entry', key: entry.id, entry, entryIndex: i });
    }
    return list;
  }, [orderedEntries]);

  // Sequential 1-based number for entry rows only
  let entryDisplayNum = 0;

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="md"
      slotProps={{ backdrop: { sx: { backgroundColor: 'rgba(0,0,0,0.85)' } } }}
    >
      <DialogTitle>Merge Items</DialogTitle>

      <DialogContent
        sx={{
          height: 480,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          pb: 0,
          px: 0,
        }}
      >
        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', flexShrink: 0 }}>
          <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ px: 2 }}>
            <Tab label="Select Primary" />
            <Tab label="Media Order" />
          </Tabs>
        </Box>

        {/* ── Tab 0: Select Primary ──────────────────────────────────── */}
        {activeTab === 0 && (
          <Box sx={{
            display: 'flex',
            flexGrow: 1,
            overflow: 'hidden',
            px: 2, pt: 1.5, pb: 1,
            gap: 2,
            flexDirection: { xs: 'column', md: 'row' },
          }}>

            {/* Cards column */}
            <Box sx={{
              flexShrink: 0,
              overflowY: 'auto',
              width:     { xs: '100%', md: '45%' },
              maxHeight: { xs: '45%',  md: 'none' },
            }}>
              {items.map(item => (
                <PrimaryCard
                  key={item.id}
                  item={item}
                  mediaField={mediaField}
                  primaryId={primaryId}
                  recommendedId={recommendedId}
                  onSelect={(id) => {
                setPrimaryId(id);
                setOrderedEntries(prev => reorderEntriesForPrimary(prev, id));
              }}
                />
              ))}
            </Box>

            {/* Divider — vertical on desktop, horizontal on mobile */}
            <Box sx={{
              flexShrink: 0,
              bgcolor: 'divider',
              width:  { xs: '100%', md: '1px' },
              height: { xs: '1px',  md: 'auto' },
            }} />

            {/* Preview column */}
            <Box sx={{
              flexGrow: 1,
              minWidth: 0,
              minHeight: 0,
              overflow: 'hidden',
              maxHeight: { xs: 220, md: 'none' },
            }}>
              <PreviewCarousel item={primaryItem} />
            </Box>

          </Box>
        )}

        {/* ── Tab 1: Media Order ───────────────────────────────────── */}
        {activeTab === 1 && (
          <Box sx={{ flexGrow: 1, overflowY: 'auto', px: 2, pt: 1.5, pb: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              Drag to reorder the combined {mediaField === 'discs' ? 'disc' : 'media'} list.
            </Typography>

            {renderList.length === 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                No {mediaField} found in the selected items.
              </Typography>
            )}

            {renderList.map(row => {
              if (row.type === 'header') {
                return (
                  <Typography
                    key={row.key}
                    variant="caption"
                    sx={{
                      display: 'block',
                      px: 1,
                      pt: 1,
                      pb: 0.25,
                      color: 'text.disabled',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      fontSize: '0.65rem',
                    }}
                  >
                    {row.title}
                  </Typography>
                );
              }
              entryDisplayNum += 1;
              return (
                <Box
                  key={row.key}
                  sx={{ pl: row.entry.sourceItemMediaCount > 1 ? 2 : 0 }}
                >
                  <MediaEntryRow
                    entry={row.entry}
                    entryIndex={row.entryIndex}
                    displayNumber={entryDisplayNum}
                    isDragOver={dragOverIndex === row.entryIndex}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onDragEnd={handleDragEnd}
                  />
                </Box>
              );
            })}
          </Box>
        )}

      </DialogContent>

      <DialogActions sx={{ px: 3, py: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: 'warning.main', mr: 'auto' }}>
          <WarningAmberIcon sx={{ fontSize: 16 }} />
          <Typography variant="caption">Non-primary items will be removed after merging.</Typography>
        </Box>
        <EditorButton label="Cancel" onClick={handleCancel} />
        <EditorButton label="Merge" variant="contained" onClick={handleMerge} disabled={!primaryId} />
      </DialogActions>
    </Dialog>
  );
}
