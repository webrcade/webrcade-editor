/**
 * ArrangeCategoriesDialog
 *
 * Shows every category in a single, unpaginated, drag-to-reorder list
 * (thumbnail, title, one-line description), so categories can be moved
 * any distance in one gesture instead of one step at a time. Saves the
 * new order back into the feed on confirm.
 *
 * Open via: Global.openArrangeCategoriesDialog()
 */

import * as React from 'react';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import * as WrcCommon from '@webrcade/app-common';
import { GlobalHolder, Global } from '../Global';
import * as Util from '../Util';
import { enableDropHandler } from '../UrlProcessor';
import CommonImage from './common/CommonImage';
import EditorButton from './common/editor/EditorButton';

// --- CategoryRow ---------------------------------------------------------------

const CategoryRow = React.memo(function CategoryRow({
  category, index, displayNumber, isDragOver, onDragStart, onDragOver, onDrop, onDragEnd,
}) {
  return (
    <Box
      draggable
      onDragStart={() => onDragStart(index)}
      onDragOver={e => { e.preventDefault(); onDragOver(index); }}
      onDrop={e => { e.preventDefault(); onDrop(index); }}
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
      <CommonImage
        imageSrc={category.thumbnail}
        defaultImageSrc={WrcCommon.CategoryThumbImage}
        requiredAspectRatio={Global.getThumbAspectRatio()}
        sx={{ mr: 0.5, width: 48, height: 36, flexShrink: 0 }}
      />
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Typography variant="body2" noWrap>
          {category.title || '(untitled)'}
        </Typography>
        <Typography
          variant="caption"
          noWrap
          sx={{ color: 'text.disabled', display: 'block', fontWeight: 400, opacity: 0.8 }}
          title={category.description || ''}
        >
          {category.description || ''}
        </Typography>
      </Box>
      <Typography variant="caption" sx={{ color: 'text.disabled', flexShrink: 0, minWidth: 24, textAlign: 'right' }}>
        {displayNumber}
      </Typography>
    </Box>
  );
});

// --- ArrangeCategoriesDialog -----------------------------------------------------

export default function ArrangeCategoriesDialog() {
  const [open, setOpen] = React.useState(false);
  const [categories, setCategories] = React.useState([]);
  const [dragOverIndex, setDragOverIndex] = React.useState(null);
  const dragFromRef = React.useRef(null);
  const scrollContainerRef = React.useRef(null);
  const autoScrollIntervalRef = React.useRef(null);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  GlobalHolder.openArrangeCategoriesPrompt = React.useCallback(() => {
    const feed = Global.getFeed();
    setCategories(Util.cloneObject(feed.categories || []));
    setDragOverIndex(null);
    dragFromRef.current = null;
    setOpen(true);
    enableDropHandler(false);
  }, []);

  const handleCancel = React.useCallback(() => {
    setOpen(false);
    enableDropHandler(true);
  }, []);

  const handleSave = React.useCallback(() => {
    const feed = Global.getFeed();
    feed.categories = categories;
    Global.setFeed({ ...feed });
    setOpen(false);
    enableDropHandler(true);
  }, [categories]);

  const stopAutoScroll = React.useCallback(() => {
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
      autoScrollIntervalRef.current = null;
    }
  }, []);

  // Auto-scroll the list while dragging near its top/bottom edge. Native
  // drag-and-drop only auto-scrolls within a few px of the true edge, which
  // is impractical to hit reliably, so this widens the activation zone.
  const AUTO_SCROLL_ZONE = 50; // px from edge that triggers scrolling
  const AUTO_SCROLL_SPEED = 12; // px per tick

  const handleContainerDragOver = React.useCallback((e) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const distFromTop = e.clientY - rect.top;
    const distFromBottom = rect.bottom - e.clientY;

    let direction = 0;
    if (distFromTop < AUTO_SCROLL_ZONE) {
      direction = -1;
    } else if (distFromBottom < AUTO_SCROLL_ZONE) {
      direction = 1;
    }

    if (direction === 0) {
      stopAutoScroll();
      return;
    }

    if (!autoScrollIntervalRef.current) {
      autoScrollIntervalRef.current = setInterval(() => {
        const el = scrollContainerRef.current;
        if (el) el.scrollTop += direction * AUTO_SCROLL_SPEED;
      }, 16);
    }
  }, [stopAutoScroll]);

  const handleDragStart = React.useCallback((index) => { dragFromRef.current = index; }, []);
  const handleDragOver = React.useCallback((index) => { setDragOverIndex(index); }, []);
  const handleDragEnd = React.useCallback(() => {
    dragFromRef.current = null;
    setDragOverIndex(null);
    stopAutoScroll();
  }, [stopAutoScroll]);

  const handleDrop = React.useCallback((targetIndex) => {
    const fromIndex = dragFromRef.current;
    if (fromIndex !== null && fromIndex !== targetIndex) {
      setCategories(prev => {
        const arr = [...prev];
        const [removed] = arr.splice(fromIndex, 1);
        arr.splice(targetIndex, 0, removed);
        return arr;
      });
    }
    dragFromRef.current = null;
    setDragOverIndex(null);
    stopAutoScroll();
  }, [stopAutoScroll]);

  // Safety net: stop any running auto-scroll if the component unmounts mid-drag
  React.useEffect(() => stopAutoScroll, [stopAutoScroll]);

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="md"
      slotProps={{ backdrop: { sx: { backgroundColor: 'rgba(0,0,0,0.85)' } } }}
    >
      <DialogTitle>Arrange Categories</DialogTitle>

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
        <Typography variant="caption" color="text.secondary" sx={{ px: 2, pt: 1.5, pb: 1, flexShrink: 0 }}>
          Drag to reorder categories.
        </Typography>

        <Box
          ref={scrollContainerRef}
          onDragOver={handleContainerDragOver}
          sx={{ flexGrow: 1, overflowY: 'auto', px: 2, pb: 1 }}
        >
          {categories.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
              No categories found.
            </Typography>
          )}

          {categories.map((category, index) => (
            <CategoryRow
              key={category.id}
              category={category}
              index={index}
              displayNumber={index + 1}
              isDragOver={dragOverIndex === index}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onDragEnd={handleDragEnd}
            />
          ))}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 1.5 }}>
        <EditorButton label="Cancel" onClick={handleCancel} />
        <EditorButton label="Save" variant="contained" onClick={handleSave} />
      </DialogActions>
    </Dialog>
  );
}
