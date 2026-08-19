// Default per-game controller mappings for Atari Jaguar CD.
//
// Jaguar CD shares the exact same emulator as cartridge Jaguar (see
// applist.js -- RETRO_VIRTUAL_JAGUAR_CD points at the same
// webrcade-app-retro-virtual-jaguar core), so the numpad-mapping/keypad-
// description shape here is identical to mappings/jaguar.js. The
// difference is purely how games are identified: Jaguar CD titles have
// no ROM file to hash, so they're catalogued in roms.json's "jaguarcd"
// section by stable sequential ID ("jaguarcd:N") instead of MD5.
//
// Wired into both GameRegistry.js's find() (picking a title from the
// editor's own Autocomplete dropdown, which calls find("jaguarcd:N")
// directly, same as a cartridge hash lookup) and
// getMetaDataByMediaTitle() (the title-matched path used by drag-drop
// .cdi import via UrlProcessor's _buildGame(), and the Resolve Type
// dialog via LocalFileProcessor.js).

// Must stay in sync with the identical DEFAULT_MAPPINGS in
// mappings/jaguar.js, emulator/index.js's constructor, and
// ItemEditor.js's setDefaultForJaguar().
const DEFAULT_MAPPINGS = {
  "x": "firec",
  "a": "fireb",
  "b": "firea",
  "y": "8",
  "lb": "7",
  "rb": "9",
  "lt": "4",
  "rt": "6",
};

const DEFAULT_DESCRIPTIONS = {};

// Keyed by the stable "jaguarcd:N" ID from roms.json's "jaguarcd"
// section (not a hash -- there's no ROM file to hash for a CD title).
// Same validation discipline as mappings/jaguar.js: only added once
// confirmed against an actual overlay scan, unlabeled keys left out
// rather than guessed at.

// Blue Lightning -- confirmed against the physical overlay scan for
// 1/2/3 (Afterburner/Cruise/Air Brake) and */0/# (Reset/Music On-Off/
// Reset). The overlay also has a "TOGGLE COCKPIT VIEW" row, but its
// physical position (4/5/6 vs 7/8/9) isn't clear on this scan -- left
// out entirely rather than guessing which row it belongs to.
const BLUE_LIGHTNING_DESC = {
  "1": "Afterburner", "2": "Cruise", "3": "Air Brake",
  "0": "Music On/Off", "*": "Reset", "#": "Reset",
};

// Battlemorph -- confirmed against the physical overlay scan, and 7/9/
// reset cross-checked against the manual text on atariage.com's
// Battlemorph page: "Button 9 selects view mode", "Button 7 toggles
// cross hair", "press the * and # buttons [simultaneously] to go back to
// the beginning". Unlike Iron Soldier's ambiguous shared caption, this
// one is explicitly confirmed as a real simultaneous-press combo, not
// two independent Reset buttons -- current keypad architecture (single
// active-key slot) can't actually send both at once yet, see
// project_jaguar_port_todo memory for the "hold one, roll to the other,
// then confirm" idea floated for a future fix.
const BATTLEMORPH_DESC = {
  "1": "Weapon Bay A", "2": "Twin Shot", "3": "Weapon Bay B",
  "4": "Weapon Bay C", "5": "Top View (Close)", "6": "Weapon Bay D",
  "7": "Cross Hair", "8": "Top View (Far)", "9": "Toggle Views",
  "0": "Music", "*": "Reset (with #)", "#": "Reset (with *)",
};

// Baldies -- confirmed against the physical overlay scan. 9 has two
// printed lines describing the same key's behavior depending on whether
// a fire button is held alongside it ("X = Go To Location" alone, "X +
// [fire] = Mark Location"), folded into one label. # shows an icon only,
// no caption text, left out.
const BALDIES_DESC = {
  "1": "Worker", "2": "Angel Wings", "3": "Flag",
  "4": "Builder", "5": "Shovel", "6": "Hand",
  "7": "Soldier", "8": "Zoom In/Out", "9": "Go To Location (Mark Location with fire)",
  "*": "Scientist", "0": "Music On/Off",
};

const GAME_MAPPINGS = {
  // Blue Lightning
  "jaguarcd:10": { _name: "Blue Lightning", descriptions: BLUE_LIGHTNING_DESC },

  // Baldies
  "jaguarcd:6": { _name: "Baldies", descriptions: BALDIES_DESC },

  // Battlemorph
  "jaguarcd:7": { _name: "Battlemorph", descriptions: BATTLEMORPH_DESC },
};

/**
 * Resolve the effective mappings/descriptions/disableFastBlitter for a
 * Jaguar CD title -- the platform-wide default, with any per-title
 * override (by the stable "jaguarcd:N" ID) layered on top. Always
 * returns a usable object, even for a completely unrecognized ID.
 */
export function getJaguarCdMappings(id) {
  const override = (id && GAME_MAPPINGS[id]) || {};
  return {
    mappings: { ...DEFAULT_MAPPINGS, ...(override.mappings || {}) },
    descriptions: { ...DEFAULT_DESCRIPTIONS, ...(override.descriptions || {}) },
    disableFastBlitter: override.disableFastBlitter === true,
  };
}
