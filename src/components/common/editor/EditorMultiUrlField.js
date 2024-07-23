import * as React from 'react';
import EditorUrlField from './EditorUrlField';


import {
  uuidv4,
} from '@webrcade/app-common'

export default function EditorMultiUrlField(props) {
  const [uuid, setUuid] = React.useState(uuidv4());

  const {
    sx,
    rows,
    onDropText,
    onChange,
    ...other
  } = props;

  const updateUrls = (urls) => {
    if (urls && !Array.isArray(urls) && urls.toLowerCase().indexOf("drive.google.com") !== -1) {
      const driveUrls = urls.split(",");
      if (driveUrls.length > 1) {
        urls = "";
        for (let i = 0; i < driveUrls.length; i++) {
          if (urls.length > 0) urls += "\n";
          urls += driveUrls[i].trim();
        }
      }
    }
    return urls;
  }

  return (
    <EditorUrlField
      key={uuid}
      onDropText={(text) => {
        if (onDropText) {
           onDropText(updateUrls(text))
           setUuid(uuidv4());
        }
      }}
      onChange={(e) => {if (onChange) {
        const urls = updateUrls(e.target.value);
        onChange({
          // TODO: Hack, find a better way...
          target: {
            value: urls
          }
        })
      }}}
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
