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
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import { enableDropHandler } from '../../../UrlProcessor';
import { usePrevious } from '../../../Util';

export default function Editor(props) {

  const [okCount, setOkCount] = React.useState(0);
  const [submitting, setSubmitting] = React.useState(false);
  const [hasMoreBelow, setHasMoreBelow] = React.useState(false);
  const contentRef = React.useRef(null);

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
    maxWidth,
    closeButton,
    okTitle,
    okDisabled,
    ...other
  } = props;

  const prevOpen = usePrevious(isOpen);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  // Enable/disable the drop handler
  if (prevOpen && !isOpen) {
    enableDropHandler(true);
    //console.log('enable drop');
  } else if (!prevOpen && isOpen) {
    //console.log('disable drop');
    enableDropHandler(false);
  }

  React.useEffect(() => {
    if (isOpen && !prevOpen) {
      // Reset here
      setTabValue(0);
      setSubmitting(false);
      if (onShow) onShow();
    }
  }, [isOpen, prevOpen, setTabValue, onShow]);

  const checkScroll = React.useCallback(() => {
    const el = contentRef.current;
    if (!el) return;
    setHasMoreBelow(el.scrollHeight - el.scrollTop - el.clientHeight > 8);
  }, []);

  // Re-check whenever the dialog opens, the active tab's content changes
  // (switching tabs swaps tabPanels), or fullScreen flips (resizing the
  // window across the breakpoint changes DialogContent's height)
  React.useEffect(() => {
    // Deferred so layout has settled after the tab panel swap / resize
    const id = setTimeout(checkScroll, 50);
    return () => clearTimeout(id);
  }, [isOpen, tabValue, tabPanels, fullScreen, checkScroll]);

  // Also re-check on any window resize while open (e.g. resizing within
  // fullscreen mode, without crossing the breakpoint that flips fullScreen)
  React.useEffect(() => {
    if (!isOpen) return;
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [isOpen, checkScroll]);

  const mwidth =
    maxWidth === false ? {} :
      { "maxWidth": maxWidth ? maxWidth : "md" }

  const onOkHandler = () => {
    if (submitting) return;
    if (onOk && onOk()) {
      setSubmitting(true);
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
        onSubmit={(event) => {
          if (onSubmit) onSubmit(event);
          event.preventDefault();
        }}
        {...mwidth}
        {...other}
      >
        <DialogTitle>{title}</DialogTitle>
        <Box sx={{ position: 'relative', flex: '1 1 auto', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <DialogContent
            ref={contentRef}
            onScroll={checkScroll}
            sx={{
              flex: '1 1 auto',
              minHeight: 0,
              height: fullScreen ? undefined : (height ? height : 520),
              borderBottom: 1,
              borderColor: 'divider',
              pt: 0,
            }}
          >
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={(e, value) => { setTabValue(value) }}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                sx={{ display: tabs.length === 1 ? 'none' : undefined }}
              >
                {tabs}
              </Tabs>
            </Box>
            {tabPanels}
          </DialogContent>
          {hasMoreBelow && (
            <Box
              onClick={() => {
                const el = contentRef.current;
                if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
              }}
              sx={{
                position: 'absolute',
                bottom: 0,
                left: '50%',
                transform: 'translate(-50%, 50%)',
                width: 24,
                height: 24,
                borderRadius: '50%',
                bgcolor: 'rgb(80, 80, 80)',
                border: 1,
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <KeyboardArrowDownIcon fontSize="small" sx={{ color: 'grey.500' }} />
            </Box>
          )}
        </Box>
        <DialogActions>
        {
            closeButton ?
              <Button onClick={onOkHandler}>
                  Close
              </Button> :
              <>
                <Button onClick={onOkHandler} disabled={okDisabled || submitting}>
                  {okTitle ? okTitle : "OK"}
                </Button>
                <Button onClick={() => { setOpen(false) }}>
                  Cancel
                </Button>
              </>
          }
        </DialogActions>
      </Dialog>
    </div>
  );
}
