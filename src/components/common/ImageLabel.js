import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

export default function ImageLabel(props) {
  const { label, imageSrc } = props;

  return (
    <Stack direction="row" sx={{ marginTop: 1.5, marginBottom: 1.5 }}>
      <Avatar variant="rounded" sx={{ mr: 1.6, width: 48, height: 36 }} src={imageSrc}>&nbsp;</Avatar>
      <Box component="div" sx={{
        justifyContent: "center",
        display: "flex",
        flexDirection: "column"
      }}>{label}</Box>
    </Stack>
  );
}