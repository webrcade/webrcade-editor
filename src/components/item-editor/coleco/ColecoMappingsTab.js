import * as React from 'react';

import EditorTabPanel from '../../common/editor/EditorTabPanel';
import EditorSelect from '../../common/editor/EditorSelect';

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

  const getName = (key, def) => {
    let name = null;
    if (object.props.descriptions) {
      name = object.props.descriptions[key];
    }
    if (!name) {
      name = def;
    }
    return name;
  }

  // Keypad buttons
  const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"];
  for (let i = 0; i < KEYS.length; i++) {
    const key = KEYS[i];
    menuItems.push({value: key, name: getName(key, "Keypad " + key)});
  }

  // Buttons
  menuItems.push({value: "firel", name: getName("firel", "Left fire")});
  menuItems.push({value: "firer", name: getName("fireR", "Right fire")});

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

export default function ColecoMappingsTab(props) {
  const {
    tabValue,
    tabIndex,
    setObject,
    object
  } = props;

  return (
    <EditorTabPanel value={tabValue} index={tabIndex}>
      <div>
        <MappingField label="A button" buttonName="a" object={object} setObject={setObject} />
        <MappingField label="B button" buttonName="b" object={object} setObject={setObject} />
        <MappingField label="X button" buttonName="x" object={object} setObject={setObject} />
        <MappingField label="Y button" buttonName="y" object={object} setObject={setObject} />
        <MappingField label="Left bumper" buttonName="lb" object={object} setObject={setObject} />
        <MappingField label="Right bumper" buttonName="rb" object={object} setObject={setObject} />
        <MappingField label="Left trigger" buttonName="lt" object={object} setObject={setObject} />
        <MappingField label="Right trigger" buttonName="rt" object={object} setObject={setObject} />
      </div>
    </EditorTabPanel>
  );
}
