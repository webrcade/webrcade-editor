import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import {
  AppRegistry
} from '@webrcade/app-common'
import PlatformChooserModal from './PlatformChooserModal';
import { Global } from '../../Global';

export default function SelectType(props) {
  const { item, setItem, onChange, label: labelProp, allowNone } = props;
  const label = labelProp || 'Application';
  const [modalOpen, setModalOpen] = React.useState(false);

  const feed = Global.getFeed();
  const feedOverrides = feed?.props?.overrides || {};

  const handleChange = (e) => {
    if (onChange) onChange(e);
    setItem({ ...item, type: e.target.value });
  };

  const aliasTypes = [];
  const specificTypes = [];

  const types =  AppRegistry.instance.getAppTypes();
  for (const key in types) {
    const type = types[key];
    const isAlias = type.absoluteKey !== undefined;
    const name = AppRegistry.instance.getShortNameForType(key);

    if (isAlias) {
      aliasTypes.push({key, name});
    } else {
      specificTypes.push({key, name});
    }
  }

  aliasTypes.sort(function (a, b) {
    return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
  });
  specificTypes.sort(function (a, b) {
    return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
  });

  const handleModalSelect = (typeKey) => {
    const syntheticEvent = {
      target: { value: typeKey }
    };
    handleChange(syntheticEvent);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <FormControl sx={{ m: 1.5, minWidth: 200 }}>
        <InputLabel shrink={allowNone ? true : undefined}>{label}</InputLabel>
        <Select
          native
          notched={allowNone ? true : undefined}
          value={item.type}
          onChange={handleChange}
          autoWidth
          label={label}
        >
          {allowNone && <option value="">(None)</option>}
          <optgroup label="General (Aliased)">
            {
              aliasTypes.map(type => {
                return (
                  <option key={type.key} value={type.key}>{type.name}</option>
                )
              })
            }
          </optgroup>
          <optgroup label="Specific">
            {
              specificTypes.map(type => {
                return (
                  <option key={type.key} value={type.key}>{type.name}</option>
                )
              })
            }
          </optgroup>
        </Select>
      </FormControl>
      <Button
        variant="contained"
        onClick={() => setModalOpen(true)}
        sx={{ ml: 1 }}
      >
        Browse...
      </Button>
      <PlatformChooserModal
        isOpen={modalOpen}
        setOpen={setModalOpen}
        onSelect={handleModalSelect}
        feedOverrides={feedOverrides}
      />
    </Box>
  );
}