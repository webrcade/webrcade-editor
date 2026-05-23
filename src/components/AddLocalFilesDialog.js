import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import PagedList from './common/PagedList';
import LinearProgress from '@mui/material/LinearProgress';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import * as WrcCommon from '@webrcade/app-common';
import { enableDropHandler } from '../UrlProcessor';
import { GlobalHolder, Global } from '../Global';
import * as Feed from '../Feed';
import { cancelProcessing } from '../LocalFileProcessor';
// import { usePrevious } from '../Util'; // no longer needed
import CommonImage from './common/CommonImage';

// ─── States ──────────────────────────────────────────────────────────────────

export const ADD_LOCAL_STATES = {
  QUEUED: 'queued',
  UPLOADING: 'uploading',
  ANALYZING: 'analyzing',
  COMPLETE: 'complete',
  ERROR: 'error',
};

// ─── ItemThumbnail ───────────────────────────────────────────────────────────

function ItemThumbnail({ game, width, height }) {
  const reg = WrcCommon.AppRegistry.instance;
  const thumbSrc = game?.thumbnail
    ? game.thumbnail
    : reg.getDefaultThumbnailForType(game?.type);
  return (
    <CommonImage
      imageSrc={thumbSrc}
      defaultImageSrc={thumbSrc}
      requiredAspectRatio={[4, 3]}
      sx={{ width, height }}
    />
  );
}

// ─── FileRow ──────────────────────────────────────────────────────────────────

const FileRow = React.memo(function FileRow({ item, onEdit, onDelete }) {
  const reg = WrcCommon.AppRegistry.instance;
  const { game } = item;

  const typeName = game?.type
    ? reg.getShortNameForType(game.type)
    : null;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        px: 1,
        py: 0.75,
        opacity: 1,
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* Thumbnail */}
      <Box sx={{ flexShrink: 0, mr: 1.5 }}>
        <ItemThumbnail game={game} width={56} height={42} />
      </Box>

      {/* Filename / title + type + progress */}
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Typography
          variant="body2"
          sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
        >
          {game?.title ? game.title : item.filename}
        </Typography>

        {typeName && (
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {typeName}
          </Typography>
        )}
      </Box>

      {/* Right-side actions */}
      <Box sx={{ flexShrink: 0, ml: 1.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <IconButton size="small" title="Edit item" onClick={() => onEdit?.(item)}>
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" title="Remove from feed" onClick={() => onDelete?.(item)}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
});

// ─── SkippedRow ───────────────────────────────────────────────────────────────

const SkippedRow = React.memo(function SkippedRow({ item }) {
  return (
    <Box
      sx={{
        px: 1,
        py: 0.75,
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <Typography
        variant="body2"
        sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
      >
        {item.filename}
      </Typography>
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        {item.reason}
      </Typography>
    </Box>
  );
});

// ─── ErrorRow ──────────────────────────────────────────────────────────────────

const ErrorRow = React.memo(function ErrorRow({ item }) {
  return (
    <Box
      sx={{
        px: 1,
        py: 0.75,
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <Typography
        variant="body2"
        sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
      >
        {item.filename}
      </Typography>
      <Typography variant="caption" sx={{ color: 'error.main' }}>
        {item.reason}
      </Typography>
    </Box>
  );
});

// ─── StatusTab ────────────────────────────────────────────────────────────────

function StatusTab({ files, skipped, errors, current, onTabChange }) {
  const total           = files.length;
  const completedCnt    = files.filter(f => f.state === ADD_LOCAL_STATES.COMPLETE).length;
  const uploadErrorCnt  = files.filter(f => f.state === ADD_LOCAL_STATES.ERROR).length;
  const skippedCnt      = skipped.length;
  const errorsCnt       = errors.length + uploadErrorCnt;
  const remaining       = Math.max(0, total - completedCnt - uploadErrorCnt);
  const overallPct      = total > 0 ? Math.round((completedCnt / total) * 100) : 0;
  const allDone         = !current && total > 0;

  // Only animate the completion card the first time it appears
  const completionAnimatedRef = React.useRef(false);
  React.useEffect(() => {
    if (allDone) completionAnimatedRef.current = true;
  }, [allDone]);
  const animateCompletion = allDone && !completionAnimatedRef.current;

  const statCards = [
    { label: 'Remaining', value: remaining.toLocaleString() },
    { label: 'Completed', value: completedCnt.toLocaleString(), tab: 1 },
    { label: 'Skipped',   value: skippedCnt.toLocaleString(),   tab: 2 },
    { label: 'Errors',    value: errorsCnt.toLocaleString(),    tab: 3, error: errorsCnt > 0 },
  ];

  return (
    <Box sx={{ p: 1.5 }}>

      {/* ── Overall progress ─────────────────────────────────────────────── */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 0.5 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {allDone ? 'Completed' : 'Processing files…'}
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            {completedCnt.toLocaleString()}&nbsp;/&nbsp;{total.toLocaleString()}
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={overallPct}
          sx={{ height: 6, borderRadius: 1 }}
        />
      </Box>

      {/* ── Stat cards ───────────────────────────────────────────────────── */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2.5 }}>
        {statCards.map(({ label, value, error, tab }) => (
          <Box
            key={label}
            onClick={tab != null ? () => onTabChange?.(tab) : undefined}
            sx={{
              flex: 1,
              textAlign: 'center',
              py: 1.25,
              bgcolor: 'rgba(255,255,255,0.05)',
              borderRadius: 1,
              border: error ? '1px solid rgba(255,80,80,0.4)' : '1px solid rgba(255,255,255,0.08)',
              ...(tab != null && {
                cursor: 'pointer',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
              }),
            }}
          >
            <Typography variant="h5" sx={{ lineHeight: 1, fontWeight: 700, color: error ? 'error.main' : 'inherit' }}>
              {value}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {label}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* ── Currently processing ─────────────────────────────────────────── */}
      <Typography
        variant="caption"
        sx={{
          color: 'text.secondary',
          textTransform: 'uppercase',
          letterSpacing: 0.8,
          display: 'block',
          mb: 0.75,
        }}
      >
        Currently Processing
      </Typography>

      {current ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 1.5,
            bgcolor: 'rgba(255,255,255,0.05)',
            borderRadius: 1,
            border: '1px solid rgba(255,255,255,0.1)',
            gap: 1.5,
          }}
        >
          <Box
            key={current.id}
            sx={{
              '@keyframes wrcFadeIn': {
                '0%':   { opacity: 0 },
                '100%': { opacity: 1 },
              },
              animation: 'wrcFadeIn 1.5s ease-out',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              width: '100%',
            }}
          >
          {/* Thumbnail */}
          <Box sx={{ flexShrink: 0 }}>
            <ItemThumbnail game={current.game} width={80} height={60} />
          </Box>

          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography
              variant="body1"
              sx={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
              {current.game?.title ?? current.filename}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary', display: 'block', mb: 1 }}
            >
              {current.filename}
            </Typography>
            <LinearProgress
              variant={current.state === ADD_LOCAL_STATES.UPLOADING ? 'determinate' : 'indeterminate'}
              value={current.state === ADD_LOCAL_STATES.UPLOADING ? (current.uploadProgress ?? 0) : 0}
              sx={{
                height: 5, borderRadius: 1, mb: 0.5,
                '& .MuiLinearProgress-bar': {
                  transition: (current.uploadProgress ?? 0) <= 0 ? 'none' : 'transform 0.2s linear',
                },
              }}
            />
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {current.state === ADD_LOCAL_STATES.UPLOADING
                ? `Uploading… ${current.uploadProgress ?? 0}%`
                : 'Processing…'}
            </Typography>
          </Box>
          </Box>
        </Box>
      ) : total > 0 ? (
        (() => {
          const hasErrors  = errorsCnt > 0;
          const allFailed  = hasErrors && completedCnt === 0;
          const bgColor    = allFailed ? 'rgba(211,47,47,0.07)'  : 'rgba(76,175,80,0.07)';
          const bgHover    = allFailed ? 'rgba(211,47,47,0.14)'  : 'rgba(76,175,80,0.14)';
          const borderColor= allFailed ? 'rgba(211,47,47,0.3)'   : 'rgba(76,175,80,0.3)';
          const iconColor  = allFailed ? 'error.main'            : 'success.main';
          const textColor  = allFailed ? 'error.light'           : 'success.light';
          const headline   = allFailed ? 'Upload failed!'        : 'All files processed!';
          const targetTab  = allFailed ? 3                       : 1;
          return (
            <Box
              sx={{
                '@keyframes wrcFadeSlideUp': {
                  '0%':   { opacity: 0, transform: 'translateY(8px)' },
                  '100%': { opacity: 1, transform: 'translateY(0)' },
                },
                '@keyframes wrcBounceIn': {
                  '0%':   { transform: 'scale(0)',    opacity: 0 },
                  '55%':  { transform: 'scale(1.3)',  opacity: 1 },
                  '75%':  { transform: 'scale(0.9)' },
                  '100%': { transform: 'scale(1)' },
                },
                p: 2,
                bgcolor: bgColor,
                borderRadius: 1,
                border: `1px solid ${borderColor}`,
                textAlign: 'center',
                animation: animateCompletion ? 'wrcFadeSlideUp 0.4s ease-out' : 'none',
                cursor: 'pointer',
                '&:hover': { bgcolor: bgHover },
              }}
              onClick={() => onTabChange?.(targetTab)}
            >
              {allFailed
                ? <ErrorIcon sx={{ fontSize: 48, color: iconColor, mb: 0.75, animation: animateCompletion ? 'wrcBounceIn 0.55s cubic-bezier(0.22,1,0.36,1) 0.15s both' : 'none' }} />
                : <CheckCircleIcon sx={{ fontSize: 48, color: iconColor, mb: 0.75, animation: animateCompletion ? 'wrcBounceIn 0.55s cubic-bezier(0.22,1,0.36,1) 0.15s both' : 'none' }} />
              }
              <Typography variant="body1" sx={{ fontWeight: 600, color: textColor }}>
                {headline}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {completedCnt > 0 && `${completedCnt} completed`}
                {completedCnt > 0 && skippedCnt > 0 && '  ·  '}
                {skippedCnt > 0 && `${skippedCnt} skipped`}
                {hasErrors && (completedCnt > 0 || skippedCnt > 0) && '  ·  '}
                {hasErrors && `${errorsCnt} error${errorsCnt !== 1 ? 's' : ''}`}
              </Typography>
            </Box>
          );
        })()
      ) : (
        <Box
          sx={{
            p: 1.5,
            bgcolor: 'rgba(255,255,255,0.05)',
            borderRadius: 1,
            border: '1px solid rgba(255,255,255,0.08)',
            textAlign: 'center',
          }}
        >
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            No files to process.
          </Typography>
        </Box>
      )}

    </Box>
  );
}

// ─── Dialog ───────────────────────────────────────────────────────────────────

export default function AddLocalFilesDialog() {
  const [isOpen, setOpen] = React.useState(false);
  const [tabValue, setTabValue] = React.useState(0);
  const [files, setFiles] = React.useState([]);
  const [skipped, setSkipped] = React.useState([]);
  const [errors, setErrors] = React.useState([]);
  const [current, setCurrent] = React.useState(null);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  GlobalHolder.setAddLocalFilesDialogOpen = setOpen;
  GlobalHolder.setLocalFilesData = ({ accepted, skipped: sk, errors: er = [] }) => {
    // Reset all accepted files to QUEUED so the mock pipeline can walk through them
    setFiles(accepted.map(f => ({ ...f, state: ADD_LOCAL_STATES.QUEUED })));
    setSkipped(sk);
    setErrors(er);
  };
  GlobalHolder.addLocalFileError = (item) => {
    setErrors(prev => [...prev, item]);
  };
  GlobalHolder.updateLocalFile = (id, updates) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  React.useEffect(() => {
    if (isOpen) {
      enableDropHandler(false);
    } else {
      // Stop any in-progress uploads
      cancelProcessing();
      // Clear any stale edit callback if the dialog closes before ItemEditor saves
      GlobalHolder.onItemSaved = null;
      setFiles([]);
      setSkipped([]);
      setErrors([]);
      setCurrent(null);
      setTabValue(0);
      enableDropHandler(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Track the currently-uploading file so the status tab can show it.
  React.useEffect(() => {
    if (!isOpen) return;
    const uploading = files.find(f => f.state === ADD_LOCAL_STATES.UPLOADING);
    const next = uploading ?? files.find(f => f.state === ADD_LOCAL_STATES.QUEUED) ?? null;
    setCurrent(next);
  }, [files, isOpen]);

  const handleEdit = React.useCallback((fileItem) => {
    // Register one-shot callback to sync the dialog row after ItemEditor saves
    GlobalHolder.onItemSaved = (savedGame) => {
      setFiles(prev => prev.map(f =>
        f.id === fileItem.id ? { ...f, game: { ...savedGame } } : f
      ));
    };
    // Pass the full feed item so fields like `added` are preserved on save
    const feedItem = Feed.getItemById(Global.getFeed(), fileItem.game?.id) ?? fileItem.game;
    Global.editItem(feedItem);
  }, []);

  const handleDelete = React.useCallback((item) => {
    // Remove from feed
    const feed = Global.getFeed();
    const catId = Global.getFeedCategoryId();
    if (item.game?.id) {
      Feed.deleteItemsFromCategory(feed, catId, [item.game.id]);
      Global.setFeed({ ...feed });
    }
    // Remove from dialog list
    setFiles(prev => prev.filter(f => f.id !== item.id));
  }, []);

  // Stable renderRow callbacks — passed as props to PagedList so that the
  // memoized rowElements inside PagedList don't invalidate on every parent render.
  const renderCompletedRow = React.useCallback(
    item => <FileRow key={item.id} item={item} onEdit={handleEdit} onDelete={handleDelete} />,
    [handleEdit, handleDelete]
  );
  const renderSkippedRow = React.useCallback(
    item => <SkippedRow key={item.id} item={item} />,
    []
  );
  const renderErrorRow = React.useCallback(
    item => <ErrorRow key={item.id} item={item} />,
    []
  );

  const completeCount = files.filter(
    f => f.state === ADD_LOCAL_STATES.COMPLETE
  ).length;

  return (
    <Dialog
      open={isOpen}
      onClose={(_, reason) => { if (reason !== 'backdropClick') setOpen(false); }}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="md"
      slotProps={{ backdrop: { sx: { backgroundColor: 'rgba(0,0,0,0.85)' } } }}
    >
      <DialogTitle>
        Add Local Files
      </DialogTitle>

      <DialogContent
        sx={{
          height: 480,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          pb: 0,
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: 'divider', flexShrink: 0 }}>
          <Tabs
            value={tabValue}
            onChange={(e, v) => setTabValue(v)}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
          >
            <Tab label="Status" />
            <Tab label={`Completed (${completeCount})`} />
            <Tab label={`Skipped (${skipped.length})`} />
            <Tab label={`Errors (${errors.length + files.filter(f => f.state === ADD_LOCAL_STATES.ERROR).length})`} />
          </Tabs>
        </Box>

        {/* Status tab */}
        <Box
          sx={{ display: tabValue === 0 ? 'block' : 'none', overflowY: 'auto', flexGrow: 1, mt: 1 }}
        >
          <StatusTab files={files} skipped={skipped} errors={errors} current={current} onTabChange={setTabValue} />
        </Box>

        {/* Completed tab */}
        <Box
          sx={{ display: tabValue === 1 ? 'flex' : 'none', flexDirection: 'column', overflow: 'hidden', flexGrow: 1, mt: 1 }}
        >
          <PagedList
            items={files.filter(f => f.state === ADD_LOCAL_STATES.COMPLETE)}
            getFilterText={item => item.game?.title || item.filename}
            renderRow={renderCompletedRow}
          />
        </Box>

        {/* Skipped tab */}
        <Box
          sx={{ display: tabValue === 2 ? 'flex' : 'none', flexDirection: 'column', overflow: 'hidden', flexGrow: 1, mt: 1 }}
        >
          <PagedList
            items={skipped}
            getFilterText={item => item.filename}
            renderRow={renderSkippedRow}
          />
        </Box>

        {/* Errors tab */}
        <Box
          sx={{ display: tabValue === 3 ? 'flex' : 'none', flexDirection: 'column', overflow: 'hidden', flexGrow: 1, mt: 1 }}
        >
          <PagedList
            items={[
              ...errors,
              ...files.filter(f => f.state === ADD_LOCAL_STATES.ERROR),
            ]}
            getFilterText={item => item.filename}
            renderRow={renderErrorRow}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={() => setOpen(false)}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
