import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import * as WrcCommon from '@webrcade/app-common'
import { Global } from '../Global';

function MainAppBar(props) {
  const StyledAppBar = styled(AppBar)(({ theme }) => ({
    zIndex: theme.zIndex.drawer + 1
  }));

  return (
    <StyledAppBar position="fixed">
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={Global.toggleDrawer}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Avatar
          sx={{ mr: 1.3, width: 32, height: 32 }}
          variant="square"
          src={WrcCommon.WebrcadeLogoDarkImage}
        />
        <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
          webЯcade Feed Editor
        </Typography>
        <Tooltip title="Settings">
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => { Global.openSettingsEditor(true); }}
            sx={{ ml: 2 }}
          >
            <SettingsIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Help">
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => { window.open('https://docs.webrcade.com/editor/'); }}
            sx={{ ml: .5 }}
          >
            <HelpCenterIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </StyledAppBar>
  );
}

export default MainAppBar;