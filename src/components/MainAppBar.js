import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
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
          sx={{ mr: 1.3, width: 32, height:32 }} 
          variant="square"
          src={WrcCommon.WebrcadeLogoDarkImage}           
        />
        <Typography variant="h6" noWrap>
          webЯcade Feed Editor
          </Typography>
      </Toolbar>
    </StyledAppBar>
  );
}

export default MainAppBar;