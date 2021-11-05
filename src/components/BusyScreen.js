import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { GlobalHolder } from '../Global';

export default function BusyScreen(props) {
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState(false);

  GlobalHolder.setBusyScreenOpen = setOpen;
  GlobalHolder.setBusyScreenMessage = setMessage;

  return (
    <Backdrop
      sx={{ 
        backgroundColor: 'rgba(0,0,0,0.85)', 
        zIndex: (theme) => theme.zIndex.drawer + 1 }}
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

