import * as React from 'react';
import EditorUrlField from './EditorUrlField';


import {
  uuidv4,
} from '@webrcade/app-common'

export default function EditorMultiUrlField(props) {
  const [uuid, setUuid] = React.useState(uuidv4());
  // Lifted out of EditorUrlField so the Raw/Simplified toggle and the full-URL
  // display toggle survive the uuid-based remount below (that remount exists
  // to reset the raw textarea's uncontrolled state after a drop, not to reset
  // UI mode/preferences).
  const [mode, setMode] = React.useState('simplified');
  const [showFullUrl, setShowFullUrl] = React.useState(true);

  const {
    sx,
    rows,
    onDropText,
    onChange,
    onFileUpload,
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
      mode={mode}
      onModeChange={setMode}
      showFullUrl={showFullUrl}
      onShowFullUrlChange={setShowFullUrl}
      onDropText={(text) => {
        if (onDropText) {
           onDropText(updateUrls(text))
           setUuid(uuidv4());
        }
      }}
      onFileUpload={onFileUpload}
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
        // react-textarea-autosize (used internally by MUI's multiline
        // TextField) sets its own inline `overflow` style, which beats a
        // plain sx rule — !important in a stylesheet rule is the one thing
        // that still wins over an inline style.
        '& textarea': { whiteSpace: 'nowrap', overflowX: 'auto !important' },
        ...sx
      }}
      {...other}
    />
  );
}
