import * as React from 'react';
import Box from '@mui/material/Box';

import EditorTabPanel from '../../common/editor/EditorTabPanel';
import EditorSelect from '../../common/editor/EditorSelect';
import { OPTIONS } from './Apple2MappingOptions';

// Buttons where "(none)" has an explicit default to fall back to (normal
// joystick movement) rather than simply being unmapped. For these, "(none)"
// must be stored explicitly rather than by deleting the key, so that
// "user chose to disable this" can be told apart from "never configured"
// (which keeps applying the default).
const EXPLICIT_NONE_BUTTONS = ["up", "down", "left", "right"];

function MappingField(props) {
  const {
    label,
    buttonName,
    object,
    setObject,
    defaultValue
  } = props;

  const NONE = "none";

  let value = object.props.mappings ? object.props.mappings[buttonName] : undefined;
  if (!value) {
    value = defaultValue || NONE;
  }

  const setValue = (str) => {
    let mappings = object.props.mappings;
    if (!mappings) {
      mappings = {};
    }

    if (str === NONE && EXPLICIT_NONE_BUTTONS.includes(buttonName)) {
      mappings[buttonName] = NONE;
    } else if (str === NONE) {
      delete mappings[buttonName];
    } else {
      mappings[buttonName] = str;
    }

    const props = { ...object.props, mappings: mappings };
    setObject({ ...object, props });
  };

  const menuItems = [];
  menuItems.push({ value: NONE, name: "(none)" });

  for (let i = 0; i < OPTIONS.length; i++) {
    const opt = OPTIONS[i];
    menuItems.push({ value: opt.value, name: opt.label });
  }

  let found = false;
  for (let i = 0; i < menuItems.length; i++) {
    if (menuItems[i].value === value) { found = true; break; }
  }
  if (!found) value = NONE;

  return (
    <div>
      <EditorSelect
        label={label}
        value={value}
        menuItems={menuItems}
        onChange={(e) => { setValue(e.target.value); }}
      />
    </div>
  );
}

export default function Apple2MappingsTab(props) {
  const {
    tabValue,
    tabIndex,
    setObject,
    object
  } = props;

  return (
    <EditorTabPanel value={tabValue} index={tabIndex}>
      <Box sx={{ m: 1.5 }}>
        Create game-specific mappings from Apple II keys and buttons to the gamepad.
      </Box>
      <MappingField label="Start"         buttonName="start" object={object} setObject={setObject} />
      <MappingField label="A button"      buttonName="a"     object={object} setObject={setObject} />
      <MappingField label="B button"      buttonName="b"     object={object} setObject={setObject} />
      <MappingField label="X button"      buttonName="x"     object={object} setObject={setObject} />
      <MappingField label="Y button"      buttonName="y"     object={object} setObject={setObject} />
      <MappingField label="Left bumper"   buttonName="lb"    object={object} setObject={setObject} />
      <MappingField label="Right bumper"  buttonName="rb"    object={object} setObject={setObject} />
      <MappingField label="Left trigger"  buttonName="lt"    object={object} setObject={setObject} />
      <MappingField label="Right trigger" buttonName="rt"    object={object} setObject={setObject} />
      <MappingField label="D-pad up"      buttonName="up"    object={object} setObject={setObject} defaultValue="moveup" />
      <MappingField label="D-pad down"    buttonName="down"  object={object} setObject={setObject} defaultValue="movedown" />
      <MappingField label="D-pad left"    buttonName="left"  object={object} setObject={setObject} defaultValue="moveleft" />
      <MappingField label="D-pad right"   buttonName="right" object={object} setObject={setObject} defaultValue="moveright" />
    </EditorTabPanel>
  );
}
