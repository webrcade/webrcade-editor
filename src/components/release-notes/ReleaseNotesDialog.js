import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import Fade from '@mui/material/Fade';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';

import {
  resolvePath,
  isDev,
  config,
  ReleaseData,
} from '@webrcade/app-common'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} timeout={500} {...props} />;
});

export function ReleaseNotesDialog({ open, setOpen, onClose }) {
  const [dontShow, setDontShow] = React.useState(false);

  const parseText = (text) => {
    const parts = text.split(/\*(.*?)\*/g);
    return parts.map((part, i) =>
      i % 2 === 1 ? <strong key={i}>{part}</strong> : part
    );
  };

  const renderChange = (change, index) => {
    if (typeof change === 'string') {
      return (
        <li key={index} className="change-item">
          {parseText(change)}
        </li>
      );
    }

    return (
      <li key={index} className="change-item">
        {parseText(change.title)}
        <ul className="sub-change-list">
          {change.items.map((item, si) => (
            <li key={si} className="sub-change-item">
              {parseText(item)}
            </li>
          ))}
        </ul>
      </li>
    );
  };

  const handleClose = () => {
    if (onClose) onClose(dontShow);
    if (setOpen) setOpen(false);
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      disableScrollLock
      fullWidth={false}
      maxWidth={false}
      BackdropProps={{
        sx: {
          backgroundColor: 'rgba(0,0,0,0.85)',
        },
      }}
      PaperProps={{
        sx: {
          width: 'min(800px, 92vw)',
          minHeight: '85vh',
          maxHeight: '85vh',
          background: 'rgba(30,30,30,0.97)',
          borderRadius: '12px',
          boxShadow: `
            0 30px 80px rgba(0, 0, 0, 0.85),
            0 0 0 1px rgba(60, 60, 60, 0.06)
          `,
          color: '#f0f0f0',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          fontSize: '16px',
          fontWeight: 800,
          paddingTop: '18px',
          paddingBottom: '18px',
          textAlign: 'center',
          letterSpacing: '5px',
          // textTransform: 'uppercase',
          color: '#ffffff7c',
          background: 'linear-gradient(to bottom, rgba(46,46,46,.97), rgba(35,35,35,.97))',
          textShadow: '0 2px 4px rgba(0,0,0,.5)',
        }}
      >
        WEBЯCADE UPDATED
      </Box>

      {/* Content */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          paddingLeft: '6%',
          paddingRight: '6%',
          paddingTop: '16px',
        }}
      >
        {ReleaseData.map(note => (
          <Box key={note.version} sx={{ marginBottom: '32px' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '8px',
                color: '#aaa',
                fontWeight: 700,
                fontSize: '14px',
              }}
            >
              <span>{note.version}</span>
              <span>•</span>
              <span>{note.date}</span>
            </Box>

            <Box
              sx={{
                fontSize: '28px',
                fontWeight: 700,
                marginBottom: '32px',
                lineHeight: 1.1,
                textShadow: '0 1px 3px rgba(0,0,0,.6)',
              }}
            >
              {note.title}
            </Box>

            {note.image && (
              <Box
                component="img"
                src={!isDev() ? resolvePath(note.image) : `http://${config.getLocalExternalIp()}:${config.getLocalPort()}/${note.image}`}
                alt=""
                sx={{
                  width: '100%',
                  aspectRatio: '8 / 1',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  marginBottom: '32px',
                  boxShadow: '0 24px 64px rgba(0,0,0,0.75)',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}
              />
            )}

            <ul className="change-list">
              {note.changes.map((change, i) => renderChange(change, i))}
            </ul>
          </Box>
        ))}
      </Box>

      {/* Footer */}
      <Box
        sx={{
          paddingTop: '12px',
          paddingBottom: '12px',
          background: 'rgba(35,35,35,.97)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: '32px',
          paddingRight: '32px',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', transform: 'scale(.8)' }}>
          <Switch
            checked={dontShow}
            onChange={(e) => setDontShow(e.target.checked)}
          />
          <Typography sx={{ color: '#bbb', fontSize: '22px' }}>
            Don't show again
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={handleClose}
          sx={{ paddingLeft: '32px', paddingRight: '32px' }}
        >
          OK
        </Button>
      </Box>
    </Dialog>
  );
}
