import * as React from 'react';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
import ClearIcon from '@mui/icons-material/Clear';
import CodeIcon from '@mui/icons-material/Code';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import AddLinkIcon from '@mui/icons-material/AddLink';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import UploadFileIcon from '@mui/icons-material/UploadFile';

import { computeShortNames } from '@webrcade/app-common';

import EditorTextField from './EditorTextField';
import { setDragGhostImage } from '../DragGhostImage';
import { getDisplayUrl, getFilename } from '../../../Util';
import { dropHandler } from '../../../Drop';
import { dropboxPicker } from '../../../Dropbox';
import { GlobalHolder } from '../../../Global';
import Prefs from '../../../Prefs';

const LARGE_FILE_THRESHOLD = 5 * 1024 * 1024; // 5 MB
// Editor-wide escape hatch (Settings > Editor) for anyone who prefers the
// old plain-text-field look over the Simplified/Raw list UI, regardless of
// field type — separate from the `rawOnly` prop, which is a per-field call
// made by whoever wires up that specific field (e.g. one-shot URL-paste
// dialogs that have nothing to persist/review later).
export const PREF_CLASSIC_URL_FIELDS = 'classicUrlFields';

function AddMenu(props) {
  const {
    anchorEl,
    extraMenuItems,
    multiselect,
    onDropText,
    onFileUpload,
    onAddViaText,
    setAnchorEl,
  } = props;
  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFileMenuClick = () => {
    handleClose();
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = Boolean(multiselect);
    input.onchange = (e) => {
      const files = Array.from(e.target.files);
      if (files.length > 0) onFileUpload(files);
    };
    input.click();
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      disablePortal
    >
      {extraMenuItems && extraMenuItems.map((item, i) => (
        <MenuItem key={i} onClick={() => { handleClose(); item.onClick(); }}>
          {item.icon ? <ListItemIcon>{item.icon}</ListItemIcon> : null}
          {item.label}
        </MenuItem>
      ))}
      {extraMenuItems && extraMenuItems.length > 0 && <Divider />}
      <MenuItem onClick={() => {
        handleClose();
        dropboxPicker((res) => {
          if (onDropText) {
            onDropText(res.length > 1 ? res : res[0]);
          }
        }, multiselect ? true : false);
      }}>
        <ListItemIcon>
          <span className="iconify"
            data-icon="mdi:dropbox"
            data-width="20"
            data-height="20"
            sx={{
              color: 'white',
            }}></span>
        </ListItemIcon>
        Select from Dropbox...
      </MenuItem>
      {onAddViaText && <Divider />}
      {onAddViaText && (
        <MenuItem onClick={() => { handleClose(); onAddViaText(); }}>
          <ListItemIcon>
            <AddLinkIcon fontSize="small" />
          </ListItemIcon>
          {multiselect ? 'Add URLs...' : 'Enter URL...'}
        </MenuItem>
      )}
      {onFileUpload && <Divider />}
      {onFileUpload && (
        <MenuItem onClick={handleFileMenuClick}>
          <ListItemIcon>
            <UploadFileIcon fontSize="small" />
          </ListItemIcon>
          {multiselect ? 'Add files...' : 'Select file...'}
        </MenuItem>
      )}
    </Menu>
  );
}

// --- UrlRow (simplified-mode list row) -----------------------------------------

const UrlRow = React.memo(function UrlRow({
  url, displayName, index, isDragOver, isDragging, showFullUrl, draggable, disabled, onDragStart, onDragOver, onDrop, onDragEnd, onDelete,
}) {
  return (
    <Box
      draggable={draggable}
      onDragStart={draggable ? (e) => {
        onDragStart(index);
        setDragGhostImage(e, displayName, showFullUrl ? url : getDisplayUrl(url));
      } : undefined}
      onDragOver={draggable ? e => { e.preventDefault(); onDragOver(index); } : undefined}
      onDrop={draggable ? e => { e.preventDefault(); onDrop(index); } : undefined}
      onDragEnd={draggable ? onDragEnd : undefined}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: draggable ? 1 : 0,
        py: draggable ? 0.75 : 0,
        mb: draggable ? 0.5 : 0,
        borderRadius: draggable ? 1 : 0,
        border: draggable ? '1px solid' : 'none',
        borderColor: isDragOver ? 'primary.main' : 'rgba(255,255,255,0.12)',
        bgcolor: isDragOver ? 'rgba(144,202,249,0.1)' : (draggable ? 'rgba(255,255,255,0.02)' : 'transparent'),
        opacity: isDragging ? 0.7 : (disabled ? 0.5 : 1),
        cursor: draggable ? 'grab' : 'default',
        userSelect: 'none',
        transition: 'border-color 0.1s, background-color 0.1s',
        '&:hover': draggable && !isDragOver ? { borderColor: 'rgba(255,255,255,0.28)', bgcolor: 'rgba(255,255,255,0.05)' } : undefined,
      }}
    >
      {draggable && <DragHandleIcon sx={{ fontSize: 16, color: 'text.secondary', flexShrink: 0 }} />}
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Typography variant="body2" noWrap title={url}>
          {displayName}
        </Typography>
        <Typography variant="caption" noWrap sx={{ color: 'text.disabled', display: 'block' }} title={url}>
          {showFullUrl ? url : getDisplayUrl(url)}
        </Typography>
      </Box>
      <Tooltip title={draggable ? 'Remove' : 'Clear'}>
        <IconButton size="small" onClick={() => onDelete(index)} sx={{ flexShrink: 0 }}>
          <ClearIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
});

// --- EditorUrlField -------------------------------------------------------------

export default function EditorUrlField(props) {
  const [menuAnchor, setMenuAnchor] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [internalMode, setInternalMode] = React.useState('simplified');
  const [internalShowFullUrl, setInternalShowFullUrl] = React.useState(true);
  const [dragOverIndex, setDragOverIndex] = React.useState(null);
  const [draggedIndex, setDraggedIndex] = React.useState(null);
  const [isFieldDragOver, setIsFieldDragOver] = React.useState(false);
  const [addAnchor, setAddAnchor] = React.useState(null);
  const [addText, setAddText] = React.useState('');
  const dragFromRef = React.useRef(null);
  const fieldDragCounterRef = React.useRef(0);

  const {
    extraMenuItems,
    multiselect,
    multiline,
    rawOnly,
    mode: controlledMode,
    onModeChange,
    showFullUrl: controlledShowFullUrl,
    onShowFullUrlChange,
    onFileUpload,
    onDropText,
    value,
    onChange,
    label,
    required,
    error,
    helperText,
    sx,
    rows,
    ...other
  } = props;

  const handleFileUpload = React.useCallback(async (files) => {
    if (!onFileUpload) return;
    setIsUploading(true);
    let overlayOpen = false;
    try {
      const urls = [];
      for (const file of files) {
        const isLarge = file.size >= LARGE_FILE_THRESHOLD;
        if (isLarge) {
          GlobalHolder.setUploadProgressMessage(`Uploading ${file.name}...`);
          GlobalHolder.setUploadProgressValue(0);
          GlobalHolder.setUploadProgressOpen(true);
          overlayOpen = true;
        }
        const url = await onFileUpload(
          file,
          isLarge ? (pct) => GlobalHolder.setUploadProgressValue(pct) : null
        );
        urls.push(url);
      }
      if (onDropText) {
        onDropText(urls.length === 1 ? urls[0] : urls);
      }
    } catch (e) {
      console.error('[EditorUrlField] Upload failed:', e);
      GlobalHolder.setMessage(e?.message || 'Upload failed.');
      GlobalHolder.setMessageSeverity('error');
    } finally {
      if (overlayOpen) {
        GlobalHolder.setUploadProgressOpen(false);
      }
      setIsUploading(false);
    }
  }, [onFileUpload, onDropText]);

  const urls = React.useMemo(
    () => value ? value.split('\n').filter(u => u.trim().length > 0) : [],
    [value]
  );

  // Strip the longest common prefix across filenames so entries that only
  // differ near the end (e.g. "...Disk-1-of-2" vs "...Disk-2-of-2") remain
  // distinguishable once truncated, instead of showing identical ellipses.
  const displayNames = React.useMemo(
    () => computeShortNames(urls.map(getFilename)),
    [urls]
  );

  // Multi-URL fields (EditorMultiUrlField) pass multiline+multiselect together;
  // single-URL fields pass neither. Used to adjust a handful of details below
  // (raw textarea sizing, drag-to-reorder, add/paste behavior, wording) —
  // otherwise both kinds of fields share the exact same Simplified/Raw UI.
  const isMulti = Boolean(multiline);

  // rawOnly fields never offer Simplified mode, so skip the label-above-the-box
  // layout (and the extra vertical space it costs) entirely and render like a
  // plain native field instead — label floating in the border, same as before
  // this component grew a Simplified mode. Same outcome, editor-wide, if the
  // user has opted into classic fields via Settings > Editor.
  if (rawOnly || Prefs.getBoolPreference(PREF_CLASSIC_URL_FIELDS, false)) {
    return (
      <>
        <Stack spacing={0} direction="row" alignItems="center">
          <EditorTextField
            {...other}
            label={label}
            required={required}
            error={error}
            helperText={helperText}
            multiline={isMulti || undefined}
            rows={isMulti ? rows : undefined}
            value={value}
            onChange={onChange}
            sx={sx}
            onDropText={onDropText}
            onFileDrop={onFileUpload ? handleFileUpload : undefined}
            uploading={isUploading}
          />
          <Tooltip title="Select">
            <IconButton
              sx={{ ml: -.8 }}
              disabled={isUploading}
              onClick={(e) => setMenuAnchor(e.target)}>
              <ArrowDropDownCircleIcon />
            </IconButton>
          </Tooltip>
        </Stack>
        <AddMenu
          anchorEl={menuAnchor}
          extraMenuItems={extraMenuItems}
          setAnchorEl={setMenuAnchor}
          onDropText={onDropText}
          onFileUpload={onFileUpload ? handleFileUpload : undefined}
          multiselect={multiselect}
        />
      </>
    );
  }

  // --- Simplified/Raw dual-mode rendering ---------------------------------------

  const mode = rawOnly ? 'raw' : (controlledMode !== undefined ? controlledMode : internalMode);
  const setMode = onModeChange || setInternalMode;
  const showFullUrl = controlledShowFullUrl !== undefined ? controlledShowFullUrl : internalShowFullUrl;
  const setShowFullUrl = onShowFullUrlChange || setInternalShowFullUrl;

  const isEmpty = urls.length === 0;
  const acceptsFiles = Boolean(onFileUpload);

  const commitUrls = (newUrls) => {
    if (onChange) {
      onChange({ target: { value: newUrls.join('\n') } });
    }
  };

  const handleDelete = (index) => {
    const next = [...urls];
    next.splice(index, 1);
    commitUrls(next);
  };

  const handleDragStart = (index) => { dragFromRef.current = index; setDraggedIndex(index); };
  const handleRowDragOver = (index) => {
    // Only show the reorder insertion highlight while actually dragging one
    // of our own rows — this also fires for external file/URL drags (e.g.
    // dropping a local file to upload), which shouldn't look like you can
    // "position" them into a specific slot.
    if (dragFromRef.current !== null) {
      setDragOverIndex(index);
    }
  };
  const handleDragEnd = () => { dragFromRef.current = null; setDragOverIndex(null); setDraggedIndex(null); };
  const handleRowDrop = (targetIndex) => {
    const fromIndex = dragFromRef.current;
    if (fromIndex !== null && fromIndex !== targetIndex) {
      const next = [...urls];
      const [removed] = next.splice(fromIndex, 1);
      next.splice(targetIndex, 0, removed);
      commitUrls(next);
    }
    dragFromRef.current = null;
    setDragOverIndex(null);
    setDraggedIndex(null);
  };

  const closeAddPopover = () => setAddAnchor(null);
  const commitAddText = () => {
    const lines = addText.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length > 0 && onDropText) {
      // Single-URL fields can only ever hold one value — if several lines
      // were pasted, just take the first rather than handing the caller's
      // onDropText an array it isn't expecting.
      onDropText(multiselect ? (lines.length > 1 ? lines : lines[0]) : lines[0]);
    }
    closeAddPopover();
  };

  const isValidFieldDragType = (e) => {
    if (onFileUpload && e.dataTransfer.types.includes('Files')) return true;
    if (onDropText && (e.dataTransfer.types.includes('text/uri-list') || e.dataTransfer.types.includes('text/plain'))) return true;
    return false;
  };
  // dragenter/dragleave fire on every child element boundary the cursor
  // crosses (each row), not just when the drag truly enters/leaves this
  // container — a plain dragover/dragleave toggle flickers as you move over
  // rows inside the box. Counting enter/leave pairs (which are balanced,
  // unlike the continuously-firing dragover) avoids that.
  const handleFieldDragEnter = (e) => {
    if (!isValidFieldDragType(e)) return;
    e.preventDefault();
    fieldDragCounterRef.current += 1;
    setIsFieldDragOver(true);
  };
  const handleFieldDragOver = (e) => {
    if (isValidFieldDragType(e)) e.preventDefault();
  };
  const handleFieldDragLeave = (e) => {
    if (!isValidFieldDragType(e)) return;
    fieldDragCounterRef.current -= 1;
    if (fieldDragCounterRef.current <= 0) {
      fieldDragCounterRef.current = 0;
      setIsFieldDragOver(false);
    }
  };
  const handleFieldDrop = (e) => {
    fieldDragCounterRef.current = 0;
    setIsFieldDragOver(false);
    if (onFileUpload && e.dataTransfer.files.length > 0) {
      e.preventDefault();
      handleFileUpload(Array.from(e.dataTransfer.files));
      return;
    }
    if (onDropText) {
      e.preventDefault();
      dropHandler(e, (text) => { onDropText(text); });
    }
  };

  // The icon button beside the field is NOT part of the field's own width
  // budget (same as raw single-line fields, where the dropdown arrow sits
  // outside the TextField's own width) — so pull `width` out of sx and apply
  // it directly to the content itself, not to a wrapper that also contains
  // the icon button.
  const { width: fieldWidth, ...restSx } = sx || {};
  const contentWidth = fieldWidth || '50ch';

  return (
    <Box sx={{ m: 1.5 }}>
      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ width: contentWidth, maxWidth: '100%', mb: 0.5 }}>
        <Typography variant="caption" sx={{ color: error ? 'error.main' : 'text.secondary', flexGrow: 1 }}>
          {label}{required ? ' *' : ''}
        </Typography>
        {mode === 'simplified' && urls.length > 1 && (
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={showFullUrl}
                onChange={e => setShowFullUrl(e.target.checked)}
              />
            }
            label={<Typography variant="caption" color="text.secondary">Full path</Typography>}
            labelPlacement="start"
            sx={{ mr: 0, ml: 0, gap: 0.5 }}
          />
        )}
        {!rawOnly && (
          <Tooltip title={mode === 'simplified' ? 'Switch to raw text' : 'Switch to simplified view'}>
            <IconButton size="small" onClick={() => setMode(mode === 'simplified' ? 'raw' : 'simplified')}>
              {mode === 'simplified' ? <CodeIcon fontSize="small" /> : <FormatListBulletedIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        )}
      </Stack>

      <Stack direction="row" alignItems="center">
        {mode === 'raw' ? (
          <EditorTextField
            {...other}
            multiline={isMulti || undefined}
            rows={isMulti ? rows : undefined}
            value={value}
            onChange={onChange}
            onDropText={onDropText}
            onFileDrop={onFileUpload ? handleFileUpload : undefined}
            uploading={isUploading}
            sx={{ m: 0, width: contentWidth, ...restSx }}
          />
        ) : (
          <Box
            onDragEnter={handleFieldDragEnter}
            onDragOver={handleFieldDragOver}
            onDragLeave={handleFieldDragLeave}
            onDrop={handleFieldDrop}
            sx={{
              position: 'relative',
              width: contentWidth,
              maxWidth: '100%',
              bgcolor: 'rgba(255,255,255,0.03)',
              border: '1px solid',
              borderColor: error ? 'error.main' : (isFieldDragOver ? '#4fc3f7' : 'rgba(255,255,255,0.23)'),
              borderStyle: isFieldDragOver ? 'dashed' : 'solid',
              borderWidth: isFieldDragOver ? 2 : 1,
              borderRadius: 1,
              p: isEmpty ? 0 : 1,
              maxHeight: isMulti ? (rows || 5) * 44 : undefined,
              overflowY: isMulti ? 'auto' : 'visible',
              ...restSx,
            }}
          >
            {isUploading && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  right: 8,
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  zIndex: 1,
                }}
              >
                <CircularProgress size={16} sx={{ color: 'rgba(255,255,255,0.5)' }} />
              </Box>
            )}
            {isEmpty ? (
              <Box
                sx={{
                  p: 2,
                  textAlign: 'center',
                  color: 'text.disabled',
                }}
              >
                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                  {isMulti
                    ? `Click the button to the right to add, or drag URLs${acceptsFiles ? ' or files' : ''} here`
                    : `Click the button to the right to set, or drag a URL${acceptsFiles ? ' or file' : ''} here`}
                </Typography>
              </Box>
            ) : (
              <>
                {urls.map((url, index) => (
                  <UrlRow
                    key={`${index}-${url}`}
                    url={url}
                    displayName={displayNames[index] ?? getFilename(url)}
                    index={index}
                    isDragOver={dragOverIndex === index}
                    isDragging={draggedIndex === index}
                    showFullUrl={urls.length > 1 ? showFullUrl : true}
                    draggable={multiselect}
                    disabled={isUploading}
                    onDragStart={handleDragStart}
                    onDragOver={handleRowDragOver}
                    onDrop={handleRowDrop}
                    onDragEnd={handleDragEnd}
                    onDelete={handleDelete}
                  />
                ))}
              </>
            )}
          </Box>
        )}
        <Tooltip title={multiselect ? 'Add' : 'Select'}>
          <IconButton
            sx={{ ml: .5 }}
            disabled={isUploading}
            onClick={(e) => {
              setMenuAnchor(e.target)
            }}>
            {multiselect ? <AddCircleIcon /> : <ArrowDropDownCircleIcon />}
          </IconButton>
        </Tooltip>
      </Stack>

      {helperText && (
        <FormHelperText error={error} sx={{ mx: 0 }}>{helperText}</FormHelperText>
      )}

      <Popover
        open={Boolean(addAnchor)}
        anchorEl={addAnchor}
        onClose={closeAddPopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box sx={{ p: 1.5, width: 420 }}>
          <EditorTextField
            autoFocus
            multiline={multiselect || undefined}
            rows={multiselect ? 4 : undefined}
            fullWidth
            placeholder={multiselect ? "Paste one or more URLs, one per line" : "Paste a URL"}
            value={addText}
            onChange={(e) => setAddText(e.target.value)}
            onKeyDown={!multiselect ? (e) => { if (e.key === 'Enter') { e.preventDefault(); commitAddText(); } } : undefined}
            onDropText={(text) => setAddText(prev => prev ? `${prev}\n${text}` : text)}
            onFileDrop={onFileUpload ? (files) => { handleFileUpload(files).then(closeAddPopover); } : undefined}
            uploading={isUploading}
            sx={{
              m: 0,
              width: '100%',
              // react-textarea-autosize (used internally by MUI's multiline
              // TextField) sets its own inline `overflow` style for height
              // measurement, which beats a plain sx rule. !important in a
              // stylesheet rule is the one thing that still wins over that.
              '& textarea': { whiteSpace: 'nowrap', overflowX: 'auto !important' },
            }}
          />
          <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ mt: 1 }}>
            <Button size="small" variant="contained" onClick={commitAddText}>OK</Button>
            <Button size="small" onClick={closeAddPopover}>Cancel</Button>
          </Stack>
        </Box>
      </Popover>

      <AddMenu
        anchorEl={menuAnchor}
        extraMenuItems={extraMenuItems}
        setAnchorEl={setMenuAnchor}
        onDropText={onDropText}
        onFileUpload={onFileUpload ? handleFileUpload : undefined}
        onAddViaText={mode === 'simplified' ? () => { setAddText(''); setAddAnchor(menuAnchor); } : undefined}
        multiselect={multiselect}
      />
    </Box>
  );
}
