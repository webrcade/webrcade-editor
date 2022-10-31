import * as React from 'react';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';

import CommonTooltip from '../CommonTooltip';

export default function EditorSelect(props) {
  const {
    label,
    menuItems,
    value,
    sx,
    onChange,
    tooltip,
    children,
    ...other
  } = props;

  const selectControl = (
    <FormControl variant="standard" sx={{ m: 1.5, minWidth: 200 }}>
      <InputLabel>{label}</InputLabel>
      <Select
        autoWidth
        value={value}
        onChange={onChange}
        label={label}
      >
        {menuItems ?
          menuItems.map(menuItem => {
            return (
              <MenuItem key={menuItem.value} value={menuItem.value}>{menuItem.name}</MenuItem>
            )
          }) : null
        }
        {children}
      </Select>
    </FormControl>
  );

  return (
    <Box
      sx={{
        ...sx
      }}
      {...other}
    >
      {tooltip !== undefined && tooltip.length > 0 ? (
        <CommonTooltip
          title={tooltip}
        >
          {selectControl}
        </CommonTooltip>
      ) : (
        <>
          {selectControl}
        </>
      )}
    </Box>
  );
}

