import * as React from 'react';
import { usePrevious } from '../Util';
import MuiAlert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import Snackbar from '@mui/material/Snackbar';

import { GlobalHolder } from '../Global';

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

/* severity: error, warning, info, success  */
export default function DisplayMessage(props) {
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState(null);
  const [severity, setMessageSeverity] = React.useState(null);

  GlobalHolder.setMessage = setMessage;
  GlobalHolder.setMessageSeverity = setMessageSeverity;

  const previousMessage = usePrevious(message);

  React.useEffect(() => {
    if ((previousMessage !== message) && message) {
      setOpen(true);
    }
  }, [previousMessage, message]);

  const handleClose = (event, reason) => {
    setMessage(null);
    setOpen(false);
  };

  return (
    <Snackbar 
      open={open} 
      autoHideDuration={6000} 
      onClose={handleClose}
      TransitionComponent={SlideTransition}
      TransitionProps={{
        exit: false
      }}      
    >
      <Alert onClose={handleClose} severity={severity ? severity : "error"} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}