import * as React from 'react';
import Box from '@mui/material/Box';

import EditorTabPanel from '../../common/editor/EditorTabPanel';
import EditorSelect from '../../common/editor/EditorSelect';
import { OPTIONS } from './C64MappingOptions';

function MappingField(props) {
  const {
    label,
    buttonName,
    object,
    setObject
  } = props;

  const NONE = "none";

  let value = NONE;
  if (object.props.mappings) {
    value = object.props.mappings[buttonName];
    if (!value) {
      value = NONE;
    }
  }

  const setValue = (str) => {
    let mappings = object.props.mappings;
    if (!mappings) {
      mappings = {}
    }

    if (str === NONE) {
      delete mappings[buttonName];
    } else {
      mappings[buttonName] = str;
    }

    const props = { ...object.props, mappings: mappings }
    setObject({ ...object, props })
  };

  const menuItems = [];
  menuItems.push({value: NONE, name: "(none)"});

  for (let i = 0; i < OPTIONS.length; i++) {
    const opt = OPTIONS[i];
    menuItems.push({value: opt.value, name: opt.label});
  }

  // Ensure value is in values
  let found = false;
  for (let i = 0; i < menuItems.length; i++) {
    const item = menuItems[i];
    if (item.value === value) {
      found = true;
      break;
    }
  }

  if (!found) {
    value = NONE;
  }

  return (
    <div>
      <EditorSelect
        label={label}
        value={value}
        menuItems={menuItems}
        onChange={(e) => { setValue(e.target.value) }}
      />
    </div>
  );
}

export default function C64MappingsTab(props) {
  const {
    tabValue,
    tabIndex,
    setObject,
    object
  } = props;

  return (
    <EditorTabPanel value={tabValue} index={tabIndex}>
      <Box sx={{m: 1.5}}>
        Create game-specific mappings from the Commodore keys and joystick to the gamepad.
      </Box>
      <MappingField label="Start" buttonName="start" object={object} setObject={setObject} />
      {/* <MappingField label="Left" buttonName="left" object={object} setObject={setObject} />
      <MappingField label="Right" buttonName="right" object={object} setObject={setObject} />
      <MappingField label="Up" buttonName="up" object={object} setObject={setObject} />
      <MappingField label="Down" buttonName="down" object={object} setObject={setObject} /> */}
      <MappingField label="A button" buttonName="a" object={object} setObject={setObject} />
      <MappingField label="B button" buttonName="b" object={object} setObject={setObject} />
      <MappingField label="X button" buttonName="x" object={object} setObject={setObject} />
      <MappingField label="Y button" buttonName="y" object={object} setObject={setObject} />
      <MappingField label="Left bumper" buttonName="lb" object={object} setObject={setObject} />
      <MappingField label="Right bumper" buttonName="rb" object={object} setObject={setObject} />
      <MappingField label="Left trigger" buttonName="lt" object={object} setObject={setObject} />
      <MappingField label="Right trigger" buttonName="rt" object={object} setObject={setObject} />
      <MappingField label="Right analog left" buttonName="ra-left" object={object} setObject={setObject} />
      <MappingField label="Right analog right" buttonName="ra-right" object={object} setObject={setObject} />
      <MappingField label="Right analog up" buttonName="ra-up" object={object} setObject={setObject} />
      <MappingField label="Right analog down" buttonName="ra-down" object={object} setObject={setObject} />
    </EditorTabPanel>
  );
}
