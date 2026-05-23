/**
 * ResolveTypesDialog
 *
 * Shown after Phase-1 analysis when one or more files could not be
 * definitively identified by magic bytes.  Each row lets the user pick the
 * application type for that file before the upload begins.
 *
 * Props flow via GlobalHolder.openResolveTypesPrompt (set below inside the
 * component) which returns a Promise resolved with:
 *   { item, type }[]  — resolved assignments (type === null means "skip")
 * or null if the dialog was cancelled.
 */

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PagedList from './common/PagedList';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import { AppRegistry } from '@webrcade/app-common';
import { Global, GlobalHolder } from '../Global';
import { enableDropHandler } from '../UrlProcessor';
import EditorButton from './common/editor/EditorButton';

// --- Helpers ------------------------------------------------------------------

/**
 * Builds a sorted flat list of alias-only type options.
 * When typeOptions (specific impl keys) is non-empty, restrict to aliases whose
 * absoluteKey is in that set (e.g. .chd → only disc-based systems).
 * When empty, return all alias types.
 * If extraKey is supplied it is always included (covers the rare case where a
 * category default is set to a specific non-alias implementation type).
 */
function buildOptions(typeOptions, extraKey = null) {
  const reg = AppRegistry.instance;
  const allTypes = reg.getAppTypes();
  const specificSet = typeOptions.length > 0 ? new Set(typeOptions) : null;

  return Object.entries(allTypes)
    .filter(([key, t]) => {
      // Always include the explicitly-requested extra (category-default specific type)
      if (extraKey && key === extraKey) return true;
      // Only show alias types — skip raw implementation types
      if (t.absoluteKey === undefined) return false;
      // Filter by typeOptions (alias keys) if provided
      return specificSet === null || specificSet.has(key);
    })
    .map(([key]) => ({ key, name: reg.getShortNameForType(key) }))
    .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
}

/**
 * Validates that key exists in the type registry and returns it as-is.
 * Concrete (impl) type keys are intentionally preserved so that extraKey
 * surfaces them in the per-row dropdown as their specific coreName option.
 * Returns undefined if the key is not found in the registry.
 */
function resolveTypeKey(key) {
  if (!key) return undefined;
  const allTypes = AppRegistry.instance.getAppTypes();
  return allTypes[key] ? key : undefined;
}

// --- TypeThumb ----------------------------------------------------------------

function TypeThumb({ typeKey, width, height }) {
  let src = null;
  if (typeKey) {
    try { src = AppRegistry.instance.getDefaultThumbnailForType(typeKey); } catch (_) {}
  }
  return (
    <Box
      sx={{
        width,
        height,
        flexShrink: 0,
        bgcolor: 'rgba(255,255,255,0.08)',
        borderRadius: 0.5,
        overflow: 'hidden',
      }}
    >
      {src && (
        <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      )}
    </Box>
  );
}

// --- TypeRow ------------------------------------------------------------------

const TypeRow = React.memo(function TypeRow({ item, assignment, onChange }) {
  // If the category default is a non-alias specific type, include it in the
  // per-row dropdown as the sole extra option beyond the normal alias list.
  const extraKey = React.useMemo(() => {
    if (!item.preSelected) return null;
    const t = AppRegistry.instance.getAppTypes()[item.preSelected];
    return (t && t.absoluteKey === undefined) ? item.preSelected : null;
  }, [item.preSelected]);
  const options = React.useMemo(() => buildOptions(item.typeOptions, extraKey), [item.typeOptions, extraKey]);
  const selectValue = assignment ?? '';

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        px: 1,
        py: 0.75,
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* Thumbnail — updates when type is selected */}
      <Box sx={{ flexShrink: 0, mr: 1.5 }}>
        <TypeThumb typeKey={selectValue || null} width={56} height={42} />
      </Box>

      {/* Filename */}
      <Box sx={{ flexGrow: 1, minWidth: 80 }}>
        <Typography
          variant="body2"
          title={item.filename}
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            opacity: selectValue ? 1 : 0.45,
          }}
        >
          {item.filename}
        </Typography>
      </Box>

      {/* Native type selector */}
      <FormControl size="small" sx={{ flexShrink: 0, ml: 1.5, minWidth: 240 }}>
        <Select
          native
          value={selectValue}
          onChange={e => {
            const v = e.target.value;
            onChange(item.id, v === '' ? undefined : v);
          }}
          inputProps={{ style: { fontSize: '14px' } }}
        >
          <option value="">(unassigned)</option>
          {options.map(opt => (
            <option key={opt.key} value={opt.key}>{opt.name}</option>
          ))}
        </Select>
      </FormControl>

    </Box>
  );
});

// --- ResolveTypesDialog -------------------------------------------------------

export default function ResolveTypesDialog() {
  const [open, setOpen] = React.useState(false);
  const [items, setItems] = React.useState([]);
  // Map<id, typeKey | undefined>  (undefined = unassigned/none)
  const [assignments, setAssignments] = React.useState({});
  const [bulkType, setBulkType] = React.useState('');
  const [activeTab, setActiveTab] = React.useState(0);
  const resolveRef = React.useRef(null);
  // Incremented each time allAssigned resets to false, forcing a fresh DOM element
  // (and a clean CSS animation replay) on the next mount.
  const completionKeyRef = React.useRef(0);
  const autoAdvanceTimerRef = React.useRef(null);
  // True when the dialog opened with every item already pre-assigned via category defaults.
  // In that case we skip the green animation and show a calm info message instead.
  const openedWithAllAssignedRef = React.useRef(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  // Options valid for the Apply-to-all dropdown:
  // union of typeOptions across all currently-unassigned items.
  // If any unassigned item accepts any type (empty typeOptions), show all types.
  const bulkOptions = React.useMemo(() => {
    const allTypes = AppRegistry.instance.getAppTypes();
    const unassignedItems = items.filter(item => !assignments[item.id]);
    // Collect any non-alias specific type that appears as a preSelected on unassigned items
    // (the category default may be a specific implementation type).
    const extraKeys = [...new Set(
      unassignedItems
        .map(item => item.preSelected)
        .filter(k => k && allTypes[k] && allTypes[k].absoluteKey === undefined)
    )];
    const hasOpenItem = unassignedItems.some(item => !item.typeOptions?.length);
    if (hasOpenItem) return buildOptions([], extraKeys[0] ?? null);
    const unionKeys = [...new Set(unassignedItems.flatMap(item => item.typeOptions ?? []))];
    return buildOptions(unionKeys, extraKeys[0] ?? null);
  }, [items, assignments]);

  // Keep bulkType in sync with available options — auto-select the first entry
  // when the dialog opens or the option list changes (so Apply is never grey
  // when a valid option is visible in the native <select>).
  React.useEffect(() => {
    if (!open) return;
    if (!bulkType || !bulkOptions.some(o => o.key === bulkType)) {
      setBulkType(bulkOptions.length > 0 ? bulkOptions[0].key : '');
    }
  }, [open, bulkOptions]); // eslint-disable-line react-hooks/exhaustive-deps

  const unassignedCount   = items.filter(item => !assignments[item.id]).length;
  const assignedCount     = items.filter(item => !!assignments[item.id]).length;
  const allAssigned       = items.length > 0 && unassignedCount === 0;
  // Only true when the user manually resolved all items during this session.
  const userResolvedAll = allAssigned && !openedWithAllAssignedRef.current;

  const tabItems = React.useMemo(() => {
    if (activeTab === 0) return items.filter(item => !assignments[item.id]);
    return items.filter(item => !!assignments[item.id]);
  }, [items, assignments, activeTab]);

  GlobalHolder.openResolveTypesPrompt = React.useCallback((reviewItems) => {
    const initial = {};
    for (const item of reviewItems) {
      initial[item.id] = resolveTypeKey(item.preSelected) ?? undefined;
    }
    const allPreAssigned = reviewItems.length > 0 && reviewItems.every(item => initial[item.id] !== undefined);
    openedWithAllAssignedRef.current = allPreAssigned;
    setItems(reviewItems);
    setAssignments(initial);
    setBulkType('');
    setActiveTab(allPreAssigned ? 1 : 0);
    autoAdvanceTimerRef.current = null;
    setOpen(true);
    enableDropHandler(false);
    return new Promise((resolve) => { resolveRef.current = resolve; });
  }, []);

  const handleChange = React.useCallback((id, value) => {
    if (!value) {
      // User is explicitly unassigning an item:
      // • Clear pre-assigned flag → default info message never reappears
      // • Bump completion key → green box remounts (animation replays) on next full-assign
      openedWithAllAssignedRef.current = false;
      completionKeyRef.current += 1;
    }
    setAssignments(prev => ({ ...prev, [id]: value }));
  }, []);

  const renderTypeRow = React.useCallback(
    (item) => (
      <TypeRow
        key={item.id}
        item={item}
        assignment={assignments[item.id]}
        onChange={handleChange}
      />
    ),
    [assignments, handleChange]
  );

  const handleApplyBulk = () => {
    if (!bulkType) return;
    // For alias types use absoluteKey; for non-aliased impl types use the key itself
    const regType = AppRegistry.instance.getAppTypes()[bulkType];
    const absoluteKey = regType?.absoluteKey ?? bulkType;
    setAssignments(prev => {
      const next = { ...prev };
      for (const item of items) {
        if (next[item.id]) continue; // already assigned
        const opts = item.typeOptions ?? [];
        // Apply if item accepts any type (empty opts) or the type is valid for this extension
        if (!opts.length || (absoluteKey && opts.includes(absoluteKey))) {
          next[item.id] = bulkType;
        }
      }
      return next;
    });
    setBulkType('');
  };

  const handleAbort = () => {
    setOpen(false);
    enableDropHandler(true);
    resolveRef.current?.({ aborted: true });
    resolveRef.current = null;
  };

  const handleContinue = () => {
    const result = items.map(item => ({
      item,
      type: assignments[item.id] ?? null,
    }));
    // Close dialog first, then show the full-page busy screen (same as analysis)
    // for a brief moment before the next dialog appears.
    setOpen(false);
    enableDropHandler(true);
    Global.openBusyScreen(true, 'Preparing items\u2026');
    setTimeout(() => {
      Global.openBusyScreen(false);
      resolveRef.current?.(result);
      resolveRef.current = null;
    }, 1200);
  };

  // (No allAssigned effect needed — key and openedWithAllAssigned flag are
  //  managed directly in handleChange to avoid timing issues on dialog open.)

  return (
    <Dialog
      open={open}
      onClose={() => {}}
      disableEscapeKeyDown
      fullScreen={fullScreen}
      fullWidth
      maxWidth="md"
      slotProps={{ backdrop: { sx: { backgroundColor: 'rgba(0,0,0,0.85)' } } }}
    >
      <DialogTitle>Unassigned File Types</DialogTitle>

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
        {/* Tabs — always at top, matching AddLocalFilesDialog layout */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', flexShrink: 0 }}>
          <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ px: 2 }}>
            <Tab label={`Unassigned (${unassignedCount})`} />
            <Tab label={`Assigned (${assignedCount})`} />
          </Tabs>
        </Box>

        {/* Info callout — always visible; text adapts to pre-assigned state */}
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            mx: 2,
            mt: 1.5,
            mb: 0.5,
            p: 1.25,
            borderRadius: 1,
            bgcolor: 'rgba(41,182,246,0.08)',
            border: '1px solid rgba(41,182,246,0.3)',
            flexShrink: 0,
          }}
        >
          <InfoOutlinedIcon sx={{ color: 'info.light', mt: '2px', flexShrink: 0, fontSize: 16 }} />
          {openedWithAllAssignedRef.current && unassignedCount === 0 ? (
            <Typography variant="body2" sx={{ color: 'info.light' }}>
              All files have been assigned the default type. Review or adjust assignments before continuing.
            </Typography>
          ) : (
            <Box>
              <Typography variant="body2" sx={{ color: 'info.light' }}>
                Unable to determine the application type for the following files. Select a type for each, or leave unassigned to skip it.
              </Typography>
              <Typography variant="body2" sx={{ color: 'info.light', mt: 0.5 }}>
                To pre-select a default type, set it in the{' '}
                <strong>Category Editor</strong>{' '}(<strong>Cloud Storage</strong> tab).
              </Typography>
            </Box>
          )}
        </Box>

        {/* Main content — completion box or file list */}
        <Box sx={{ flexGrow: 1, minHeight: 0, px: 2, pt: 0.5, display: 'flex', flexDirection: 'column' }}>
          {allAssigned && activeTab === 0 ? (
            <Box key={completionKeyRef.current} sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{
                  width: '100%',
                  '@keyframes wrcFadeSlideUp': {
                    '0%':   { opacity: 0, transform: 'translateY(8px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' },
                  },
                  '@keyframes wrcBounceIn': {
                    '0%':   { transform: 'scale(0)',   opacity: 0 },
                    '55%':  { transform: 'scale(1.3)', opacity: 1 },
                    '75%':  { transform: 'scale(0.9)' },
                    '100%': { transform: 'scale(1)' },
                  },
                  p: 3,
                  bgcolor: 'rgba(76,175,80,0.07)',
                  borderRadius: 1,
                  border: '1px solid rgba(76,175,80,0.3)',
                  textAlign: 'center',
                  animation: userResolvedAll ? 'wrcFadeSlideUp 0.4s ease-out' : 'none',
                }}
              >
                <CheckCircleIcon
                  sx={{
                    fontSize: 48,
                    color: 'success.main',
                    mb: 0.75,
                    animation: userResolvedAll
                      ? 'wrcBounceIn 0.55s cubic-bezier(0.22,1,0.36,1) 0.15s both'
                      : 'none',
                  }}
                />
                <Typography variant="body1" sx={{ fontWeight: 600, color: 'success.light' }}>
                  All types assigned!
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
                  Press Continue to proceed.
                </Typography>
              </Box>
            </Box>
          ) : (
            <PagedList
              items={tabItems}
              renderRow={renderTypeRow}
              getFilterText={(item) => item.filename}
            />
          )}
        </Box>

      </DialogContent>

      <DialogActions sx={{ justifyContent: (!allAssigned && activeTab === 0) ? 'space-between' : 'flex-end', flexWrap: 'wrap', rowGap: 1, px: 3, py: 1.5 }}>
        {/* Left: apply-to-all — only on Unassigned tab */}
        {!allAssigned && activeTab === 0 && (
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, width: { xs: '100%', md: 'auto' } }}>
          <Typography variant="caption" sx={{ color: unassignedCount > 0 ? 'text.secondary' : 'text.disabled', flexShrink: 0 }}>
            Apply to unassigned:
          </Typography>
          <FormControl size="small" sx={{ minWidth: 240 }} disabled={unassignedCount === 0}>
            <Select native value={bulkType}
                onChange={e => setBulkType(e.target.value)}
                inputProps={{ style: { fontSize: '14px' } }}>
              {bulkOptions.map(opt => (
                <option key={opt.key} value={opt.key}>{opt.name}</option>
              ))}

            </Select>
          </FormControl>
          <Button variant="outlined" size="small" disabled={!bulkType || unassignedCount === 0} onClick={handleApplyBulk}>
            Apply
          </Button>
        </Box>
        )}
        {/* Right: cancel + continue — full-width on mobile keeps them right-aligned when wrapped */}
        <Box sx={{ display: 'flex', gap: 1, paddingBottom: .1, width: { xs: '100%', md: 'auto' }, justifyContent: { xs: 'flex-end', md: 'flex-start' } }}>
          <EditorButton label="Cancel" onClick={handleAbort} />
          <EditorButton label="Continue" variant="contained" onClick={handleContinue} />
        </Box>
      </DialogActions>
    </Dialog>
  );
}

