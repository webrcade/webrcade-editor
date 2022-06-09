import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const DEFAULT_VALUE = ["0", "1", "2", "3"];

const validate = (values) => {
  if (!values) return false;

  const vals = values.split(":");
  if (vals.length !== 4) return false;

  return DEFAULT_VALUE.every(v => vals.includes(v));
}

function PlayerSelect(props) {
  const { player, value, onChange } = props

  return (
    <Select
      value={value}
      onChange={onChange}
      variant="standard"
      name={player}
    >
      <MenuItem value="0">Player 1</MenuItem>
      <MenuItem value="1">Player 2</MenuItem>
      <MenuItem value="2">Player 3</MenuItem>
      <MenuItem value="3">Player 4</MenuItem>
    </Select>
  );
}

export default function SelectPlayerOrder(props) {
  const { value, onChange } = props;

  let values = [...DEFAULT_VALUE];
  if (validate(value)) {
    values = value.split(":");
  }

  const handleChange = (e) => {

    const target = parseInt(e.target.name);
    const value = e.target.value;

    for (let i = 0; i < values.length; i++) {
      if (values[i] === value) {
        values[i] = values[target];
        values[target] = value;
      }
    }

    if (onChange) onChange(values.join(":"));
  };

  return (
    <>
      <Typography sx={{ ml: 1.5, mt: .5, mb: 1 }}>
        Player Order
      </Typography>
      <Stack
        spacing={3}
        direction="row"
        sx={{ width: '50ch', ml: 1.5, mb: .5 }}
      >
        <PlayerSelect player="0" value={values[0]} onChange={handleChange} />
        <PlayerSelect player="1" value={values[1]} onChange={handleChange} />
        <PlayerSelect player="2" value={values[2]} onChange={handleChange} />
        <PlayerSelect player="3" value={values[3]} onChange={handleChange} />
      </Stack>
    </>
  );
}