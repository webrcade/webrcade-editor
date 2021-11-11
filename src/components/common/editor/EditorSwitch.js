import * as React from 'react';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

import CommonTooltip from '../CommonTooltip';

export default function EditorSwitch(props) {
  const { label, checked, sx, onChange, tooltip, ...other } = props;

  const switchControl = (
    <FormControlLabel control={
      <Switch
        checked={checked}
        onChange={onChange}
      />
    } label={label} />
  );


  return (
    <Box
      sx={{
        m: 1.5,
        ...sx
      }}
      {...other}
    >
      {tooltip !== undefined && tooltip.length > 0 ? (
        <CommonTooltip
          title={tooltip}
        >
          {switchControl}
        </CommonTooltip>
      ) : (
        <>
          {switchControl}
        </>
      )}
    </Box>
  );
}

