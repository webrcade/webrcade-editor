import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';

import {
  applyIosNavBarHack,
  removeIosNavBarHack,
  AppProps,
  AppScreen,  
  Feed as CommonFeed,
  config,
  APP_FRAME_ID,
  LOG
} from '@webrcade/app-common'

import { Global, GlobalHolder } from './Global';
import { dropHandler } from './UrlProcessor';
import * as Feed from './Feed';
import * as Util from './Util';
import BusyScreen from './components/BusyScreen';
import Dialogs from './components/Screens';
import EditorDrawer from './components/EditorDrawer';
import FeedTabs from './components/FeedTabs';
import GameRegistry from './GameRegistry';
import MainAppBar from './components/MainAppBar';
import Prefs from './Prefs';
import SelectedFeed from './components/SelectedFeed';

const HASH_PLAY = "play";
const drawerWidth = 190;

let currentApp = null;
let popstateListener = null;
let messageListener = null;

function ignore(event) { event.preventDefault(); }

const createPopstateHandler = () => {
  return (e) => {
    if (currentApp) {
      const iframe = document.getElementById(APP_FRAME_ID);
      if (iframe) {
        try {
          const content = iframe.contentWindow;
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
  const [editorHidden, setEditorHidden] = React.useState(false);
  const [started, setStarted] = React.useState(false);
  const previousApp = Util.usePrevious(app);

  if (previousApp && !app) {
    document.body.style.removeProperty('overflow');
    removeIosNavBarHack();
  }

  if (app && !previousApp) {
    setTimeout(() => {
      document.body.style.overflow = 'hidden';
    }, 0);
    applyIosNavBarHack();
  }

  currentApp = app;

  React.useEffect(() => {
    console.log("Application was loaded");
    Global.openBusyScreen(true, "Preparing editor...");

    document.addEventListener("drop", dropHandler);
    document.addEventListener("dragenter", ignore);
    document.addEventListener("dragover", ignore);    
    
    popstateListener = createPopstateHandler();
    window.addEventListener("popstate", popstateListener, false);
    messageListener = createMessageListener(setApp);
    window.addEventListener("message", messageListener);

    // Clear hash if an app is not loaded
    const hash = window.location.href.indexOf('#');

    if (!app && hash >= 0) {
      window.history.pushState(null, "", window.location.href.substring(0, hash));
    }

    // Load prefs
    Prefs.load()
      .then(() => GameRegistry.init()) // Init the game registry
      .then(() => {
        const feed = Prefs.getFeed() 
        if (feed) {
          // return feed from prefs
          const feedObj = new CommonFeed(feed, 0, false);
          const result = feedObj.getClonedFeed();
          // Add ids?
          return result;
        } else {
          // load default feed (if applicable)
          return config.isPublicServer() ?                    
            Feed.loadFeedFromUrl(Feed.getDefaultFeedUrl()) :
            Feed.newFeed();
        }        
      })
      .then((feed) => {
        setFeed(feed);
      })
      .catch(e => {
        LOG.error("Error during startup: " + e);
      })
      .finally(() => {
        // Mark as started
        setStarted(true);

        Global.openBusyScreen(false);
      })    
    
    return () => {
      console.log("Application was unloaded");

      document.removeEventListener("drop", dropHandler);
      document.removeEventListener("dragenter", ignore);
      document.removeEventListener("dragover", ignore);       

      window.removeEventListener("popstate", popstateListener, false);    
      window.removeEventListener("message", messageListener);  
    }
    // eslint-disable-next-line    
  }, []);


  GlobalHolder.setApp = (app) => {
    window.location.hash = HASH_PLAY;
    setEditorHidden(true);
    setApp(app);
  }
  GlobalHolder.setFeed = setFeed;
  GlobalHolder.getFeed = () => {
    return feed;
  }

  return (
    <>
      <CssBaseline />
      <BusyScreen />
      {started ? (
        <>
          <Box 
            sx={{ 
              display: app || editorHidden ? 'none' : 'flex'              
            }}
          >
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
              feedProps={feed.props ? feed.props : {}}
              context={AppProps.RV_CONTEXT_EDITOR}
              exitCallback={() => {
                setEditorHidden(false);
              }}        
            />
          ) : null}
        </>
      ) : null}
    </>
  );
}

export default App;