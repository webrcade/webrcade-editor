import * as React from 'react';

import {
  APP_TYPE_KEYS,
} from '@webrcade/app-common'

import * as Util from '../../Util';
import EditorMultiUrlField from '../common/editor/EditorMultiUrlField';
import EditorSelect from '../common/editor/EditorSelect';
import EditorSwitch from '../common/editor/EditorSwitch';
import EditorTabPanel from '../common/editor/EditorTabPanel';
import EditorTextField from '../common/editor/EditorTextField';
import EditorUrlField from '../common/editor/EditorUrlField';
import MouseSpeed from './dos/MouseSpeed';
import SelectPalette from './gb/SelectPalette';
import SelectPlayerOrder from './SelectPlayerOrder';
import VolumeAdjust from './VolumeAdjust';
import WadSelector from './quake/WadSelector';
import ZoomLevel from './ZoolLevel';

const PROP_3BUTTON = "PROP_3BUTTON";
const PROP_3DO_HACK = "PROP_3DO_HACK";
const PROP_6BUTTON = "PROP_6BUTTON";
const PROP_ADDITIONAL_ROMS = "PROP_ADDITIONAL_ROMS";
const PROP_ANALOG = "PROP_ANALOG";
const PROP_ARCHIVE = "PROP_ARCHIVE";
const PROP_AUTO_START_PATH = "PROP_AUTO_START_PATH";
const PROP_BOOK_MODE = "PROP_BOOK_MODE";
const PROP_C64_RAM_EXPANSION = "PROP_C64_RAM_EXPANSION";
const PROP_CD_SPEED_HACK = "PROP_CD_SPEED_HACK";
const PROP_COLECO_CONTROLS_MODE = "PROP_COLECO_CONTROLS_MODE";
const PROP_CUSTOM_BIOS = "PROP_CUSTOM_BIOS";
const PROP_DISABLE_AUTOLOAD = "PROP_DISABLE_AUTOLOAD";
const PROP_DISABLE_TDE = "PROP_DISABLE_TDE";
const PROP_DISABLE_LOOKUP = "PROP_DISABLE_LOOKUP";
const PROP_DISABLE_MEMCARD1 = "PROP_DISABLE_MEMCARD1";
const PROP_DISCS = "PROP_DISCS";
const PROP_DOS_CONTROLLER_MODE = "PROP_DOS_CONTROLLER_MODE";
const PROP_DUAL_ANALOG = "PROP_DUAL_ANALOG";
const PROP_SBI = "PROP_SBI";
const PROP_DOOM_GAME = "PROP_DOOM_GAME";
const PROP_TWIN_STICK = "PROP_TWIN_STICK";
const PROP_FLASH_SIZE = "PROP_FLASH_SIZE";
const PROP_FORCE_PAL = "PROP_FORCE_PAL";
const PROP_FORCE_YM2413 = "PROP_FORCE_YM2413";
const PROP_JIFFYDOS = "PROP_JIFFYDOS";
const PROP_LANGUAGE = "PROP_LANGUAGE";
const PROP_MAP_RUN_SELECT = "PROP_MAP_RUN_SELECT";
const PROP_MEDIA = "PROP_MEDIA";
const PROP_MICROPHONE = "PROP_MICROPHONE";
const PROP_MIRRORING = "PROP_MIRRORING";
const PROP_MOUSE_SPEED = "PROP_MOUSE_SPEED";
const PROP_MULTITAP = "PROP_MULTITAP";
const PROP_NEOGEO_BIOS = "PROP_NEOGEO_BIOS";
const PROP_NEOGEO_FORCE_AES = "PROP_NEOGEO_FORCE_AES";
const PROP_PARENT_ROM = "PROP_PARENT_ROM";
const PROP_PLAYER_ORDER = "PROP_PLAYER_ORDER";
const PROP_REGION = "PROP_REGION";
const PROP_REGION_AUTO = "PROP_REGION_AUTO";
const PROP_ROM = "PROP_ROM";
const PROP_ROTATED = "PROP_ROTATED";
const PROP_ROTATION = "PROP_ROTATION";
const PROP_ROTATION_LNX = "PROP_ROTATION_LNX";
const PROP_RTC = "PROP_RTC";
const PROP_SAMPLES = "PROP_SAMPLES";
const PROP_SAVE_DISKS = "PROP_SAVE_DISKS";
const PROP_SAVE_TYPE = "PROP_SAVE_TYPE";
const PROP_SCREEN_GAP = "PROP_SCREEN_GAP";
const PROP_SCREEN_LAYOUT = "PROP_SCREEN_LAYOUT";
const PROP_SMS_HW_TYPE = "PROP_SMS_HW_TYPE";
const PROP_SWAP_CONTROLLERS = "PROP_SWAP_CONTROLLERS";
const PROP_GB_HW_TYPE = "PROP_GB_HW_TYPE";
const PROP_GB_COLORS = "PROP_GB_COLORS";
const PROP_GB_PALETTE = "PROP_GB_PALETTE";
const PROP_GB_BORDER = "PROP_GB_BORDER";
const PROP_SKIP_BIOS = "PROP_SKIP_BIOS";
const PROP_SKIP_CD_LOADING = "PROP_SKIP_CD_LOADING";
const PROP_SNES_MULTITAP = "PROP_SNES_MULTITAP";
const PROP_VOL_ADJUST = "PROP_VOL_ADJUST";
const PROP_WAD_SELECTOR = "PROP_WAD_SELECTOR";
const PROP_ZOOM_LEVEL = "PROP_ZOOM_LEVEL";

const ALL_PROPS = [
  PROP_3BUTTON,
  PROP_3DO_HACK,
  PROP_6BUTTON,
  PROP_ADDITIONAL_ROMS,
  PROP_ANALOG,
  PROP_ARCHIVE,
  PROP_AUTO_START_PATH,
  PROP_BOOK_MODE,
  PROP_C64_RAM_EXPANSION,
  PROP_CD_SPEED_HACK,
  PROP_COLECO_CONTROLS_MODE,
  PROP_CUSTOM_BIOS,
  PROP_DISABLE_AUTOLOAD,
  PROP_DISABLE_LOOKUP,
  PROP_DISABLE_MEMCARD1,
  PROP_DISABLE_TDE,
  PROP_DISCS,
  PROP_DOOM_GAME,
  PROP_DOS_CONTROLLER_MODE,
  PROP_DUAL_ANALOG,
  PROP_FLASH_SIZE,
  PROP_FORCE_PAL,
  PROP_FORCE_YM2413,
  PROP_GB_BORDER,
  PROP_GB_COLORS,
  PROP_GB_HW_TYPE,
  PROP_GB_PALETTE,
  PROP_JIFFYDOS,
  PROP_LANGUAGE,
  PROP_MEDIA,
  PROP_MICROPHONE,
  PROP_MIRRORING,
  PROP_MOUSE_SPEED,
  PROP_NEOGEO_BIOS,
  PROP_MULTITAP,
  PROP_PARENT_ROM,
  PROP_PLAYER_ORDER,
  PROP_REGION,
  PROP_REGION_AUTO,
  PROP_ROM,
  PROP_ROTATED,
  PROP_ROTATION,
  PROP_ROTATION_LNX,
  PROP_RTC,
  PROP_SAMPLES,
  PROP_SAVE_DISKS,
  PROP_SBI,
  PROP_SAVE_TYPE,
  PROP_SCREEN_GAP,
  PROP_SCREEN_LAYOUT,
  PROP_SKIP_BIOS,
  PROP_SKIP_CD_LOADING,
  PROP_SMS_HW_TYPE,
  PROP_SNES_MULTITAP,
  PROP_SWAP_CONTROLLERS,
  PROP_TWIN_STICK,
  PROP_VOL_ADJUST,
  PROP_WAD_SELECTOR,
  PROP_ZOOM_LEVEL
];

let FIELD_MAP = {}

export const buildFieldMap = () => {
  FIELD_MAP = {
    [APP_TYPE_KEYS.A2600]: {
      PROP_ROM, PROP_ZOOM_LEVEL
    },
    [APP_TYPE_KEYS.JAVATARI]: {
      PROP_ROM, PROP_SWAP_CONTROLLERS, PROP_ZOOM_LEVEL
    },
    [APP_TYPE_KEYS.RETRO_STELLA]: {
      PROP_ROM, PROP_ZOOM_LEVEL
    },
    [APP_TYPE_KEYS.RETRO_STELLA_LATEST]: {
      PROP_ROM, PROP_ZOOM_LEVEL
    },
    [APP_TYPE_KEYS.COMMODORE_C64]: {
      PROP_MEDIA, PROP_ZOOM_LEVEL, PROP_JIFFYDOS, PROP_SWAP_CONTROLLERS, PROP_REGION_AUTO, PROP_SAVE_DISKS, PROP_DISABLE_AUTOLOAD, PROP_DISABLE_TDE, PROP_C64_RAM_EXPANSION
    },
    [APP_TYPE_KEYS.RETRO_COMMODORE_C64]: {
      PROP_MEDIA, PROP_ZOOM_LEVEL, PROP_JIFFYDOS, PROP_SWAP_CONTROLLERS, PROP_REGION_AUTO, PROP_SAVE_DISKS, PROP_DISABLE_AUTOLOAD, PROP_DISABLE_TDE, PROP_C64_RAM_EXPANSION
    },
    [APP_TYPE_KEYS.A7800]: {
      PROP_ROM, PROP_ZOOM_LEVEL
    },
    [APP_TYPE_KEYS.JS7800]: {
      PROP_ROM, PROP_ZOOM_LEVEL
    },
    // [APP_TYPE_KEYS.RETRO_PROSYSTEM]: {
    //   PROP_ROM, PROP_ZOOM_LEVEL
    // },
    [APP_TYPE_KEYS.NES]: {
      PROP_ROM, PROP_FORCE_PAL, PROP_ZOOM_LEVEL
    },
    [APP_TYPE_KEYS.FCEUX]: {
      PROP_ROM, PROP_FORCE_PAL, PROP_ZOOM_LEVEL
    },
    [APP_TYPE_KEYS.RETRO_FCEUMM]: {
      PROP_ROM, PROP_FORCE_PAL, PROP_ZOOM_LEVEL
    },
    [APP_TYPE_KEYS.SNES]: {
      PROP_ROM, PROP_FORCE_PAL, PROP_SNES_MULTITAP, PROP_ZOOM_LEVEL
    },
    [APP_TYPE_KEYS.SNES9X]: {
      PROP_ROM, PROP_FORCE_PAL, PROP_SNES_MULTITAP, PROP_ZOOM_LEVEL
    },
    [APP_TYPE_KEYS.GENESIS]: {
      PROP_ROM, PROP_FORCE_PAL, PROP_3BUTTON, PROP_ZOOM_LEVEL
    },
    [APP_TYPE_KEYS.GENPLUSGX_MD]: {
      PROP_ROM, PROP_FORCE_PAL, PROP_ZOOM_LEVEL
    },
    [APP_TYPE_KEYS.GG]: {
      PROP_ROM, PROP_ZOOM_LEVEL
    },
    [APP_TYPE_KEYS.GENPLUSGX_GG]: {
      PROP_ROM, PROP_ZOOM_LEVEL
    },
    [APP_TYPE_KEYS.SMS]: {
      PROP_ROM, PROP_FORCE_PAL, PROP_SMS_HW_TYPE, PROP_FORCE_YM2413, PROP_ZOOM_LEVEL
    },
    [APP_TYPE_KEYS.GENPLUSGX_SMS]: {
      PROP_ROM, PROP_FORCE_PAL, PROP_SMS_HW_TYPE, PROP_FORCE_YM2413, PROP_ZOOM_LEVEL
    },
    [APP_TYPE_KEYS.SG1000]: {
      PROP_ROM, PROP_FORCE_PAL, PROP_ZOOM_LEVEL
    },
    [APP_TYPE_KEYS.GENPLUSGX_SG]: {
      PROP_ROM, PROP_FORCE_PAL, PROP_ZOOM_LEVEL
    },
    [APP_TYPE_KEYS.DOOM]: {
      PROP_DOOM_GAME
    },
    [APP_TYPE_KEYS.PRBOOM]: {
      PROP_DOOM_GAME
    },
    [APP_TYPE_KEYS.GBA]: {
      PROP_ROM, PROP_ROTATION, PROP_RTC, PROP_MIRRORING, PROP_SAVE_TYPE, PROP_FLASH_SIZE, PROP_DISABLE_LOOKUP, PROP_ZOOM_LEVEL
    },
    [APP_TYPE_KEYS.VBA_M_GBA]: {
      PROP_ROM, PROP_ROTATION, PROP_RTC, PROP_MIRRORING, PROP_SAVE_TYPE, PROP_FLASH_SIZE, PROP_DISABLE_LOOKUP, PROP_ZOOM_LEVEL
    },
    [APP_TYPE_KEYS.GB]: {
      PROP_ROM, PROP_GB_HW_TYPE, PROP_GB_COLORS, PROP_GB_PALETTE, PROP_GB_BORDER, PROP_ZOOM_LEVEL
    },
    [APP_TYPE_KEYS.VBA_M_GB]: {
      PROP_ROM, PROP_GB_HW_TYPE, PROP_GB_COLORS, PROP_GB_PALETTE, PROP_GB_BORDER, PROP_ZOOM_LEVEL
    },
    [APP_TYPE_KEYS.GBC]: {
      PROP_ROM, PROP_ZOOM_LEVEL
    },
    [APP_TYPE_KEYS.VBA_M_GBC]: {
      PROP_ROM, PROP_ZOOM_LEVEL
    },
    [APP_TYPE_KEYS.N64]: {
      PROP_ROM, PROP_ZOOM_LEVEL
    },
    [APP_TYPE_KEYS.PARALLEL_N64]: {
      PROP_ROM, PROP_ZOOM_LEVEL
    },
    [APP_TYPE_KEYS.PCE]: {
      PROP_ROM, PROP_6BUTTON, PROP_MAP_RUN_SELECT, PROP_ZOOM_LEVEL
    },
    [APP_TYPE_KEYS.MEDNAFEN_PCE]: {
      PROP_ROM, PROP_6BUTTON, PROP_MAP_RUN_SELECT, PROP_ZOOM_LEVEL
    },
    [APP_TYPE_KEYS.SGX]: {
      PROP_ROM, PROP_6BUTTON, PROP_ZOOM_LEVEL
    },
    [APP_TYPE_KEYS.MEDNAFEN_SGX]: {
      PROP_ROM, PROP_6BUTTON, PROP_ZOOM_LEVEL
    },
    [APP_TYPE_KEYS.VB]: {
      PROP_ROM, PROP_ZOOM_LEVEL
    },
    [APP_TYPE_KEYS.MEDNAFEN_VB]: {
      PROP_ROM, PROP_ZOOM_LEVEL
    },
    [APP_TYPE_KEYS.NGC]: {
      PROP_ROM, PROP_LANGUAGE, PROP_ZOOM_LEVEL
    },
    [APP_TYPE_KEYS.MEDNAFEN_NGC]: {
      PROP_ROM, PROP_LANGUAGE, PROP_ZOOM_LEVEL
    },
    [APP_TYPE_KEYS.NGP]: {
      PROP_ROM, PROP_LANGUAGE, PROP_ZOOM_LEVEL
    },
    [APP_TYPE_KEYS.MEDNAFEN_NGP]: {
      PROP_ROM, PROP_LANGUAGE, PROP_ZOOM_LEVEL
    },
    [APP_TYPE_KEYS.WSC]: {
      PROP_ROM, PROP_ROTATED, PROP_LANGUAGE, PROP_ZOOM_LEVEL
    },
    [APP_TYPE_KEYS.MEDNAFEN_WSC]: {
      PROP_ROM, PROP_ROTATED, PROP_LANGUAGE, PROP_ZOOM_LEVEL
    },
    [APP_TYPE_KEYS.WS]: {
      PROP_ROM, PROP_ROTATED, PROP_LANGUAGE, PROP_ZOOM_LEVEL
    },
    [APP_TYPE_KEYS.MEDNAFEN_WS]: {
      PROP_ROM, PROP_ROTATED, PROP_LANGUAGE, PROP_ZOOM_LEVEL
    },
    [APP_TYPE_KEYS.LNX]: {
      PROP_ROM, PROP_ROTATION_LNX, PROP_ZOOM_LEVEL
    },
    [APP_TYPE_KEYS.MEDNAFEN_LNX]: {
      PROP_ROM, PROP_ROTATION_LNX, PROP_ZOOM_LEVEL
    },
    [APP_TYPE_KEYS.NEOGEO]: {
      PROP_ROM, PROP_ADDITIONAL_ROMS, PROP_VOL_ADJUST, PROP_NEOGEO_BIOS, PROP_NEOGEO_FORCE_AES, PROP_ZOOM_LEVEL
    },
    [APP_TYPE_KEYS.FBNEO_NEOGEO]: {
      PROP_ROM, PROP_ADDITIONAL_ROMS, PROP_VOL_ADJUST, PROP_NEOGEO_BIOS, PROP_NEOGEO_FORCE_AES, PROP_ZOOM_LEVEL
    },
    [APP_TYPE_KEYS.ARCADE_KONAMI]: {
      PROP_ROM, PROP_ADDITIONAL_ROMS, PROP_SAMPLES, PROP_VOL_ADJUST, PROP_PLAYER_ORDER, PROP_ZOOM_LEVEL
    },
    [APP_TYPE_KEYS.FBNEO_KONAMI]: {
      PROP_ROM, PROP_ADDITIONAL_ROMS, PROP_SAMPLES, PROP_VOL_ADJUST, PROP_PLAYER_ORDER, PROP_ZOOM_LEVEL
    },
    [APP_TYPE_KEYS.ARCADE]: {
      PROP_ROM, PROP_ADDITIONAL_ROMS, PROP_SAMPLES, PROP_VOL_ADJUST, PROP_PLAYER_ORDER, PROP_ZOOM_LEVEL
    },
    [APP_TYPE_KEYS.FBNEO_ARCADE]: {
      PROP_ROM, PROP_ADDITIONAL_ROMS, PROP_SAMPLES, PROP_VOL_ADJUST, PROP_PLAYER_ORDER, PROP_ZOOM_LEVEL
    },
    [APP_TYPE_KEYS.ARCADE_CAPCOM]: {
      PROP_ROM, PROP_ADDITIONAL_ROMS, PROP_SAMPLES, PROP_VOL_ADJUST, PROP_PLAYER_ORDER, PROP_ZOOM_LEVEL
    },
    [APP_TYPE_KEYS.FBNEO_CAPCOM]: {
      PROP_ROM, PROP_ADDITIONAL_ROMS, PROP_SAMPLES, PROP_VOL_ADJUST, PROP_PLAYER_ORDER, PROP_ZOOM_LEVEL
    },
    [APP_TYPE_KEYS.PSX]: {
      PROP_DISCS, PROP_ANALOG, PROP_MULTITAP, PROP_ZOOM_LEVEL, PROP_SKIP_BIOS, PROP_DISABLE_MEMCARD1, PROP_SBI
    },
    [APP_TYPE_KEYS.BEETLE_PSX]: {
      PROP_DISCS, PROP_ANALOG, PROP_MULTITAP, PROP_ZOOM_LEVEL, PROP_SKIP_BIOS, PROP_DISABLE_MEMCARD1, PROP_SBI
    },
    [APP_TYPE_KEYS.SEGACD]: {
      PROP_DISCS, PROP_ZOOM_LEVEL
    },
    [APP_TYPE_KEYS.RETRO_GENPLUSGX_SEGACD]: {
      PROP_DISCS, PROP_ZOOM_LEVEL
    },
    [APP_TYPE_KEYS.PCECD]: {
      PROP_DISCS, PROP_ZOOM_LEVEL, PROP_6BUTTON, PROP_MAP_RUN_SELECT, PROP_CUSTOM_BIOS
    },
    [APP_TYPE_KEYS.RETRO_PCE_FAST]: {
      PROP_DISCS, PROP_ZOOM_LEVEL, PROP_6BUTTON, PROP_MAP_RUN_SELECT, PROP_CUSTOM_BIOS
    },
    [APP_TYPE_KEYS.COLECO]: {
      PROP_ROM,  PROP_ZOOM_LEVEL, PROP_COLECO_CONTROLS_MODE
    },
    [APP_TYPE_KEYS.COLEM]: {
      PROP_ROM,  PROP_ZOOM_LEVEL, PROP_COLECO_CONTROLS_MODE
    },
    [APP_TYPE_KEYS.A5200]: {
      PROP_ROM, PROP_ZOOM_LEVEL, PROP_SWAP_CONTROLLERS, PROP_ANALOG, PROP_TWIN_STICK
    },
    [APP_TYPE_KEYS.AT5200]: {
      PROP_ROM, PROP_ZOOM_LEVEL, PROP_SWAP_CONTROLLERS, PROP_ANALOG, PROP_TWIN_STICK
    },
    [APP_TYPE_KEYS.RETRO_A5200]: {
      PROP_ROM, PROP_ZOOM_LEVEL, PROP_SWAP_CONTROLLERS, PROP_ANALOG, PROP_TWIN_STICK
    },
    [APP_TYPE_KEYS.PCFX]: {
      PROP_DISCS, PROP_ZOOM_LEVEL
    },
    [APP_TYPE_KEYS.BEETLE_PCFX]: {
      PROP_DISCS, PROP_ZOOM_LEVEL
    },
    [APP_TYPE_KEYS.NEOGEOCD]: {
      PROP_DISCS, PROP_ZOOM_LEVEL, PROP_SKIP_CD_LOADING, PROP_CD_SPEED_HACK, PROP_REGION
    },
    [APP_TYPE_KEYS.RETRO_NEOCD]: {
      PROP_DISCS, PROP_ZOOM_LEVEL, PROP_SKIP_CD_LOADING, PROP_CD_SPEED_HACK, PROP_REGION
    },
    [APP_TYPE_KEYS.THREEDO]: {
      PROP_DISCS, PROP_ZOOM_LEVEL, PROP_3DO_HACK
    },
    [APP_TYPE_KEYS.RETRO_OPERA]: {
      PROP_DISCS, PROP_ZOOM_LEVEL, PROP_3DO_HACK
    },
    [APP_TYPE_KEYS.RETRO_YABAUSE]: {
      PROP_DISCS, PROP_ZOOM_LEVEL
    },
    [APP_TYPE_KEYS.SATURN]: {
      PROP_DISCS, PROP_ZOOM_LEVEL
    },
    [APP_TYPE_KEYS.QUAKE]: {
      PROP_ARCHIVE, PROP_ZOOM_LEVEL, PROP_WAD_SELECTOR
    },
    [APP_TYPE_KEYS.TYRQUAKE]: {
      PROP_ARCHIVE, PROP_ZOOM_LEVEL, PROP_WAD_SELECTOR
    },
    [APP_TYPE_KEYS.DOS]: {
      PROP_ARCHIVE, PROP_ZOOM_LEVEL, PROP_AUTO_START_PATH, PROP_DOS_CONTROLLER_MODE, PROP_MOUSE_SPEED
    },
    [APP_TYPE_KEYS.RETRO_DOSBOX_PURE]: {
      PROP_ARCHIVE, PROP_ZOOM_LEVEL, PROP_AUTO_START_PATH, PROP_DOS_CONTROLLER_MODE, PROP_MOUSE_SPEED
    },
    [APP_TYPE_KEYS.SCUMM]: {
      PROP_ARCHIVE, PROP_ZOOM_LEVEL
    },
    [APP_TYPE_KEYS.SCUMMVM]: {
      PROP_ARCHIVE, PROP_ZOOM_LEVEL
    },
    [APP_TYPE_KEYS.NDS]: {
      PROP_ROM, PROP_ZOOM_LEVEL, PROP_SCREEN_LAYOUT, PROP_SCREEN_GAP, PROP_BOOK_MODE, PROP_DUAL_ANALOG, PROP_MICROPHONE
    },
    [APP_TYPE_KEYS.RETRO_MELONDS]: {
      PROP_ROM, PROP_ZOOM_LEVEL, PROP_SCREEN_LAYOUT, PROP_SCREEN_GAP, PROP_BOOK_MODE, PROP_DUAL_ANALOG, PROP_MICROPHONE
    },
    [APP_TYPE_KEYS.RETRO_PARALLEL_N64]: {
      PROP_ROM, PROP_ZOOM_LEVEL
    },
  }
};

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
          // Archive
          if (hasProp(object, PROP_ARCHIVE)) {
            validator.checkMinLength(tabIndex, PROP_ARCHIVE, object.props.archive);
          }
        }
      );
    }
  }, [addValidateCallback, object, tabIndex, validator]);

  const showGbColors = object.props.hwType !== 1 && object.props.hwType !== 4;

  // console.log(object)

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
      {hasProp(object, PROP_ARCHIVE) ? (
        <div>
          <EditorUrlField
            required
            sx={{ width: '50ch' }}
            label="Package Archive or Package Manifest (URL)"
            // helperText="(.zip file containing the contents)"
            onDropText={(text) => {
              const props = { ...object.props, archive: text }
              setObject({ ...object, props })
            }}
            onChange={(e) => {
              const props = { ...object.props, archive: e.target.value }
              setObject({ ...object, props })
            }}
            value={Util.asString(object.props.archive)}
            error={!validator.isValid(tabIndex, PROP_ARCHIVE)}
          />
        </div>
      ) : null}
      {hasProp(object, PROP_WAD_SELECTOR) ? (
        <div>
          <WadSelector object={object} setObject={setObject}/>
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
              let urls = Util.splitLines(val);
              //urls = Util.removeEmptyItems(urls);
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
      {hasProp(object, PROP_DISCS) ? (
        <div>
          <EditorMultiUrlField
            label="Discs (URLs)"
            rows={3}
            onDropText={(text) => {
              let urls = object.props.discs ? object.props.discs : [];
              if (Array.isArray(text)) {
                urls.push(...text);
              } else {
                urls.push(text);
              }
              urls = Util.removeEmptyItems(urls);
              const props = { ...object.props, discs: urls }
              if (urls.length === 0) {
                delete props.discs;
              }
              setObject({ ...object, props })
            }}
            onChange={(e) => {
              const val = e.target.value;
              let urls = Util.splitLines(val);
              //urls = Util.removeEmptyItems(urls);
              const props = { ...object.props, discs: urls }
              if (urls.length === 0) {
                delete props.discs;
              }
              setObject({ ...object, props })
            }}
            value={object.props.discs && object.props.discs.length > 0 ?
              object.props.discs.join("\n") : ""}
          />
        </div>
      ) : null}
      {hasProp(object, PROP_MEDIA) ? (
        <div>
          <EditorMultiUrlField
            label="Media (URLs)"
            rows={4}
            onDropText={(text) => {
              let urls = object.props.media ? object.props.media : [];
              if (Array.isArray(text)) {
                urls.push(...text);
              } else {
                urls.push(text);
              }
              urls = Util.removeEmptyItems(urls);
              const props = { ...object.props, media: urls }
              if (urls.length === 0) {
                delete props.media;
              }
              setObject({ ...object, props })
            }}
            onChange={(e) => {
              const val = e.target.value;
              let urls = Util.splitLines(val);
              //urls = Util.removeEmptyItems(urls);
              const props = { ...object.props, media: urls }
              if (urls.length === 0) {
                delete props.media;
              }
              setObject({ ...object, props })
            }}
            value={object.props.media && object.props.media.length > 0 ?
              object.props.media.join("\n") : ""}
          />
        </div>
      ) : null}
      {hasProp(object, PROP_SBI) ? (
        <div>
          <EditorMultiUrlField
            label="SBI Files (URLs)"
            rows={3}
            onDropText={(text) => {
              let urls = object.props.sbi ? object.props.sbi : [];
              if (Array.isArray(text)) {
                urls.push(...text);
              } else {
                urls.push(text);
              }
              urls = Util.removeEmptyItems(urls);
              const props = { ...object.props, sbi: urls }
              if (urls.length === 0) {
                delete props.sbi;
              }
              setObject({ ...object, props })
            }}
            onChange={(e) => {
              const val = e.target.value;
              let urls = Util.splitLines(val);
              //urls = Util.removeEmptyItems(urls);
              const props = { ...object.props, sbi: urls }
              if (urls.length === 0) {
                delete props.sbi;
              }
              setObject({ ...object, props })
            }}
            value={object.props.sbi && object.props.sbi.length > 0 ?
              object.props.sbi.join("\n") : ""}
          />
        </div>
      ) : null}
      {hasProp(object, PROP_CUSTOM_BIOS) ? (
        <div>
          <EditorUrlField
            sx={{ width: '50ch' }}
            label="Custom BIOS (optional)"
            onDropText={(text) => {
              const props = { ...object.props, customBios: text }
              setObject({ ...object, props })
            }}
            onChange={(e) => {
              const props = { ...object.props, customBios: e.target.value }
              setObject({ ...object, props })
            }}
            value={Util.asString(object.props.customBios)}
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
      {hasProp(object, PROP_ZOOM_LEVEL) ? (
        <div>
          <ZoomLevel
            value={object.props.zoomLevel ? object.props.zoomLevel : 0}
            onChange={(e, val) => {
              // Allows for smoother updated prior to change being committed
              object.props.zoomLevel = parseInt(val);
            }}
            onChangeCommitted={(e, val) => {
              const props = { ...object.props, zoomLevel: parseInt(val) }
              setObject({ ...object, props })
            }} />
        </div>
      ) : null}
      {hasProp(object, PROP_AUTO_START_PATH) ? (
        <div>
          <EditorTextField
            sx={{ width: '50ch' }}
            label="Auto-Start Path"
            onDropText={(text) => {
              const props = { ...object.props, autoStartPath: text }
              setObject({ ...object, props })
            }}
            onChange={(e) => {
              const props = { ...object.props, autoStartPath: e.target.value }
              setObject({ ...object, props })
            }}
            value={Util.asString(object.props.autoStartPath)}
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
      {hasProp(object, PROP_DISABLE_AUTOLOAD) ? (
        <div>
          <EditorSwitch
            label="Disable Autoload"
            tooltip="Whether to disable media auto-loading."
            onChange={(e) => {
              const props = { ...object.props, disableAutoload: e.target.checked }
              setObject({ ...object, props })
            }}
            checked={Util.asBoolean(object.props.disableAutoload)}
          />
        </div>
      ) : null}
      {hasProp(object, PROP_DISABLE_TDE) ? (
        <div>
          <EditorSwitch
            label="Disable True Drive Emulation"
            tooltip="Whether to disable true drive emulation."
            onChange={(e) => {
              const props = { ...object.props, disableTrueDriveEmulation: e.target.checked }
              setObject({ ...object, props })
            }}
            checked={Util.asBoolean(object.props.disableTrueDriveEmulation)}
          />
        </div>
      ) : null}
      {hasProp(object, PROP_COLECO_CONTROLS_MODE) ? (
        <div>
          <EditorSelect
            label="Controller"
            tooltip="The controller type to use for the game"
            value={object.props.controlsMode ? object.props.controlsMode : 0}
            menuItems={[
              { value: 0, name: "Standard" },
              { value: 1, name: "Super Action" },
              { value: 2, name: "Driving" },
              { value: 3, name: "Roller" },
            ]}
            onChange={(e) => {
              const value = e.target.value;
              const props = { ...object.props, controlsMode: value }
              props.mappings = {
                "a": "firel",
                "b": "firer",
              };
              if (value === 3 /* Roller */) {
                props.mappings = {
                  "a": "firel2",
                  "b": "firer2",
                  "x": "firel",
                  "y": "firer"
                }
              } else if (value === 1 /* Super Action*/) {
                props.mappings =  {
                  "a": "firel",
                  "b": "firer",
                  "x": "purple",
                  "y": "blue"
                }
              }
              setObject({ ...object, props })
            }}
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
      {hasProp(object, PROP_MAP_RUN_SELECT) && !object.props.pad6button ? (
        <div>
          <EditorSwitch
            label="Map RUN/SELECT to Buttons"
            tooltip="Whether to map RUN and SELECT to standard buttons."
            onChange={(e) => {
              const props = { ...object.props, mapRunSelect: e.target.checked }
              setObject({ ...object, props })
            }}
            checked={Util.asBoolean(object.props.mapRunSelect)}
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
      {hasProp(object, PROP_REGION) ? (
        <div>
          <EditorSelect
            label="Region"
            tooltip="The region of the console."
            value={object.props.region ? object.props.region : 0}
            menuItems={[
              { value: 0, name: "United States" },
              { value: 1, name: "Japan" },
              { value: 2, name: "Europe" }
            ]}
            onChange={(e) => {
              const props = { ...object.props, region: e.target.value }
              setObject({ ...object, props })
            }}
          />
        </div>
      ) : null}
      {hasProp(object, PROP_REGION_AUTO) ? (
        <div>
          <EditorSelect
            label="Region"
            tooltip="The region of the game."
            value={object.props.region ? object.props.region : 0}
            menuItems={[
              { value: 0, name: "(auto)" },
              { value: 1, name: "NTSC" },
              { value: 2, name: "PAL" }
            ]}
            onChange={(e) => {
              const props = { ...object.props, region: e.target.value }
              setObject({ ...object, props })
            }}
          />
        </div>
      ) : null}
      {hasProp(object, PROP_DOS_CONTROLLER_MODE) ? (
        <div>
          <EditorSelect
            label="Controller Mode (Initial)"
            tooltip="The initial mode for the controller"
            value={object.props.controllerMode ? object.props.controllerMode : 0}
            menuItems={[
              { value: 0, name: "Gamepad" },
              { value: 1, name: "Mouse" },
            ]}
            onChange={(e) => {
              const props = { ...object.props, controllerMode: e.target.value }
              setObject({ ...object, props })
            }}
          />
        </div>
      ) : null}
      {hasProp(object, PROP_MOUSE_SPEED) ? (
        <div>
          <MouseSpeed
            value={object.props.mouseSpeed ? object.props.mouseSpeed : 0}
            onChange={(e, val) => {
              // Allows for smoother updated prior to change being committed
              object.props.mouseSpeed = parseInt(val);
            }}
            onChangeCommitted={(e, val) => {
              const props = { ...object.props, mouseSpeed: parseInt(val) }
              setObject({ ...object, props })
            }} />
        </div>
      ) : null}
      {hasProp(object, PROP_JIFFYDOS) ? (
        <div>
          <EditorSelect
            label="Use JiffyDOS"
            tooltip="Whether to use JiffyDOS (if the bios files are available)."
            value={object.props.jiffydos ? object.props.jiffydos : 0}
            menuItems={[
              { value: 0, name: "(auto)" },
              { value: 1, name: "Disabled" },
            ]}
            onChange={(e) => {
              const props = { ...object.props, jiffydos: e.target.value }
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
      {hasProp(object, PROP_DISABLE_LOOKUP) ? (
        <div>
          <EditorSwitch
            label="Disable Game Lookup"
            tooltip="Whether to lookup the game and use the settings (if found)."
            onChange={(e) => {
              const props = { ...object.props, disableLookup: e.target.checked }
              setObject({ ...object, props })
            }}
            checked={Util.asBoolean(object.props.disableLookup)}
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
      {hasProp(object, PROP_ANALOG) ? (
        <div>
          <EditorSwitch
            label="Analog mode"
            tooltip="Whether to enable analog mode on the controllers."
            onChange={(e) => {
              const props = { ...object.props, analog: e.target.checked }
              setObject({ ...object, props })
            }}
            checked={Util.asBoolean(object.props.analog)}
          />
        </div>
      ) : null}
      {hasProp(object, PROP_TWIN_STICK) ? (
        <div>
          <EditorSwitch
            label="Twin stick"
            tooltip="Whether to enable twin stick style controls."
            onChange={(e) => {
              const props = { ...object.props, twinStick: e.target.checked }
              setObject({ ...object, props })
            }}
            checked={Util.asBoolean(object.props.twinStick)}
          />
        </div>
      ) : null}
      {hasProp(object, PROP_MULTITAP) ? (
        <div>
          <EditorSwitch
            label="Multitap"
            tooltip="Whether to use a Multitap adapter."
            onChange={(e) => {
              const props = { ...object.props, multitap: e.target.checked }
              setObject({ ...object, props })
            }}
            checked={Util.asBoolean(object.props.multitap)}
          />
        </div>
      ) : null}
      {hasProp(object, PROP_SKIP_BIOS) ? (
        <div>
          <EditorSwitch
            label="Skip BIOS"
            tooltip="Whether to skip the BIOS animation normally displayed with starting a game."
            onChange={(e) => {
              const props = { ...object.props, skipBios: e.target.checked }
              setObject({ ...object, props })
            }}
            checked={Util.asBoolean(object.props.skipBios)}
          />
        </div>
      ) : null}
      {hasProp(object, PROP_DISABLE_MEMCARD1) ? (
        <div>
          <EditorSwitch
            label="Disable memory card 1"
            tooltip="Whether to disable the use of memory card 1 (memory card 0 will still be available)."
            onChange={(e) => {
              const props = { ...object.props, disableMemCard1: e.target.checked }
              setObject({ ...object, props })
            }}
            checked={Util.asBoolean(object.props.disableMemCard1)}
          />
        </div>
      ) : null}
      {hasProp(object, PROP_SKIP_CD_LOADING) ? (
        <div>
          <EditorSwitch
            label="Skip CD loading"
            tooltip="Auto fast forwards CD loading sequences."
            onChange={(e) => {
              const props = { ...object.props, skipCdLoading: e.target.checked }
              setObject({ ...object, props })
            }}
            checked={Util.asBoolean(object.props.skipCdLoading)}
          />
        </div>
      ) : null}
      {hasProp(object, PROP_CD_SPEED_HACK) ? (
        <div>
          <EditorSwitch
            label="CD speed hack"
            tooltip="Modifies the CD-ROM BIOS to perform faster (helpful for less powerful devices)."
            onChange={(e) => {
              const props = { ...object.props, cdSpeedHack: e.target.checked }
              setObject({ ...object, props })
            }}
            checked={Util.asBoolean(object.props.cdSpeedHack)}
          />
        </div>
      ) : null}
      {hasProp(object, PROP_3DO_HACK) ? (
        <div>
          <EditorSelect
            label="Hack"
            tooltip="The hack to apply to the game."
            value={object.props.hack ? object.props.hack : 0}
            menuItems={[
              { value: 0, name: "(None)" },
              { value: 4, name: "Alone in the Dark" },
              { value: 1, name: "Crash 'n Burn" },
              { value: 2, name: "Dinopark Tycoon" },
              { value: 3, name: "Microcosm" },
              { value: 5, name: "Samurai Shodown" },
            ]}
            onChange={(e) => {
              const props = { ...object.props, hack: e.target.value }
              setObject({ ...object, props })
            }}
          />
        </div>
      ) : null}
      {hasProp(object, PROP_SAVE_DISKS) ? (
        <div>
          <EditorSelect
            label="Save Disks"
            tooltip="The quantity of save disks."
            value={object.props.saveDisks ? object.props.saveDisks : 0}
            menuItems={[
              { value: 0, name: "(none)" },
              { value: 1, name: "One" },
              { value: 2, name: "Two" },
              { value: 3, name: "Three" },
              { value: 4, name: "Four" },
            ]}
            onChange={(e) => {
              const props = { ...object.props, saveDisks: e.target.value }
              setObject({ ...object, props })
            }}
          />
        </div>
      ) : null}
      {hasProp(object, PROP_C64_RAM_EXPANSION) ? (
        <div>
          <EditorSelect
            label="Ram Expansion"
            tooltip="Whether the RAM should be expanded."
            value={object.props.ramExpansion ? object.props.ramExpansion : 0}
            menuItems={[
              { value: 0, name: "(none)" },
              { value: 1, name: "128kB (1700)" },
              { value: 2, name: "256kB (1764)" },
              { value: 3, name: "512kB (1750)" },
              { value: 4, name: "1024kB" },
              { value: 5, name: "2048kB" },
              { value: 6, name: "4096kB" },
              { value: 7, name: "8192kB" },
              { value: 8, name: "16384kB" },
            ]}
            onChange={(e) => {
              const props = { ...object.props, ramExpansion: e.target.value }
              setObject({ ...object, props })
            }}
          />
        </div>
      ) : null}
      {hasProp(object, PROP_SCREEN_LAYOUT) ? (
        <div>
          <EditorSelect
            label="Screen Layout"
            tooltip="The layout for the DS screens."
            value={object.props.screenLayout ? object.props.screenLayout : "default"}
            menuItems={[
              { value: "default", name: "(default)" },
              { value: "left-right", name: "Left-Right" },
              { value: "right-left", name: "Right-Left" },
              { value: "top-bottom", name: "Top-Bottom" },
              { value: "bottom-top", name: "Bottom-Top" },
              { value: "top-only", name: "Top-Only" },
              { value: "bottom-only", name: "Bottom-Only" },
            ]}
            onChange={(e) => {
              const props = { ...object.props, screenLayout: e.target.value }
              setObject({ ...object, props })
            }}
          />
        </div>
      ) : null}
      {hasProp(object, PROP_SCREEN_GAP) ? (
        <div>
          <EditorSwitch
            label="Screen Gap"
            tooltip="Whether to have a gap between the DS screens."
            onChange={(e) => {
              const props = { ...object.props, screenGap: e.target.checked }
              setObject({ ...object, props })
            }}
            checked={Util.asBoolean(object.props.screenGap)}
          />
        </div>
      ) : null}
      {hasProp(object, PROP_BOOK_MODE) ? (
        <div>
          <EditorSwitch
            label="Book Mode"
            tooltip="Whether to orient the DS in book mode."
            onChange={(e) => {
              const props = { ...object.props, bookMode: e.target.checked }
              setObject({ ...object, props })
            }}
            checked={Util.asBoolean(object.props.bookMode)}
          />
        </div>
      ) : null}
      {hasProp(object, PROP_MICROPHONE) ? (
        <div>
          <EditorSwitch
            label="Microphone Supported"
            tooltip="Whether the game supports the use of a microphone."
            onChange={(e) => {
              const props = { ...object.props, microphone: e.target.checked }
              setObject({ ...object, props })
            }}
            checked={Util.asBoolean(object.props.microphone)}
          />
        </div>
      ) : null}
      {hasProp(object, PROP_DUAL_ANALOG) ? (
        <div>
          <EditorSwitch
            label="Dual Analog (Stylus)"
            tooltip="Whether the game uses the stylus to mimic dual-analog support."
            onChange={(e) => {
              const props = { ...object.props, dualAnalog: e.target.checked }
              setObject({ ...object, props })
            }}
            checked={Util.asBoolean(object.props.dualAnalog)}
          />
        </div>
      ) : null}
    </EditorTabPanel>
  );
}

