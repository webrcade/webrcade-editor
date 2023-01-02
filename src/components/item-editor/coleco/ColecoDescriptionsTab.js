import * as React from 'react';

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

export default function ColecoDescriptionsTab(props) {
  const {
    tabValue,
    tabIndex,
    setObject,
    object
  } = props;

  return (
    <EditorTabPanel value={tabValue} index={tabIndex}>
        <KeypadField label="Keypad 1" keyName="1" object={object} setObject={setObject} />
        <KeypadField label="Keypad 2" keyName="2" object={object} setObject={setObject} />
        <KeypadField label="Keypad 3" keyName="3" object={object} setObject={setObject} />
        <KeypadField label="Keypad 4" keyName="4" object={object} setObject={setObject} />
        <KeypadField label="Keypad 5" keyName="5" object={object} setObject={setObject} />
        <KeypadField label="Keypad 6" keyName="6" object={object} setObject={setObject} />
        <KeypadField label="Keypad 7" keyName="7" object={object} setObject={setObject} />
        <KeypadField label="Keypad 8" keyName="8" object={object} setObject={setObject} />
        <KeypadField label="Keypad 9" keyName="9" object={object} setObject={setObject} />
        <KeypadField label="Keypad *" keyName="*" object={object} setObject={setObject} />
        <KeypadField label="Keypad 0" keyName="0" object={object} setObject={setObject} />
        <KeypadField label="Keypad #" keyName="#" object={object} setObject={setObject} />
        <KeypadField label="Left Fire" keyName="firel" object={object} setObject={setObject} />
        <KeypadField label="Right Fire" keyName="firer" object={object} setObject={setObject} />
    </EditorTabPanel>
  );
}
