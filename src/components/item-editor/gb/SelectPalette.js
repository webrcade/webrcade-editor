import { MenuItem } from '@mui/material';
import * as React from 'react';
import EditorSelect from '../../common/editor/EditorSelect';
import './SelectPalette.css'

function Palette(props) {
  const { palClass } = props;
  return (
      <div className={'palette ' + palClass}>
        <div class="c1"></div>
        <div class="c2"></div>
        <div class="c3"></div>
        <div class="c4"></div>
      </div>
  );
}

function getGrayscaleMenuItems() {
  return ([
      <MenuItem key="0" value="0"><Palette palClass="gray0"/></MenuItem>,
      <MenuItem key="1" value="1"><Palette palClass="gray1"/></MenuItem>,
  ]);
}

function getGreenscaleMenuItems() {
  return ([
      <MenuItem key="0" value="0"><Palette palClass="green0"/></MenuItem>,
      <MenuItem key="1" value="1"><Palette palClass="green1"/></MenuItem>,
      <MenuItem key="2" value="2"><Palette palClass="green2"/></MenuItem>,
      <MenuItem key="3" value="3"><Palette palClass="green3"/></MenuItem>,
      <MenuItem key="4" value="4"><Palette palClass="green4"/></MenuItem>,
      <MenuItem key="5" value="5"><Palette palClass="green5"/></MenuItem>,
  ]);
}

function getSuperGameBoyMenuItems() {
  return ([
      <MenuItem key="0" value="0"><Palette palClass="sgb1a"/></MenuItem>,      
      <MenuItem key="1" value="1"><Palette palClass="sgb1b"/></MenuItem>,      
      <MenuItem key="2" value="2"><Palette palClass="sgb1c"/></MenuItem>,      
      <MenuItem key="3" value="3"><Palette palClass="sgb1d"/></MenuItem>,      
      <MenuItem key="4" value="4"><Palette palClass="sgb1e"/></MenuItem>,      
      <MenuItem key="5" value="5"><Palette palClass="sgb1f"/></MenuItem>,      
      <MenuItem key="6" value="6"><Palette palClass="sgb1g"/></MenuItem>,      
      <MenuItem key="7" value="7"><Palette palClass="sgb1h"/></MenuItem>,      
      <MenuItem key="8" value="8"><Palette palClass="sgb2a"/></MenuItem>,      
      <MenuItem key="9" value="9"><Palette palClass="sgb2b"/></MenuItem>,      
      <MenuItem key="10" value="10"><Palette palClass="sgb2c"/></MenuItem>,      
      <MenuItem key="11" value="11"><Palette palClass="sgb2d"/></MenuItem>,      
      <MenuItem key="12" value="12"><Palette palClass="sgb2e"/></MenuItem>,      
      <MenuItem key="13" value="13"><Palette palClass="sgb2f"/></MenuItem>,      
      <MenuItem key="14" value="14"><Palette palClass="sgb2g"/></MenuItem>,      
      <MenuItem key="15" value="15"><Palette palClass="sgb2h"/></MenuItem>,      
      <MenuItem key="16" value="16"><Palette palClass="sgb3a"/></MenuItem>,      
      <MenuItem key="17" value="17"><Palette palClass="sgb3b"/></MenuItem>,      
      <MenuItem key="18" value="18"><Palette palClass="sgb3c"/></MenuItem>,      
      <MenuItem key="19" value="19"><Palette palClass="sgb3d"/></MenuItem>,      
      <MenuItem key="20" value="20"><Palette palClass="sgb3e"/></MenuItem>,      
      <MenuItem key="21" value="21"><Palette palClass="sgb3f"/></MenuItem>,      
      <MenuItem key="22" value="22"><Palette palClass="sgb3g"/></MenuItem>,      
      <MenuItem key="23" value="23"><Palette palClass="sgb3h"/></MenuItem>,      
      <MenuItem key="24" value="24"><Palette palClass="sgb4a"/></MenuItem>,      
      <MenuItem key="25" value="25"><Palette palClass="sgb4b"/></MenuItem>,      
      <MenuItem key="26" value="26"><Palette palClass="sgb4c"/></MenuItem>,      
      <MenuItem key="27" value="27"><Palette palClass="sgb4d"/></MenuItem>,      
      <MenuItem key="28" value="28"><Palette palClass="sgb4e"/></MenuItem>,      
      <MenuItem key="29" value="29"><Palette palClass="sgb4f"/></MenuItem>,      
      <MenuItem key="30" value="30"><Palette palClass="sgb4g"/></MenuItem>,      
      <MenuItem key="31" value="31"><Palette palClass="sgb4h"/></MenuItem>,            
  ]);
}

export default function SelectPalette(props) {
  const { colorsValue, value, onChange } = props;

  const handleChange = (e) => {
    if (onChange) onChange(e);
  };

  let menuitems = getGrayscaleMenuItems();
  let label = "Grayscale Palette";
  let tooltip = "The particular grayscale palette to use.";
  if (colorsValue === 1) {
    menuitems = getGreenscaleMenuItems();
    label = "Greenscale Palette";
    tooltip = "The particular greenscale palette to use.";  
  } else if (colorsValue === 2) {
    menuitems = getSuperGameBoyMenuItems();
    label = "Super Game Boy Palette";
    tooltip = "The particular Super Game Boy palette to use.";  
  }

  return (
    <>
    <EditorSelect
      label={label}
      tooltip={tooltip}
      value={value}
      onChange={(e) => { handleChange(e) }}
    > 
      {menuitems}
    </EditorSelect>
    </>
  );
}