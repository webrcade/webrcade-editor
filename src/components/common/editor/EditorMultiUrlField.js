import EditorUrlField from './EditorUrlField';


export default function EditorMultiUrlField(props) {
  const {
    sx,
    rows,
    ...other
  } = props;

  return (
    <EditorUrlField
      multiselect={true}
      multiline
      rows={rows ? rows : 5}
      sx={{
        width: '50ch',
        ...sx
      }}      
      inputProps={{ ref: input => { if (input) { input.style['white-space'] = 'nowrap' } } }}
      {...other}
    />
  );
}
