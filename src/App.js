import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';

import { GlobalHolder } from './Global';
import Dialogs from './components/Screens';
import EditorDrawer from './components/EditorDrawer';
import FeedTabs from './components/FeedTabs';
import MainAppBar from './components/MainAppBar';
import SelectedFeed from './components/SelectedFeed';

const drawerWidth = 190;

function App(props) {  
  // const [feed, setFeed] = React.useState({
  //   title: "New feed",
  //   categories: [{
  //     title: "Example category",
  //     items: [{
  //       title: "Freedoom II",
  //       type: "doom",
  //       "props": {
  //         "game": "freedoom2"
  //       }        
  //     }]
  //   }]        
  // });  

  const [feed, setFeed] = React.useState({});
  
  React.useEffect(() => {
    //alert('Application was loaded!');
  }, []);

  GlobalHolder.setFeed = setFeed;
  
  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <MainAppBar/>
        <Box sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
          <EditorDrawer drawerWidth={drawerWidth} />
        </Box>
        <Box sx={{ 
          flexGrow: 1, p: 3, 
          width: { xs: '100%', sm: `calc(100% - ${drawerWidth}px)` } }}
        >
          <Toolbar />
          <SelectedFeed feed={feed}/>
          <FeedTabs feed={feed} />
        </Box>
      </Box>            
      <Dialogs />
    </>
  );
}

export default App;