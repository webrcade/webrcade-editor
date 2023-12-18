import * as React from 'react';
import Button from '@mui/material/Button';

export default function EditorButton(props) {
  const { label, ...other } = props;

  return (
    <Button
      variant="outlined"
      {...other}
    >
      {label}
    </Button>
  );
}
