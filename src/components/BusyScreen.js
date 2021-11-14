import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { usePrevious } from '../Util';
import { enableDropHandler } from '../UrlProcessor';
import { GlobalHolder } from '../Global';

export default function BusyScreen(props) {  
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState(false);
  const prevOpen = usePrevious(open);

  GlobalHolder.setBusyScreenOpen = setOpen;
  GlobalHolder.setBusyScreenMessage = setMessage;

  // Enable/disable the drop handler
  if (prevOpen && !open) {
    enableDropHandler(true);
//console.log('enable drop');
  } else if (!prevOpen && open) {
//console.log('disable drop');    
    enableDropHandler(false);
  }

  return (
    <Backdrop
      sx={{ 
        backgroundColor: 'rgba(0,0,0,0.85)', 
        zIndex: (theme) => theme.zIndex.drawer + 100 }}
      open={open}
    >
      <Box>
        <Grid 
          container
          justifyContent="center">
          <CircularProgress color="primary"/>
        </Grid>
        {message ? (
          <Box sx={{mt: 3}}>
            <Typography variant="body1">
              {message}
            </Typography>
          </Box>
        ) : null}
      </Box>
    </Backdrop>
  );
}

