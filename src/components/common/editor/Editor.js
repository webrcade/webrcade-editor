import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Tabs from '@mui/material/Tabs';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import { usePrevious } from '../../../Util';

export default function Editor(props) {

  const [okCount, setOkCount] = React.useState(0);

  const { 
    isOpen, 
    setOpen,
    title,
    tabs, 
    tabPanels,
    setTabValue,
    tabValue,
    onShow,
    onSubmit,
    onOk,
    height,
    maxWidth
  } = props;

  const prevOpen = usePrevious(isOpen);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  React.useEffect(() => {
    if (isOpen && !prevOpen) {
      // Reset here
      setTabValue(0);
      if (onShow) onShow();  
    }
  }, [isOpen, prevOpen, setTabValue, onShow]);

  const mwidth = 
    maxWidth === false ? {} :
      {"maxWidth" : maxWidth ? maxWidth : "md"}

  const onOkHandler = () => {
    if (onOk && onOk()) {
      setOpen(false) 
    } else {
      setOkCount(okCount + 1);
    }
  }

  return (    
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={isOpen}
        onClose={() => { setOpen(false) }}
        fullWidth
        onSubmit= {(event) => {
          if (onSubmit) onSubmit(event);
          event.preventDefault();
        }}
        {...mwidth}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent sx={{ height: height ? height : 520 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={(e, value) => { setTabValue(value) }}  
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile>
              {tabs}
            </Tabs>
          </Box>
          {tabPanels}
        </DialogContent>
        <DialogActions>
          <Button onClick={onOkHandler}>
            OK
          </Button>
          <Button onClick={() => { setOpen(false) }}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
} 