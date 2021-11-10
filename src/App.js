import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';

import { 
  AppProps,
  AppScreen, 
  LOG 
} from '@webrcade/app-common'

import { GlobalHolder } from './Global';
import * as Feed from './Feed';
import Dialogs from './components/Screens';
import EditorDrawer from './components/EditorDrawer';
import FeedTabs from './components/FeedTabs';
import MainAppBar from './components/MainAppBar';
import SelectedFeed from './components/SelectedFeed';

const HASH_PLAY = "play";
const drawerWidth = 190;

let currentApp = null;

const createPopstateHandler = (frameRef) => {
  return (e) => {
    if (currentApp) {
      if (frameRef.current) {
        try {
          const content = frameRef.current.contentWindow;
          if (content) {
            content.postMessage("exit", "*");
          }
        } catch (e) {
          LOG.error(e);
        }
      }
    }
  }
}

const createMessageListener = (setApp) => {
  return (e) => {
    if (e.data === 'exitComplete') {
      setApp(null);
    }
  }
};

function App(props) {
  const [feed, setFeed] = React.useState({});
  const [app, setApp] = React.useState(null);
  const appScreenFrameRef = React.useRef();

  currentApp = app;

  React.useEffect(() => {
    console.log("Application was loaded");
    window.addEventListener("popstate",
      createPopstateHandler(appScreenFrameRef), false);
    window.addEventListener("message",
      createMessageListener(setApp));

    // Clear hash if an app is not loaded
    const hash = window.location.href.indexOf('#');

    if (!app && hash >= 0) {
      window.history.pushState(null, "", window.location.href.substring(0, hash));
    }

    // For now set to example, ultimately will come from preferences
    setFeed(Feed.exampleFeed());
  // eslint-disable-next-line    
  }, []);


  GlobalHolder.setApp = (app) => {
    window.location.hash = HASH_PLAY;
    setApp(app);
  }  
  GlobalHolder.setFeed = setFeed;
  GlobalHolder.getFeed = () => {
    return feed;
  }

  return (
    <>
      <Box sx={{ display: app ? 'none' : 'flex' }}>
        <CssBaseline />
        <MainAppBar />
        <Box sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
          <EditorDrawer drawerWidth={drawerWidth} />
        </Box>
        <Box sx={{
          flexGrow: 1, p: 3,
          width: { xs: '100%', sm: `calc(100% - ${drawerWidth}px)` }
        }}
        >
          <Toolbar />
          <SelectedFeed feed={feed} />
          <FeedTabs feed={feed} />
        </Box>
      </Box>
      <Dialogs />
      {app ? (
        <AppScreen 
          app={app} 
          frameRef={appScreenFrameRef} 
          context={AppProps.RV_CONTEXT_EDITOR}          
        />
      ) : null
      }
    </>
  );
}

export default App;