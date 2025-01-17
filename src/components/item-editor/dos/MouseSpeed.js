import * as React from 'react';

import Box from '@mui/material/Box'
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const UNSET_TEMP = -9999;

export default function MouseSpeed(props) {
  const { value, onChange, onChangeCommitted } = props;
  // Allows for smoother updated prior to change being committed
  const [tempValue, setTempValue] = React.useState(UNSET_TEMP);

  return (
    <>
      <Typography sx={{ ml: 1.5, mt: 1.5 }} id="input-slider" gutterBottom>
        Mouse speed
      </Typography>
      <Stack
        spacing={2}
        direction="row"
        sx={{ width: '50ch', maxWidth: '100%', ml: 1.5, mb: .5 }}
      >
        {/* <VolumeDown /> */}
        {/* <Box>Slower</Box> */}
        <Box sx={{ width: '100%' }}>
          <Slider
            valueLabelDisplay="auto"
            min={-5} max={5} step={1}
            marks={[{ value: 0, label: 'Default' }]}
            value={tempValue !== UNSET_TEMP ? tempValue : value}
            onChange={(e, val) => {onChange(e, val); setTempValue(val)}}
            onChangeCommitted={(e, val) => {onChangeCommitted(e, val); setTempValue(UNSET_TEMP)}}
          />
        </Box>
        {/* <Box>Faster</Box> */}
        {/* <VolumeUp /> */}
      </Stack>
    </>
  );
}