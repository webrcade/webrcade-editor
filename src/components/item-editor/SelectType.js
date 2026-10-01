import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import ClearIcon from '@mui/icons-material/Clear';

import {
  AppRegistry
} from '@webrcade/app-common'
import CommonTooltip from '../common/CommonTooltip';
import EditorButton from '../common/editor/EditorButton';
import EditorTextField from '../common/editor/EditorTextField';
import PlatformChooserModal, { getPlatformThumb } from './PlatformChooserModal';
import { Global } from '../../Global';

export default function SelectType(props) {
  const { item, setItem, onChange, label: labelProp, allowNone, hideDropdown } = props;
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

  if (hideDropdown) {
    const currentName = item.type ? AppRegistry.instance.getShortNameForType(item.type) : (allowNone ? '(None)' : '');
    const currentType = item.type ? types[item.type] : null;
    const thumbKey = currentType
      ? (currentType.absoluteKey !== undefined ? item.type : currentType.alias)
      : null;
    const thumbnail = thumbKey ? getPlatformThumb(thumbKey) : null;
    return (
      <Stack spacing={0} direction="row" alignItems="center" sx={{ minWidth: 0 }}>
        <EditorTextField
          sx={{
            width: '50ch',
            minWidth: 0,
            cursor: 'pointer',
            '& .MuiInputBase-input': {
              cursor: 'pointer',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            },
            '& .MuiOutlinedInput-root': { paddingRight: '10px' },
          }}
          label={label}
          value={currentName}
          InputProps={{
            readOnly: true,
            endAdornment: (thumbnail || (allowNone && item.type)) && (
              <InputAdornment position="end">
                {thumbnail && (
                  <Box
                    component="img"
                    src={thumbnail}
                    alt={currentName}
                    onClick={() => setModalOpen(true)}
                    onError={(e) => { e.target.style.visibility = 'hidden'; }}
                    sx={{ height: 34, width: 'auto', objectFit: 'contain', borderRadius: 1, cursor: 'pointer' }}
                  />
                )}
                {allowNone && item.type && (
                  <CommonTooltip title="Clear">
                    <IconButton
                      onClick={(e) => { e.stopPropagation(); setItem({ ...item, type: '' }); }}
                      size="small"
                      edge="end"
                      sx={{ ml: 1 }}
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </CommonTooltip>
                )}
              </InputAdornment>
            ),
          }}
          onClick={() => setModalOpen(true)}
        />
        <EditorButton
          label="Select..."
          onClick={() => setModalOpen(true)}
        />
        <PlatformChooserModal
          isOpen={modalOpen}
          setOpen={setModalOpen}
          onSelect={handleModalSelect}
          feedOverrides={feedOverrides}
        />
      </Stack>
    );
  }

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