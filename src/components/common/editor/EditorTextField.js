import TextField from '@mui/material/TextField';

import {
  isValidString
} from '@webrcade/app-common'


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
          const text = e.dataTransfer.getData("text")
          if (isValidString(text)) {
            onDropText(text);
          }
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
