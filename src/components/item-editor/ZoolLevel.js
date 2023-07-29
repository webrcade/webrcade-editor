import * as React from 'react';

import Box from '@mui/material/Box'
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// import VolumeDown from '@mui/icons-material/VolumeDown';
// import VolumeUp from '@mui/icons-material/VolumeUp';

const UNSET_TEMP = -9999;

export default function ZoomLevel(props) {
  const { value, onChange, onChangeCommitted } = props;
  // Allows for smoother updated prior to change being committed
  const [tempValue, setTempValue] = React.useState(UNSET_TEMP);

  return (
    <>
      <Typography sx={{ ml: 1.5, mt: 1.5 }} id="input-slider" gutterBottom>
        Zoom Level
      </Typography>
      <Stack
        spacing={2}
        direction="row"
        sx={{ width: '50ch', maxWidth: '100%', ml: 1.5, mb: .5 }}
      >
        {/* <VolumeDown /> */}
        <Box sx={{ width: '100%' }}>
          <Slider
            valueLabelDisplay="auto"
            min={0} max={40} step={1}
            marks={[
                { value: 0, label: '0' },
                { value: 10, label: '10' },
                { value: 20, label: '20' },
                { value: 30, label: '30' },
                { value: 40, label: '40' },
            ]}
            value={tempValue !== UNSET_TEMP ? tempValue : value}
            onChange={(e, val) => {onChange(e, val); setTempValue(val)}}
            onChangeCommitted={(e, val) => {onChangeCommitted(e, val); setTempValue(UNSET_TEMP)}}
          />
        </Box>
        {/* <VolumeUp /> */}
      </Stack>
    </>
  );
}