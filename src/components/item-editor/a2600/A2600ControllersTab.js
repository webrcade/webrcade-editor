import * as React from 'react';

import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import EditorTabPanel from '../../common/editor/EditorTabPanel';
import EditorSwitch from '../../common/editor/EditorSwitch';
import * as Util from '../../../Util';

const UNSET_TEMP = -9999;

export function PaddleSensitivity(props) {
  const { value, onChange, onChangeCommitted } = props;
  // Allows for smoother updated prior to change being committed
  const [tempValue, setTempValue] = React.useState(UNSET_TEMP);

  return (
    <>
      <Typography sx={{ ml: 1.5, mt: 1.5 }} id="input-slider" gutterBottom>
        Paddle Sensitivity
      </Typography>
      <Stack
        spacing={2}
        direction="row"
        sx={{ width: '50ch', maxWidth: '100%', ml: 1.5, mb: .5 }}
      >
        <Slider
          valueLabelDisplay="auto"
          min={-99} max={99} step={1}
          marks={[{ value: 0, label: 'Default' }]}
          value={tempValue !== UNSET_TEMP ? tempValue : value}
          onChange={(e, val) => {onChange(e, val); setTempValue(val)}}
          onChangeCommitted={(e, val) => {onChangeCommitted(e, val); setTempValue(UNSET_TEMP)}}
        />
      </Stack>
    </>
  );
}

export function PaddleCenter(props) {
  const { value, onChange, onChangeCommitted } = props;
  // Allows for smoother updated prior to change being committed
  const [tempValue, setTempValue] = React.useState(UNSET_TEMP);

  return (
    <>
      <Typography sx={{ ml: 1.5 }} id="input-slider" gutterBottom>
        Paddle Center
      </Typography>
      <Stack
        spacing={2}
        direction="row"
        sx={{ width: '50ch', maxWidth: '100%', ml: 1.5, mb: .5 }}
      >
        <Slider
          valueLabelDisplay="auto"
          min={-99} max={99} step={1}
          marks={[{ value: 0, label: 'Default' }]}
          value={tempValue !== UNSET_TEMP ? tempValue : value}
          onChange={(e, val) => {onChange(e, val); setTempValue(val)}}
          onChangeCommitted={(e, val) => {onChangeCommitted(e, val); setTempValue(UNSET_TEMP)}}
        />
      </Stack>
    </>
  );
}

function ControllerType(props) {
  const { port, value, onChange } = props

  const valueOut = (value ? value : 0);

  return (
    <Select
      value={valueOut}
      onChange={onChange}
      variant="standard"
      name={port}
    >
      <MenuItem value="0">Joystick</MenuItem>
      <MenuItem value="1">Paddle</MenuItem>
      <MenuItem value="2">2 Paddles</MenuItem>
    </Select>
  );
}

export default function A2600ControllersTab(props) {
  const {
    tabValue,
    tabIndex,
    setObject,
    object
  } = props;

//  console.log(object)

  const port0 = object.props.port0;
  const port1 = object.props.port1;
  const hasPaddles = ((port0 && (port0 > 0)) || (port1 && (port1 > 0)));

  return (
    <EditorTabPanel value={tabValue} index={tabIndex}>
      <div>
        <Typography sx={{ ml: 1.5, mt: .5, mb: 1 }}>
          Controller Ports
        </Typography>
        <Stack
          spacing={3}
          direction="row"
          sx={{ width: '50ch', ml: 1.5, mb: .5 }}
        >
          <ControllerType port="0" value={object.props.port0}
            onChange={(e) => {
              const props = { ...object.props, port0: parseInt(e.target.value) }
              setObject({ ...object, props })
            }}
          />
          <ControllerType port="1" value={object.props.port1}
            onChange={(e) => {
              const props = { ...object.props, port1: parseInt(e.target.value) }
              setObject({ ...object, props })
            }}
          />
        </Stack>
      </div>
      {hasPaddles === true && (
        <div style={{marginTop: '30px'}}>
          <PaddleSensitivity value={
            object.props.paddleSensitivity ? object.props.paddleSensitivity : 0}
            onChange={(e, val) => {
              // Allows for smoother updated prior to change being committed
              object.props.paddleSensitivity = parseInt(val);
            }}
            onChangeCommitted={(e, val) => {
              const props = { ...object.props, paddleSensitivity: parseInt(val) }
              setObject({ ...object, props })
            }} />
        </div>
      )}
      {hasPaddles === true && (
        <div>
          <PaddleCenter value={
            object.props.paddleCenter ? object.props.paddleCenter : 0}
            onChange={(e, val) => {
              // Allows for smoother updated prior to change being committed
              object.props.paddleCenter = parseInt(val);
            }}
            onChangeCommitted={(e, val) => {
              const props = { ...object.props, paddleCenter: parseInt(val) }
              setObject({ ...object, props })
            }} />
        </div>
      )}
      {hasPaddles === true && (
        <div style={{marginTop: '0px'}}>
          <EditorSwitch
            label="Vertical Paddle Orientation"
            tooltip=""
            onChange={(e) => {
              const props = { ...object.props, paddleVertical: e.target.checked }
              setObject({ ...object, props })
            }}
            checked={Util.asBoolean(object.props.paddleVertical)}
          />
        </div>
      )}
      <div style={{marginTop: '0px'}}>
        <EditorSwitch
          label="Swap Controllers"
          tooltip="Whether to swap the controller ports. This is typically enabled when games default to using port 2 (versus port 1)."
          onChange={(e) => {
            const props = { ...object.props, swap: e.target.checked }
            setObject({ ...object, props })
          }}
          checked={Util.asBoolean(object.props.swap)}
        />
      </div>
    </EditorTabPanel>
  );
}
