import TextField from '@mui/material/TextField';

import { dropHandler } from '../../../Drop';

export default function ItemTextField(props) {
  const {
    sx,
    onDropText,
    ...other
  } = props;

  return (
    <TextField
      onDrop={(e) => {
        if (onDropText) {
          e.preventDefault();
          dropHandler(e, (text) => { onDropText(text); });
        }
      }}
      sx={{
        m: 1.5,
        width: '35ch',
        ...sx
      }}
      {...other}
    />
  );
}
