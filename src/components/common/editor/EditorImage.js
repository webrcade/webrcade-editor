import Avatar from '@mui/material/Avatar';

export default function EditorImage(props) {
  const { sx, ...other } = props;
  return (
    <Avatar
      variant="rounded"
      sx={{
        m: 1.5, 
        width: 400, 
        height: 300,
        backgroundColor: 'transparent',
        ...sx
      }}
      {...other}
    >
      &nbsp;
    </Avatar>
  );
}
