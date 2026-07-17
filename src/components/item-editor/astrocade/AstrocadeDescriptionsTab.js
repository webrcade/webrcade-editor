import * as React from 'react';
import Box from '@mui/material/Box';

import * as Util from '../../../Util';
import EditorTabPanel from '../../common/editor/EditorTabPanel';
import EditorTextField from '../../common/editor/EditorTextField';

function KeypadField(props) {
  const {
    label,
    keyName,
    object,
    setObject
  } = props;

  let val = "";
  if (object.props.descriptions) {
    val = object.props.descriptions[keyName];
    if (!val) {
      val = "";
    }
  }

  const setValue = (str) => {
    let descs = object.props.descriptions;
    if (!descs) {
      descs = {}
    }

    if (Util.isEmptyString(str)) {
      delete descs[keyName];
    } else {
      descs[keyName] = str;
    }

    const props = { ...object.props, descriptions: descs }
    setObject({ ...object, props })
  };

  return (
    <div>
      <EditorTextField
        sx={{ width: '30ch' }}
        label={label}
        onDropText={(text) => { setValue(text); }}
        onChange={(e) => { setValue(e.target.value); }}
        value={Util.asString(val)}
      />
    </div>
  );
}

export default function AstrocadeDescriptionsTab(props) {
  const {
    tabValue,
    tabIndex,
    setObject,
    object
  } = props;

  return (
    <EditorTabPanel value={tabValue} index={tabIndex}>
      <Box sx={{m: 1.5}}>
        Provide game-specific descriptions for the Bally Astrocade keypad keys and buttons.
      </Box>
      <KeypadField label="Fire" keyName="fire" object={object} setObject={setObject} />
      <KeypadField label="Key 0" keyName="0" object={object} setObject={setObject} />
      <KeypadField label="Key 1" keyName="1" object={object} setObject={setObject} />
      <KeypadField label="Key 2" keyName="2" object={object} setObject={setObject} />
      <KeypadField label="Key 3" keyName="3" object={object} setObject={setObject} />
      <KeypadField label="Key 4" keyName="4" object={object} setObject={setObject} />
      <KeypadField label="Key 5" keyName="5" object={object} setObject={setObject} />
      <KeypadField label="Key 6" keyName="6" object={object} setObject={setObject} />
      <KeypadField label="Key 7" keyName="7" object={object} setObject={setObject} />
      <KeypadField label="Key 8" keyName="8" object={object} setObject={setObject} />
      <KeypadField label="Key 9" keyName="9" object={object} setObject={setObject} />
      <KeypadField label="Key +" keyName="+" object={object} setObject={setObject} />
      <KeypadField label="Key -" keyName="-" object={object} setObject={setObject} />
      <KeypadField label="Key ×" keyName="×" object={object} setObject={setObject} />
      <KeypadField label="Key /" keyName="/" object={object} setObject={setObject} />
      <KeypadField label="Key =" keyName="=" object={object} setObject={setObject} />
      <KeypadField label="Key %" keyName="%" object={object} setObject={setObject} />
      <KeypadField label="Key ." keyName="." object={object} setObject={setObject} />
      <KeypadField label="Key C" keyName="C" object={object} setObject={setObject} />
      <KeypadField label="Key CE" keyName="CE" object={object} setObject={setObject} />
      <KeypadField label="Key ↑" keyName="↑" object={object} setObject={setObject} />
      <KeypadField label="Key ↓" keyName="↓" object={object} setObject={setObject} />
      <KeypadField label="Key MR" keyName="MR" object={object} setObject={setObject} />
      <KeypadField label="Key MS" keyName="MS" object={object} setObject={setObject} />
      <KeypadField label="Key CH" keyName="CH" object={object} setObject={setObject} />
    </EditorTabPanel>
  );
}
