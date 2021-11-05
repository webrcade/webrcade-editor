import Box from '@mui/material/Box';

export default function EditorTabPanel(props) {
  const { children, value, index } = props;
  return (
    <div hidden={value !== index}>
      <Box sx={{ pt: 2 }} component="form" noValidate autoComplete="off">
        {children}
      </Box>
    </div>
  );
}
