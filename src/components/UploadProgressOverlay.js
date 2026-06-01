import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Modal from '@mui/material/Modal';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import { GlobalHolder } from '../Global';

export default function UploadProgressOverlay() {
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [progress, setProgress] = React.useState(0);

  GlobalHolder.setUploadProgressOpen = setOpen;
  GlobalHolder.setUploadProgressMessage = setMessage;
  GlobalHolder.setUploadProgressValue = setProgress;

  return (
    <Modal open={open} disableAutoFocus>
      <Backdrop
        open={open}
        sx={{
          backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 3,
            borderRadius: 3,
            minWidth: 300,
            maxWidth: 420,
          }}
        >
          {message ? (
            <Typography
              variant="body1"
              sx={{
                mb: 2,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {message}
            </Typography>
          ) : null}
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              borderRadius: 5,
              '& .MuiLinearProgress-bar': { borderRadius: 5 },
            }}
          />
          <Box sx={{ mt: 1, textAlign: 'center' }}>
            <Typography variant="body2">{progress}%</Typography>
          </Box>
        </Paper>
      </Backdrop>
    </Modal>
  );
}
