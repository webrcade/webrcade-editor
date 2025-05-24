import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';

import {
  applyIosNavBarHack,
  dropbox,
  isDev,
  removeIosNavBarHack,
  storagePersist,
  settings,
  AppProps,
  AppRegistry,
  AppScreen,
  Feed as CommonFeed,
  config,
  APP_FRAME_ID,
  LOG,
  isLocalhostOrHttps
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
import { buildFieldMap } from './components/item-editor/PropertiesTab';

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

let popstateGlobal = null;

const createMessageListener = (setApp) => {
  return (e) => {
    if (e.data === 'exitComplete') {
      setApp(null);
    }
    if (e.data === 'appExiting') {
      if (popstateGlobal) {
        popstateGlobal();
      }
    }
  }
};

function App(props) {
  const [feed, setFeed] = React.useState({});
  const [app, setApp] = React.useState(null);
  const [editorHidden, setEditorHidden] = React.useState(false);
  const [started, setStarted] = React.useState(false);
  const previousApp = Util.usePrevious(app);
  const forceRefresh = Util.useForceUpdate();

  GlobalHolder.forceRefresh = forceRefresh;

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
    AppRegistry.instance.setAllowMultiThreaded(true);

    // Ask for long term storage
    storagePersist();

    console.log("Application was loaded");
    Global.openBusyScreen(true, "Preparing editor...", true);

    document.addEventListener("drop", dropHandler);
    document.addEventListener("dragenter", ignore);
    document.addEventListener("dragover", ignore);

    popstateListener = createPopstateHandler();
    popstateGlobal = popstateListener;
    window.addEventListener("popstate", popstateListener, false);
    messageListener = createMessageListener(setApp);
    window.addEventListener("message", messageListener);

    // Clear hash if an app is not loaded
    const hash = window.location.href.indexOf('#');

    if (!app && hash >= 0) {
      window.history.pushState(null, "", window.location.href.substring(0, hash));
    }

    // Load settings
    settings.load().finally(() => {
      dropbox.checkLinkResult()
        .catch(e => { Global.displayMessage(e, "error") })
        .finally(() => {
          // TODO: Hack for now. We need to build the field map after settings are
          // loaded. Maybe better to have an event sent when settings change, etc.
          // so that various components can react without direct bindings.
          buildFieldMap();

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
              setFeed(Feed.newFeed()); // Set a new feed
            })
            .finally(() => {
              // Mark as started
              setStarted(true);

              Global.openBusyScreen(false);
            })
        })
    });

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
    const context = AppProps.RV_CONTEXT_EDITOR;
    const reg = AppRegistry.instance;
    let location = reg.getLocation(app, context, feed.props);
    if (!isDev() && context && context === AppProps.RV_CONTEXT_EDITOR) {
      location = "../../" + location;
    }
    if (reg.isMultiThreaded(app.type)) {
      if (!isLocalhostOrHttps()) {
        Global.displayMessage(`The ${reg.getName(app)} application requires HTTPS and the proper headers.`);
        return;
      }
      // multi-threaded
      window.open(location, "_blank");
    } else {
      window.location.hash = HASH_PLAY;
      setEditorHidden(true);
      setApp(app);
    }
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
            <Box sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
              <EditorDrawer drawerWidth={drawerWidth} />
            </Box>
            <Box sx={{
              flexGrow: 1, p: 3,
              width: { xs: '100%', sm: '100%', md: `calc(100% - ${drawerWidth}px)` }
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