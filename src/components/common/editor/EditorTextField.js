import TextField from '@mui/material/TextField';

export default function ItemTextField(props) {
  const { 
    sx, 
    ...other 
  } = props;

  return (
    <TextField     
      sx={{
        m: 1.5, 
        width: '35ch',
        ...sx
      }}
      {...other}
    />
  );
}
