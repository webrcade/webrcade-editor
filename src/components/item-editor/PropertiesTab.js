import * as React from 'react';

import {
  APP_TYPE_KEYS
} from '@webrcade/app-common'

import * as Util from '../../Util';
import EditorSelect from '../common/editor/EditorSelect';
import EditorSwitch from '../common/editor/EditorSwitch';
import EditorTabPanel from '../common/editor/EditorTabPanel';
import EditorTextField from '../common/editor/EditorTextField';

const PROP_3BUTTON = "PROP_3BUTTON";
const PROP_DOOM_GAME = "PROP_DOOM_GAME";
const PROP_FLASH_SIZE = "PROP_FLASH_SIZE";
const PROP_FORCE_PAL = "PROP_FORCE_PAL";
const PROP_FORCE_SMS = "PROP_FORCE_SMS";
const PROP_FORCE_YM2413 = "PROP_FORCE_YM2413";
const PROP_MIRRORING = "PROP_MIRRORING";
const PROP_ROM = "PROP_ROM";
const PROP_ROTATION = "PROP_ROTATION";
const PROP_RTC = "PROP_RTC"
const PROP_SAVE_TYPE = "PROP_SAVE_TYPE"
const PROP_SWAP_CONTROLLERS = "PROP_SWAP_CONTROLLERS";

const ALL_PROPS = [
  PROP_3BUTTON,
  PROP_DOOM_GAME,
  PROP_FLASH_SIZE,
  PROP_FORCE_PAL,
  PROP_FORCE_SMS,
  PROP_FORCE_YM2413,
  PROP_MIRRORING,
  PROP_ROM,
  PROP_ROTATION,
  PROP_RTC,
  PROP_SAVE_TYPE,
  PROP_SWAP_CONTROLLERS
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
    PROP_ROM, PROP_FORCE_PAL
  },
  [APP_TYPE_KEYS.SNES9X]: {
    PROP_ROM, PROP_FORCE_PAL
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
    PROP_ROM, PROP_FORCE_PAL, PROP_FORCE_SMS, PROP_FORCE_YM2413
  },
  [APP_TYPE_KEYS.GENPLUSGX_SMS]: {
    PROP_ROM, PROP_FORCE_PAL, PROP_FORCE_SMS, PROP_FORCE_YM2413
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

  return (
    <EditorTabPanel value={tabValue} index={tabIndex}>
      {hasProp(object, PROP_ROM) ? (
        <div>
          <EditorTextField
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
      {hasProp(object, PROP_FORCE_SMS) ? (
        <div>
          <EditorSwitch
            label="Force Master System II"
            tooltip="Whether to emulate the Sega Master System II console. The Master System II contains the 315-5246 VDP which supports the extra-height 224 and 240-line modes."
            onChange={(e) => {
              const props = { ...object.props, sms2: e.target.checked }
              setObject({ ...object, props })
            }}
            checked={Util.asBoolean(object.props.sms2)}
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
    </EditorTabPanel>
  );
}
