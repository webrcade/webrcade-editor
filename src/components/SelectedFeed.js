import Box from '@mui/material/Box';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import * as WrcCommon from '@webrcade/app-common'

import { Global } from '../Global';
import CommonImage from './common/CommonImage'

function SelectedFeed(props) {
  const { feed } = props;
  return (
    <Paper variant="outlined" sx={{ mb: 2 }}>
      <Box>
        <Toolbar>
          <CommonImage
            imageSrc={feed.thumbnail}
            defaultImageSrc={WrcCommon.FeedThumbImage}
            requiredAspectRatio={Global.getThumbAspectRatio()}
            sx={{ mr: 2, width: 48, height: 36 }}
          />
          <Typography variant="h8" noWrap component="div">
            {feed.title}
          </Typography>
          <Tooltip title="Edit">
            <IconButton sx={{ ml: 1 }}
              onClick={(e) => {
                e.stopPropagation();
                Global.editFeed(Global.getFeed());
              }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </Box>
    </Paper>
  );
}

export default SelectedFeed;
