import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

function SelectedFeed(props) {
  const {feed} = props;
  return (
    <Paper variant="outlined" sx={{ mb: 2 }}>
      <Box>
        <Toolbar>
          <Avatar variant="rounded" sx={{ mr: 2, width: 48, height: 36 }} src={feed.thumbnail}>&nbsp;</Avatar>
          <Typography variant="h8" noWrap component="div">
            {feed.title}
          </Typography>
          <Tooltip title="Edit">
            <IconButton sx={{ ml: 1 }}>
              <EditIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </Box>
    </Paper>
  );
}

export default SelectedFeed;
