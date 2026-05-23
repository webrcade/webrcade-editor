import * as React from 'react';

import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';

import { dropHandler } from '../../../Drop';

export default function EditorTextField(props) {
  const [isDragOver, setIsDragOver] = React.useState(false);
  const {
    sx,
    onDropText,
    onFileDrop,
    uploading,
    InputProps,
    disabled,
    ...other
  } = props;

  return (
    <TextField
      onDragOver={(e) => {
        if (onFileDrop && e.dataTransfer.types.includes('Files')) {
          e.preventDefault();
          setIsDragOver(true);
        } else if (onDropText && (e.dataTransfer.types.includes('text/uri-list') || e.dataTransfer.types.includes('text/plain'))) {
          e.preventDefault();
          setIsDragOver(true);
        }
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        setIsDragOver(false);
        if (onFileDrop && e.dataTransfer.files.length > 0) {
          e.preventDefault();
          onFileDrop(Array.from(e.dataTransfer.files));
          return;
        }
        if (onDropText) {
          e.preventDefault();
          dropHandler(e, (text) => { onDropText(text); });
        }
      }}
      disabled={uploading || disabled}
      InputProps={uploading ? {
        ...InputProps,
        endAdornment: (
          <InputAdornment position="end">
            <CircularProgress size={16} sx={{ color: 'rgba(255,255,255,0.5)' }} />
          </InputAdornment>
        ),
      } : InputProps}
      sx={{
        m: 1.5,
        width: '35ch',
        maxWidth: '100%',
        ...sx,
        ...(isDragOver && {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#4fc3f7 !important',
            borderWidth: '2px !important',
            borderStyle: 'dashed !important',
          },
        }),
      }}
      {...other}
    />
  );
}
