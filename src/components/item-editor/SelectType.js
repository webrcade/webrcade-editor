import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import {
  AppRegistry
} from '@webrcade/app-common'

export default function SelectType(props) {
  const { item, setItem, onChange } = props;

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

  return (
    <div>
      <FormControl sx={{ m: 1.5, minWidth: 200 }}>
        <InputLabel>Application</InputLabel>
        <Select
          native 
          value={item.type}
          onChange={handleChange}
          autoWidth
          label="Application"
        >
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
    </div>
  );
}