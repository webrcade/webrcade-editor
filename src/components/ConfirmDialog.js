import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import { GlobalHolder } from '../Global';
import { enableDropHandler } from '../UrlProcessor';
import { usePrevious } from '../Util';

const ConfirmDialog = (props) => {
  const [isOpen, setOpen] = React.useState(false);
  const prevOpen = usePrevious(isOpen);
  const [confirmProps, setConfirmProps] = React.useState({
    title: "Title",
    message: "Message",
    callback: () => {}
  });    
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));  

  // Enable/disable the drop handler
  if (prevOpen && !isOpen) {
    enableDropHandler(true);
  } else if (!prevOpen && isOpen) {
    enableDropHandler(false);
  }  

  GlobalHolder.setConfirmDialogOpen = setOpen;
  GlobalHolder.setConfirmDialogProps = setConfirmProps;

  return (
    <Dialog        
      open={isOpen}
      onClose={() => setOpen(false)}
      fullScreen={fullScreen}
    >
      <DialogTitle>{confirmProps.title}</DialogTitle>
      <DialogContent>{confirmProps.message}</DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setOpen(false);
            confirmProps.callback();
          }}
        >
          Yes
        </Button>
        <Button
          onClick={() => setOpen(false)}
        >
          No
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;