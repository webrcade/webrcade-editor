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

          for (let i = 0; i < e.dataTransfer.items.length; i++) {
            const item = e.dataTransfer.items[i];
            if (item.kind === 'string' &&
              (item.type.match('^text/uri-list') || item.type.match('^text/plain'))) {
              item.getAsString((text) => {
                if (isValidString(text)) {
                  onDropText(text);
                }
              });
            }
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
