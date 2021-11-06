import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

export default function EditorFileChooser(props) {
  const fileInput = React.useRef();
  const { label, sx, onChange, ...other } = props;

  return (
    <Box
      sx={{
        m: 1.5,
        ...sx
      }}
      {...other}
    >
      <Button
        variant="outlined"
        onClick={() => fileInput.current.click()}
      >
        {label}
      </Button>
      <input
        ref={fileInput}
        type="file"
        style={{ display: 'none' }}
        onChange={onChange}
      />
    </Box>
  );
}

