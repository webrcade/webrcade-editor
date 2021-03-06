import * as React from 'react';

import {
  APP_TYPE_KEYS
} from '@webrcade/app-common'

import * as Util from '../../Util';
import EditorMultiUrlField from '../common/editor/EditorMultiUrlField';
import EditorSelect from '../common/editor/EditorSelect';
import EditorSwitch from '../common/editor/EditorSwitch';
import EditorTabPanel from '../common/editor/EditorTabPanel';
import EditorTextField from '../common/editor/EditorTextField';
import EditorUrlField from '../common/editor/EditorUrlField';
import SelectPalette from './gb/SelectPalette';
import SelectPlayerOrder from './SelectPlayerOrder';
import VolumeAdjust from './VolumeAdjust';

const PROP_3BUTTON = "PROP_3BUTTON";
const PROP_6BUTTON = "PROP_6BUTTON";
const PROP_ADDITIONAL_ROMS = "PROP_ADDITIONAL_ROMS";
const PROP_DOOM_GAME = "PROP_DOOM_GAME";
const PROP_FLASH_SIZE = "PROP_FLASH_SIZE";
const PROP_FORCE_PAL = "PROP_FORCE_PAL";
const PROP_FORCE_YM2413 = "PROP_FORCE_YM2413";
const PROP_LANGUAGE = "PROP_LANGUAGE";
const PROP_MIRRORING = "PROP_MIRRORING";
const PROP_NEOGEO_BIOS = "PROP_NEOGEO_BIOS";
const PROP_NEOGEO_FORCE_AES = "PROP_NEOGEO_FORCE_AES";
const PROP_PARENT_ROM = "PROP_PARENT_ROM";
const PROP_PLAYER_ORDER = "PROP_PLAYER_ORDER";
const PROP_ROM = "PROP_ROM";
const PROP_ROTATED = "PROP_ROTATED";
const PROP_ROTATION = "PROP_ROTATION";
const PROP_ROTATION_LNX = "PROP_ROTATION_LNX";
const PROP_RTC = "PROP_RTC";
const PROP_SAMPLES = "PROP_SAMPLES";
const PROP_SAVE_TYPE = "PROP_SAVE_TYPE";
const PROP_SMS_HW_TYPE = "PROP_SMS_HW_TYPE";
const PROP_SWAP_CONTROLLERS = "PROP_SWAP_CONTROLLERS";
const PROP_GB_HW_TYPE = "PROP_GB_HW_TYPE";
const PROP_GB_COLORS = "PROP_GB_COLORS";
const PROP_GB_PALETTE = "PROP_GB_PALETTE";
const PROP_GB_BORDER = "PROP_GB_BORDER";
const PROP_SNES_MULTITAP = "PROP_SNES_MULTITAP";
const PROP_VOL_ADJUST = "PROP_VOL_ADJUST";

const ALL_PROPS = [
  PROP_3BUTTON,
  PROP_6BUTTON,
  PROP_ADDITIONAL_ROMS,
  PROP_DOOM_GAME,
  PROP_FLASH_SIZE,
  PROP_FORCE_PAL,
  PROP_FORCE_YM2413,
  PROP_GB_BORDER,
  PROP_GB_COLORS,
  PROP_GB_HW_TYPE,
  PROP_GB_PALETTE,
  PROP_LANGUAGE,
  PROP_MIRRORING,
  PROP_NEOGEO_BIOS,
  PROP_PARENT_ROM,
  PROP_PLAYER_ORDER,
  PROP_ROM,
  PROP_ROTATED,
  PROP_ROTATION,
  PROP_ROTATION_LNX,
  PROP_RTC,
  PROP_SAMPLES,
  PROP_SAVE_TYPE,
  PROP_SMS_HW_TYPE,
  PROP_SNES_MULTITAP,
  PROP_SWAP_CONTROLLERS,
  PROP_VOL_ADJUST
];

const FIELD_MAP = {
  [APP_TYPE_KEYS.A2600]: {
    PROP_ROM, PROP_SWAP_CONTROLLERS
  },
  [APP_TYPE_KEYS.JAVATARI]: {
    PROP_ROM, PROP_SWAP_CONTROLLERS
  },
  [APP_TYPE_KEYS.A7800]: {
    PROP_ROM
  },
  [APP_TYPE_KEYS.JS7800]: {
    PROP_ROM
  },
  [APP_TYPE_KEYS.NES]: {
    PROP_ROM, PROP_FORCE_PAL
  },
  [APP_TYPE_KEYS.FCEUX]: {
    PROP_ROM, PROP_FORCE_PAL
  },
  [APP_TYPE_KEYS.SNES]: {
    PROP_ROM, PROP_FORCE_PAL, PROP_SNES_MULTITAP
  },
  [APP_TYPE_KEYS.SNES9X]: {
    PROP_ROM, PROP_FORCE_PAL, PROP_SNES_MULTITAP
  },
  [APP_TYPE_KEYS.GENESIS]: {
    PROP_ROM, PROP_FORCE_PAL, PROP_3BUTTON
  },
  [APP_TYPE_KEYS.GENPLUSGX_MD]: {
    PROP_ROM, PROP_FORCE_PAL
  },
  [APP_TYPE_KEYS.GG]: {
    PROP_ROM
  },
  [APP_TYPE_KEYS.GENPLUSGX_GG]: {
    PROP_ROM
  },
  [APP_TYPE_KEYS.SMS]: {
    PROP_ROM, PROP_FORCE_PAL, PROP_SMS_HW_TYPE, PROP_FORCE_YM2413
  },
  [APP_TYPE_KEYS.GENPLUSGX_SMS]: {
    PROP_ROM, PROP_FORCE_PAL, PROP_SMS_HW_TYPE, PROP_FORCE_YM2413
  },
  [APP_TYPE_KEYS.SG1000]: {
    PROP_ROM, PROP_FORCE_PAL
  },
  [APP_TYPE_KEYS.GENPLUSGX_SG]: {
    PROP_ROM, PROP_FORCE_PAL
  },
  [APP_TYPE_KEYS.DOOM]: {
    PROP_DOOM_GAME
  },
  [APP_TYPE_KEYS.PRBOOM]: {
    PROP_DOOM_GAME
  },
  [APP_TYPE_KEYS.GBA]: {
    PROP_ROM, PROP_ROTATION, PROP_RTC, PROP_MIRRORING, PROP_SAVE_TYPE, PROP_FLASH_SIZE
  },
  [APP_TYPE_KEYS.VBA_M_GBA]: {
    PROP_ROM, PROP_ROTATION, PROP_RTC, PROP_MIRRORING, PROP_SAVE_TYPE, PROP_FLASH_SIZE
  },
  [APP_TYPE_KEYS.GB]: {
    PROP_ROM, PROP_GB_HW_TYPE, PROP_GB_COLORS, PROP_GB_PALETTE, PROP_GB_BORDER
  },
  [APP_TYPE_KEYS.VBA_M_GB]: {
    PROP_ROM, PROP_GB_HW_TYPE, PROP_GB_COLORS, PROP_GB_PALETTE, PROP_GB_BORDER
  },
  [APP_TYPE_KEYS.GBC]: {
    PROP_ROM
  },
  [APP_TYPE_KEYS.VBA_M_GBC]: {
    PROP_ROM
  },
  [APP_TYPE_KEYS.N64]: {
    PROP_ROM
  },
  [APP_TYPE_KEYS.PARALLEL_N64]: {
    PROP_ROM
  },
  [APP_TYPE_KEYS.PCE]: {
    PROP_ROM, PROP_6BUTTON
  },
  [APP_TYPE_KEYS.MEDNAFEN_PCE]: {
    PROP_ROM, PROP_6BUTTON
  },
  [APP_TYPE_KEYS.SGX]: {
    PROP_ROM, PROP_6BUTTON
  },
  [APP_TYPE_KEYS.MEDNAFEN_SGX]: {
    PROP_ROM, PROP_6BUTTON
  },
  [APP_TYPE_KEYS.VB]: {
    PROP_ROM
  },
  [APP_TYPE_KEYS.MEDNAFEN_VB]: {
    PROP_ROM
  },
  [APP_TYPE_KEYS.NGC]: {
    PROP_ROM, PROP_LANGUAGE
  },
  [APP_TYPE_KEYS.MEDNAFEN_NGC]: {
    PROP_ROM, PROP_LANGUAGE
  },
  [APP_TYPE_KEYS.NGP]: {
    PROP_ROM, PROP_LANGUAGE
  },
  [APP_TYPE_KEYS.MEDNAFEN_NGP]: {
    PROP_ROM, PROP_LANGUAGE
  },
  [APP_TYPE_KEYS.WSC]: {
    PROP_ROM, PROP_ROTATED, PROP_LANGUAGE
  },
  [APP_TYPE_KEYS.MEDNAFEN_WSC]: {
    PROP_ROM, PROP_ROTATED, PROP_LANGUAGE
  },
  [APP_TYPE_KEYS.WS]: {
    PROP_ROM, PROP_ROTATED, PROP_LANGUAGE
  },
  [APP_TYPE_KEYS.MEDNAFEN_WS]: {
    PROP_ROM, PROP_ROTATED, PROP_LANGUAGE
  },
  [APP_TYPE_KEYS.LNX]: {
    PROP_ROM, PROP_ROTATION_LNX
  },
  [APP_TYPE_KEYS.MEDNAFEN_LNX]: {
    PROP_ROM, PROP_ROTATION_LNX
  },
  [APP_TYPE_KEYS.NEOGEO]: {
    PROP_ROM, PROP_ADDITIONAL_ROMS, PROP_VOL_ADJUST, PROP_NEOGEO_BIOS, PROP_NEOGEO_FORCE_AES
  },
  [APP_TYPE_KEYS.FBNEO_NEOGEO]: {
    PROP_ROM, PROP_ADDITIONAL_ROMS, PROP_VOL_ADJUST, PROP_NEOGEO_BIOS, PROP_NEOGEO_FORCE_AES
  },
  [APP_TYPE_KEYS.ARCADE_KONAMI]: {
    PROP_ROM, PROP_ADDITIONAL_ROMS, PROP_SAMPLES, PROP_VOL_ADJUST, PROP_PLAYER_ORDER
  },
  [APP_TYPE_KEYS.FBNEO_KONAMI]: {
    PROP_ROM, PROP_ADDITIONAL_ROMS, PROP_SAMPLES, PROP_VOL_ADJUST, PROP_PLAYER_ORDER
  },
  [APP_TYPE_KEYS.ARCADE]: {
    PROP_ROM, PROP_ADDITIONAL_ROMS, PROP_SAMPLES, PROP_VOL_ADJUST, PROP_PLAYER_ORDER
  },
  [APP_TYPE_KEYS.FBNEO_ARCADE]: {
    PROP_ROM, PROP_ADDITIONAL_ROMS, PROP_SAMPLES, PROP_VOL_ADJUST, PROP_PLAYER_ORDER
  },
  [APP_TYPE_KEYS.ARCADE_CAPCOM]: {
    PROP_ROM, PROP_ADDITIONAL_ROMS, PROP_SAMPLES, PROP_VOL_ADJUST, PROP_PLAYER_ORDER
  },
  [APP_TYPE_KEYS.FBNEO_CAPCOM]: {
    PROP_ROM, PROP_ADDITIONAL_ROMS, PROP_SAMPLES, PROP_VOL_ADJUST, PROP_PLAYER_ORDER
  },
}

const hasProp = (object, prop) => {
  const fields = FIELD_MAP[object.type];
  if (fields) {
    return fields[prop] !== undefined;
  }
  return false;
}

const clearValidatorProps = (validator, object, tabIndex) => {
  const type = object.type;
  let fields = FIELD_MAP[type];
  if (fields === undefined) {
    fields = [];
  }

  ALL_PROPS.forEach((p) => {
    if (fields[p] === undefined) {
      validator.updateErrors(tabIndex, p, true);
    }
  });
}

export default function PropertiesTab(props) {
  const {
    tabValue,
    tabIndex,
    object,
    setObject,
    validator,
    addValidateCallback
  } = props;

  React.useEffect(() => {
    clearValidatorProps(validator, object, tabIndex);

    if (addValidateCallback) {
      addValidateCallback(
        "PropsTab-" + tabIndex,
        () => {
          // ROM
          if (hasProp(object, PROP_ROM)) {
            validator.checkMinLength(tabIndex, PROP_ROM, object.props.rom);
          }
        }
      );
    }
  }, [addValidateCallback, object, tabIndex, validator]);

  const showGbColors = object.props.hwType !== 1 && object.props.hwType !== 4;

  return (
    <EditorTabPanel value={tabValue} index={tabIndex}>
      {hasProp(object, PROP_ROM) ? (
        <div>
          <EditorUrlField
            required
            sx={{ width: '50ch' }}
            label="ROM (URL)"
            onDropText={(text) => {
              const props = { ...object.props, rom: text }
              setObject({ ...object, props })
            }}
            onChange={(e) => {
              const props = { ...object.props, rom: e.target.value }
              setObject({ ...object, props })
            }}
            value={Util.asString(object.props.rom)}
            error={!validator.isValid(tabIndex, PROP_ROM)}
          />
        </div>
      ) : null}
      {hasProp(object, PROP_PARENT_ROM) ? (
        <div>
          <EditorTextField
            sx={{ width: '50ch' }}
            label="Parent ROM (URL)"
            onDropText={(text) => {
              const props = { ...object.props, parentRom: text }
              setObject({ ...object, props })
            }}
            onChange={(e) => {
              const props = { ...object.props, parentRom: e.target.value }
              setObject({ ...object, props })
            }}
            value={Util.asString(object.props.parentRom)}
          />
        </div>
      ) : null}
      {hasProp(object, PROP_ADDITIONAL_ROMS) ? (
        <div>
          <EditorMultiUrlField
            label="Additional ROMs (URLs)"
            rows={2}
            onDropText={(text) => {
              let urls = object.props.additionalRoms ? object.props.additionalRoms : [];
              if (Array.isArray(text)) {
                urls.push(...text);
              } else {
                urls.push(text);
              }
              urls = Util.removeEmptyItems(urls);              
              const props = { ...object.props, additionalRoms: urls }
              if (urls.length === 0) {
                delete props.additionalRoms;
              }
              setObject({ ...object, props })
            }}
            onChange={(e) => {
              const val = e.target.value;
              let urls = val.split("\n");
              urls = Util.removeEmptyItems(urls);
              const props = { ...object.props, additionalRoms: urls }
              if (urls.length === 0) {
                delete props.additionalRoms;
              }
              setObject({ ...object, props })
            }}
            value={object.props.additionalRoms && object.props.additionalRoms.length > 0 ? 
              object.props.additionalRoms.join("\n") : ""}
          />
        </div>
      ) : null}
      {hasProp(object, PROP_SAMPLES) ? (
        <div>
          <EditorUrlField
            sx={{ width: '50ch' }}
            label="Samples (URL)"
            onDropText={(text) => {
              const props = { ...object.props, samples: text }
              setObject({ ...object, props })
            }}
            onChange={(e) => {
              const props = { ...object.props, samples: e.target.value }
              setObject({ ...object, props })
            }}
            value={Util.asString(object.props.samples)}
          />
        </div>
      ) : null}
      {hasProp(object, PROP_LANGUAGE) ? (
        <div>
          <EditorSelect
            label="Language"
            tooltip="The language to use for displaying game text (if applicable)."
            value={object.props.language ? object.props.language : 0}
            menuItems={[
              { value: 0, name: "English" },
              { value: 1, name: "Japanese" },
            ]}
            onChange={(e) => {
              const props = { ...object.props, language: e.target.value }
              setObject({ ...object, props })
            }}
          />
        </div>
      ) : null}
      {hasProp(object, PROP_SWAP_CONTROLLERS) ? (
        <div>
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
      ) : null}
      {hasProp(object, PROP_SMS_HW_TYPE) ? (
        <div>
          <EditorSelect
            label="Hardware Type"
            tooltip="The type of hardware to emulate."
            value={object.props.hwType ? object.props.hwType : 0}
            menuItems={[
              { value: 0, name: "Master System II" },
              { value: 1, name: "Master System" },
              { value: 2, name: "SG-1000" },
            ]}
            onChange={(e) => {
              const props = { ...object.props, hwType: e.target.value }
              setObject({ ...object, props })
            }}
          />
        </div>
      ) : null}
      {hasProp(object, PROP_GB_HW_TYPE) ? (
        <div>
          <EditorSelect
            label="Hardware Type"
            tooltip="The type of hardware to emulate."
            value={object.props.hwType ? object.props.hwType : 0}
            menuItems={[
              { value: 0, name: "Automatic" },
              { value: 3, name: "Game Boy" },
              { value: 1, name: "Game Boy Color" },
              { value: 4, name: "Game Boy Advance" },
              { value: 2, name: "Super Game Boy" },
              { value: 5, name: "Super Game Boy 2" },
            ]}
            onChange={(e) => {
              const props = { ...object.props, hwType: e.target.value }
              setObject({ ...object, props })
            }}
          />
        </div>
      ) : null}
      {hasProp(object, PROP_GB_COLORS) && showGbColors ? (
        <div>
          <EditorSelect
            label="Screen Colors"
            tooltip="The category of colors to use for the display."
            value={object.props.colors ? object.props.colors : 0}
            menuItems={[
              { value: 0, name: "Grayscale" },
              { value: 1, name: "Greenscale" },
              { value: 2, name: "Super Game Boy" },
            ]}
            onChange={(e) => {
              const props = { ...object.props, colors: e.target.value, palette: 0 }
              setObject({ ...object, props })
            }}
          />
        </div>
      ) : null}
      {hasProp(object, PROP_GB_PALETTE) && showGbColors ? (
        <div>
          <SelectPalette
            colorsValue={object.props.colors}
            value={object.props.palette ? object.props.palette : 0}
            onChange={(e) => {
              const props = { ...object.props, palette: e.target.value }
              setObject({ ...object, props })
            }}
          />
        </div>
      ) : null}
      {hasProp(object, PROP_GB_BORDER) ? (
        <div>
          <EditorSelect
            label="Border"
            tooltip="Whether to display a border around the screen."
            value={object.props.border ? object.props.border : 0}
            menuItems={[
              { value: 2, name: "Automatic" },
              { value: 1, name: "On" },
              { value: 0, name: "Off" },
            ]}
            onChange={(e) => {
              const props = { ...object.props, border: e.target.value }
              setObject({ ...object, props })
            }}
          />
        </div>
      ) : null}
      {hasProp(object, PROP_FORCE_PAL) ? (
        <div>
          <EditorSwitch
            label="Force PAL"
            tooltip="Whether to force PAL video mode for the specified ROM."
            onChange={(e) => {
              const props = { ...object.props, pal: e.target.checked }
              setObject({ ...object, props })
            }}
            checked={Util.asBoolean(object.props.pal)}
          />
        </div>
      ) : null}
      {hasProp(object, PROP_SNES_MULTITAP) ? (
        <div>
          <EditorSwitch
            label="Multitap (Port #2)"
            tooltip="Whether to use a Multitap adapter in controller port #2."
            onChange={(e) => {
              const props = { ...object.props, port2: (e.target.checked ? 1 : 0) }
              setObject({ ...object, props })
            }}
            checked={Util.asBoolean(object.props.port2 === 1)}
          />
        </div>
      ) : null}
      {hasProp(object, PROP_3BUTTON) ? (
        <div>
          <EditorSwitch
            label="3-Button Control Pads"
            tooltip="Whether to use 3-button control pads (6-button is the default)."
            onChange={(e) => {
              const props = { ...object.props, pad3button: e.target.checked }
              setObject({ ...object, props })
            }}
            checked={Util.asBoolean(object.props.pad3button)}
          />
        </div>
      ) : null}
      {hasProp(object, PROP_6BUTTON) ? (
        <div>
          <EditorSwitch
            label="6-Button Control Pads"
            tooltip="Whether to use 6-button control pads (2 button is the default)."
            onChange={(e) => {
              const props = { ...object.props, pad6button: e.target.checked }
              setObject({ ...object, props })
            }}
            checked={Util.asBoolean(object.props.pad6button)}
          />
        </div>
      ) : null}
      {hasProp(object, PROP_FORCE_YM2413) ? (
        <div>
          <EditorSwitch
            label="Force YM2413 FM Sound Generator"
            tooltip="Whether to emulator the YM2413 FM sound generator produced by Yamaha. The YM2413 was an add-on for the Sega Mark III and is built into the Japanese Sega Master System."
            onChange={(e) => {
              const props = { ...object.props, ym2413: e.target.checked }
              setObject({ ...object, props })
            }}
            checked={Util.asBoolean(object.props.ym2413)}
          />
        </div>
      ) : null}
      {hasProp(object, PROP_DOOM_GAME) ? (
        <div>
          <EditorSelect
            label="Game"
            tooltip="The classic Doom game to play."
            value={object.props.game ? object.props.game : "doom1"}
            menuItems={[
              { value: "doom1", name: " Doom 1 (shareware version)" },
              { value: "freedoom1", name: "Freedoom Phase 1" },
              { value: "freedoom2", name: "Freedoom Phase 2" }
            ]}
            onChange={(e) => {
              const props = { ...object.props, game: e.target.value }
              setObject({ ...object, props })
            }}
          />
        </div>
      ) : null}
      {hasProp(object, PROP_ROTATED) ? (
        <div>
          <EditorSwitch
            label="Rotated"
            tooltip="Whether to rotate the screen and controls."
            onChange={(e) => {
              const props = { ...object.props, rotated: e.target.checked }
              setObject({ ...object, props })
            }}
            checked={Util.asBoolean(object.props.rotated)}
          />
        </div>
      ) : null}
      {hasProp(object, PROP_ROTATION) ? (
        <div>
          <EditorSelect
            label="Rotation"
            tooltip="How many degrees the screen should be rotated."
            value={object.props.rotation ? object.props.rotation : 0}
            menuItems={[
              { value: 0, name: "0 degrees" },
              { value: 90, name: "90 degrees" },
              { value: 180, name: "180 degrees" },
              { value: 270, name: "270 degrees" }
            ]}
            onChange={(e) => {
              const props = { ...object.props, rotation: e.target.value }
              setObject({ ...object, props })
            }}
          />
        </div>
      ) : null}
      {hasProp(object, PROP_ROTATION_LNX) ? (
        <div>
          <EditorSelect
            label="Rotation"
            tooltip="How many degrees the screen should be rotated."
            value={object.props.rotation ? object.props.rotation : 0}
            menuItems={[
              { value: 0, name: "0 degrees" },
              { value: 90, name: "90 degrees" },
              { value: 270, name: "270 degrees" }
            ]}
            onChange={(e) => {
              const props = { ...object.props, rotation: e.target.value }
              setObject({ ...object, props })
            }}
          />
        </div>
      ) : null}
      {hasProp(object, PROP_SAVE_TYPE) ? (
        <div>
          <EditorSelect
            label="Save Type"
            tooltip="The type of save hardware utilized by the cartridge."
            value={object.props.saveType ? object.props.saveType : 0}
            menuItems={[
              { value: 0, name: "Auto-detect" },
              { value: 1, name: "EEPROM" },
              { value: 2, name: "SRAM" },
              { value: 3, name: "Flash" },
              { value: 4, name: "EEPROM + Sensor" },
              { value: 5, name: "None" }
            ]}
            onChange={(e) => {
              const props = { ...object.props, saveType: e.target.value }
              setObject({ ...object, props })
            }}
          />
        </div>
      ) : null}
      {hasProp(object, PROP_FLASH_SIZE) ? (
        <div>
          <EditorSelect
            label="Flash Size"
            tooltip="The size of the flash ram (only applicable for flash save type)."
            value={object.props.flashSize ? object.props.flashSize : 65536}
            menuItems={[
              { value: 65536, name: "64k" },
              { value: 131072, name: "128k" }
            ]}
            onChange={(e) => {
              const props = { ...object.props, flashSize: e.target.value }
              setObject({ ...object, props })
            }}
          />
        </div>
      ) : null}
      {hasProp(object, PROP_RTC) ? (
        <div>
          <EditorSwitch
            label="Real-time Clock"
            tooltip="Whether the cartridge utilizes a real-time clock."
            onChange={(e) => {
              const props = { ...object.props, rtc: e.target.checked }
              setObject({ ...object, props })
            }}
            checked={Util.asBoolean(object.props.rtc)}
          />
        </div>
      ) : null}
      {hasProp(object, PROP_MIRRORING) ? (
        <div>
          <EditorSwitch
            label="Mirroring"
            tooltip="Whether the cartridge utilizes mirrored memory addresses."
            onChange={(e) => {
              const props = { ...object.props, mirroring: e.target.checked }
              setObject({ ...object, props })
            }}
            checked={Util.asBoolean(object.props.mirroring)}
          />
        </div>
      ) : null}
      {hasProp(object, PROP_VOL_ADJUST) ? (
        <div>
          <VolumeAdjust
            value={object.props.volAdjust ? object.props.volAdjust : 0}
            onChange={(e, val) => {
              // Allows for smoother updated prior to change being committed
              object.props.volAdjust = parseInt(val);
            }}
            onChangeCommitted={(e, val) => {
              const props = { ...object.props, volAdjust: parseInt(val) }
              setObject({ ...object, props })
            }} />
        </div>
      ) : null}
      {hasProp(object, PROP_NEOGEO_BIOS) ? (
        <div>
          <EditorSelect
            label="Neo Geo BIOS"
            tooltip="The BIOS to use (must be available)."
            value={object.props.bios ? object.props.bios : 0}
            menuItems={[
              { value: 0x00, name: "(default)" },
              { value: 0x00 + 1, name: "MVS Asia/Europe ver. 6 (1 slot)" },
              { value: 0x01 + 1, name: "MVS Asia/Europe ver. 5 (1 slot)" },
              { value: 0x02 + 1, name: "MVS Asia/Europe ver. 3 (4 slot)" },
              { value: 0x03 + 1, name: "MVS USA ver. 5 (2 slot)" },
              { value: 0x04 + 1, name: "MVS USA ver. 5 (4 slot)" },
              { value: 0x05 + 1, name: "MVS USA ver. 5 (6 slot)" },
              { value: 0x06 + 1, name: "MVS USA (U4)" },
              { value: 0x07 + 1, name: "MVS USA (U3)" },
              { value: 0x08 + 1, name: "MVS Japan ver. 6 (? slot)" },
              { value: 0x09 + 1, name: "MVS Japan ver. 5 (? slot)" },
              { value: 0x0a + 1, name: "MVS Japan ver. 3 (4 slot)" },
              { value: 0x0b + 1, name: "NEO-MVH MV1C (Asia)" },
              { value: 0x0c + 1, name: "NEO-MVH MV1C (Japan)" },
              { value: 0x0d + 1, name: "MVS Japan (J3)" },
              { value: 0x0e + 1, name: "MVS Japan (J3, alt)" },
              { value: 0x0f + 1, name: "AES Japan" },
              { value: 0x10 + 1, name: "AES Asia" },
              { value: 0x11 + 1, name: "Development Kit" },
              { value: 0x12 + 1, name: "Deck ver. 6 (Git Ver 1.3)" },
              { value: 0x13 + 1, name: "Universe BIOS ver. 4.0" },
              { value: 0x14 + 1, name: "Universe BIOS ver. 3.3" },
              { value: 0x15 + 1, name: "Universe BIOS ver. 3.2" },
              { value: 0x16 + 1, name: "Universe BIOS ver. 3.1" },
              { value: 0x17 + 1, name: "Universe BIOS ver. 3.0" },
              { value: 0x18 + 1, name: "Universe BIOS ver. 2.3" },
              { value: 0x19 + 1, name: "Universe BIOS ver. 2.3 (alt)" },
              { value: 0x1a + 1, name: "Universe BIOS ver. 2.2" },
              { value: 0x1b + 1, name: "Universe BIOS ver. 2.1" },
              { value: 0x1c + 1, name: "Universe BIOS ver. 2.0" },
              { value: 0x1d + 1, name: "Universe BIOS ver. 1.3" },
              { value: 0x1e + 1, name: "Universe BIOS ver. 1.2" },
              { value: 0x1f + 1, name: "Universe BIOS ver. 1.2 (alt)" },
              { value: 0x20 + 1, name: "Universe BIOS ver. 1.1" },
              { value: 0x21 + 1, name: "Universe BIOS ver. 1.0" },
              { value: 0x22 + 1, name: "NeoOpen BIOS v0.1 beta" },
            ]}
            onChange={(e) => {
              const props = { ...object.props, bios: e.target.value }
              setObject({ ...object, props })
            }}
          />
        </div>
      ) : null}
      {hasProp(object, PROP_NEOGEO_FORCE_AES) ? (
        <div>
          <EditorSwitch
            sx={{ mt: 1 }}
            label="Force AES (console) mode"
            tooltip="Whether to force AES (console) mode (must be supported by selected BIOS)."
            onChange={(e) => {
              const props = { ...object.props, forceAesMode: e.target.checked }
              setObject({ ...object, props })
            }}
            checked={Util.asBoolean(object.props.forceAesMode)}
          />
        </div>
      ) : null}
      {hasProp(object, PROP_PLAYER_ORDER) ? (
        <div>
          <SelectPlayerOrder
            value={object.props.playerOrder}
            onChange={(value) => {
              const props = { ...object.props, playerOrder: value }
              setObject({ ...object, props })
            }}
          />
        </div>
      ) : null}
    </EditorTabPanel>
  );
}

