import * as React from 'react';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Typography from '@mui/material/Typography';

import { GlobalHolder } from '../Global';
import { enableDropHandler } from '../UrlProcessor';
import EditorButton from './common/editor/EditorButton';
import SelectType from './item-editor/SelectType';

export default function SetDefaultTypeDialog() {
  const [open, setOpen] = React.useState(false);
  const [categoryTitle, setCategoryTitle] = React.useState('');
  const [selectedType, setSelectedType] = React.useState('');
  const resolveRef = React.useRef(null);

  GlobalHolder.openSetDefaultTypePrompt = React.useCallback((category) => {
    setCategoryTitle(category?.title ?? 'this category');
    setSelectedType(category?.defaultType ?? '');
    setOpen(true);
    enableDropHandler(false);
    return new Promise((resolve) => {
      resolveRef.current = resolve;
    });
  }, []);

  const handleOk = () => {
    setOpen(false);
    enableDropHandler(true);
    resolveRef.current?.(selectedType || null);
    resolveRef.current = null;
  };

  const handleCancel = () => {
    setOpen(false);
    enableDropHandler(true);
    resolveRef.current?.(null);
    resolveRef.current = null;
  };

  return (
    <Dialog open={open} onClose={(_, reason) => { if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') handleCancel(); }} disableEscapeKeyDown maxWidth="sm" fullWidth>
      <DialogTitle>No Default Application Set</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 3 }}>
            The category <strong>"{categoryTitle}"</strong> does not have a default application set.
            Select one below, or leave it unset (unrecognized files will be skipped without a fallback).
        </Typography>

        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
          <SelectType
            label="Default Application"
            allowNone
            item={{ type: selectedType }}
            setItem={(newItem) => setSelectedType(newItem.type ?? '')}
          />
        </Box>

        {/* Info callout */}
        <Box
          sx={{
            display: 'flex',
            gap: 1.5,
            p: 1.5,
            borderRadius: 1,
            bgcolor: 'rgba(41,182,246,0.08)',
            border: '1px solid rgba(41,182,246,0.3)',
          }}
        >
          <InfoOutlinedIcon sx={{ color: 'info.light', mt: '1px', flexShrink: 0 }} fontSize="small" />
          <Typography variant="body2" sx={{ color: 'info.light', lineHeight: 1.6 }}>
            When a file's type cannot be automatically determined from its content, the
            default application is used as a fallback. This is especially useful for
            platforms like <strong>Atari 2600</strong>, <strong>CD-based systems</strong>,{' '}
            <strong>ScummVM</strong>, <strong>Arcade</strong>, <strong>DOS</strong>, and others
            where files may not carry a unique identifying signature.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <EditorButton label="OK" variant="contained" onClick={handleOk} />
        <EditorButton label="Skip" onClick={handleCancel} />
      </DialogActions>
    </Dialog>
  );
}
