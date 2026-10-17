import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import useMediaQuery from '@mui/material/useMediaQuery';

import { useTheme } from '@mui/material/styles';

import { Global, GlobalHolder } from '../Global';
import { enableDropHandler } from '../UrlProcessor';
import { usePrevious } from '../Util';

const copyToClipboard = (text) => {
  const input = document.createElement('input');
  input.value = text;

  // Critical for iOS Safari:
  input.setAttribute('readonly', '');
  input.style.position = 'fixed';
  input.style.top = '0';
  input.style.left = '0';
  input.style.opacity = '1'; // Not hidden
  input.style.zIndex = '-1'; // Visually non-disruptive
  input.style.height = '1px'; // Minimal size
  input.style.fontSize = '16px'; // iOS Safari bug: small font sizes can break selection

  document.body.appendChild(input);
  input.focus();
  input.select();

  try {
    const successful = document.execCommand('copy');
    if (!successful) {
      throw new Error('Copy command failed');
    }
  } catch (err) {
    console.warn('Copy failed', err);
  }

  document.body.removeChild(input);
};

const CopyLinkDialog = (props) => {
  const [isOpen, setOpen] = React.useState(false);
  const prevOpen = usePrevious(isOpen);
  const [copyLinkProps, setCopyLinkProps] = React.useState({ link: "" });
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  // Enable/disable the drop handler
  if (prevOpen && !isOpen) {
    enableDropHandler(true);
  } else if (!prevOpen && isOpen) {
    enableDropHandler(false);
  }

  GlobalHolder.setCopyLinkDialogOpen = setOpen;
  GlobalHolder.setCopyLinkDialogProps = setCopyLinkProps;

  const title = copyLinkProps.title;
  const success = copyLinkProps.success;

  const message = copyLinkProps.message;
  const learnMoreUrl = copyLinkProps.learnMoreUrl;

  const getLink = () => {
    return copyLinkProps.link;
  }

  return (
    <Dialog
      open={isOpen}
      onClose={() => setOpen(false)}
      fullScreen={fullScreen}
      {...(message ? { fullWidth: true, maxWidth: 'sm' } : {})}
    >
      <DialogTitle>{title ? title : "Copy Stand-alone Link"}</DialogTitle>
      <DialogContent>
        <div>
          {message ? (
            <TextField
              value={getLink()}
              onChange={() => {}}
              InputProps={{ disabled: true }}
              fullWidth
              sx={{ mt: 1.5 }}
            />
          ) : (
            <TextField
              value={getLink()}
              onChange={() => {}}
              InputProps={{ disabled: true }}
              sx={{ m: 1.5, width: { xs: '35ch', sm: '40ch' } }}
            />
          )}
        </div>
        {message && (
          <Box
            sx={{
              display: 'flex',
              gap: 1.5,
              p: 1.5,
              mt: 3,
              borderRadius: 1,
              bgcolor: 'rgba(41,182,246,0.08)',
              border: '1px solid rgba(41,182,246,0.3)',
            }}
          >
            <InfoOutlinedIcon sx={{ color: 'info.light', mt: '2px', flexShrink: 0 }} fontSize="small" />
            <Typography variant="body2" component="div" sx={{ color: 'info.light', lineHeight: 1.6 }}>
              {message}
              {learnMoreUrl && (
                <>
                  {' '}
                  <a href={learnMoreUrl} target="_blank" rel="noopener noreferrer"
                    style={{ color: 'white', textDecoration: 'underline', cursor: 'pointer' }}
                  >
                    Learn more
                  </a>
                </>
              )}
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => {
          setOpen(false);
          setTimeout(() => {
            copyToClipboard(getLink());
            Global.displayMessage(
              success || "Successfully copied stand-alone link (URL) to clipboard.",
              "success"
            );
          }, 0);
        }}>
          Copy
        </Button>
        <Button onClick={() => setOpen(false)}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CopyLinkDialog;
