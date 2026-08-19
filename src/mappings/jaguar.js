// Default per-game controller mappings for Atari Jaguar.
//
// Every Jaguar game needs *some* numpad mapping to be playable via the
// on-screen keypad -- unlike systems where mappings only cover bonus/
// special controls (see ../props/A5200Props.json), Jaguar's a/b/x/y/lb/
// rb/lt/rt buttons have no hardcoded function of their own (see
// MAPPABLE_BUTTONS in webrcade-app-retro-virtual-jaguar/src/emulator/
// index.js) -- so an unmapped game is unplayable, not just missing a
// convenience shortcut.
//
// DEFAULT_MAPPINGS/DEFAULT_DESCRIPTIONS apply to every Jaguar game.
// GAME_MAPPINGS, keyed by ROM MD5 hash, layers a per-game override on
// top for titles that need something different from the default --
// same shape as A5200Props.json's per-game entries, just merged with a
// base instead of standing alone.
//
// Mapping target shape (props.mappings[button] = target) matches the
// editor's own Jaguar Mappings tab exactly: target is either a real
// controller function (see REAL_BUTTON_TARGETS in emulator/index.js --
// "firea"/"fireb"/"firec"/"option"/"pause") or a numpad key ("1"-"9",
// "0", "*", "#").

// Must stay in sync with the other two copies of this exact default:
// webrcade-app-retro-virtual-jaguar/src/emulator/index.js's constructor
// (fallback when app.mappings is empty) and ItemEditor.js's
// setDefaultForJaguar() (pre-fills a new item in the editor). Matches
// the real Jaguar Pro Controller's own convention: base row (A/B/C) are
// real fire buttons, the Pro's bonus row (X/Y/Z) and the shoulder
// triggers are keypad shortcuts rather than extra fire functions --
// x/a/b -> Fire C/B/A still matches genplusgx's (Genesis) own X/A/B ->
// A/B/C convention for a 3-button layout on a 4-button gamepad.
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

// Keyed by ROM MD5 hash (looked up from webrcade/public/roms.json's
// "jaguar" section by title -- no ROM files needed). Descriptions are
// sourced from the physical keypad overlays these games shipped with,
// validated directly against a user-supplied scan of the actual overlay
// before being added here. A key is only present if it has a visible
// label on the overlay -- unlabeled keys are left out rather than
// guessed at. Entries can also set disableFastBlitter: true for games
// that don't render correctly with the fast blitter (see
// applyGameSettings()/getUseRealBios() precedent in emulator/index.js --
// same idea, a props-driven default that ships with the game instead of
// requiring the user to find the Testing tab and flip it manually).
//
// Several well-known overlay titles (Battlemorph, Baldies, Blue
// Lightning, Hover Strike: Unconquered Lands) are catalogued in
// roms.json under "jaguarcd" with sequential IDs, not MD5 hashes --
// Jaguar CD is title-matched (getMetaDataByMediaTitle), not hash-matched
// via find(), so they don't fit this MD5-keyed mechanism. Out of scope
// here, not forgotten.

// Wolfenstein 3D -- confirmed against the physical overlay scan. Most of
// the grid (4/5/6/7/9/*/#) has no label on the overlay and is left out.
const WOLFENSTEIN_3D_DESC = {
  "1": "Save Game 1", "2": "Save Game 2", "3": "Save Game 3",
  "8": "Map",
  "0": "Music",
};

// Trevor McFur in the Crescent Galaxy -- confirmed against the physical
// overlay scan. 0/*/# show only the plain key symbol, no text, and are
// left out.
const TREVOR_MCFUR_DESC = {
  "1": "Magnet", "2": "Tracer", "3": "Beam",
  "4": "Flash", "5": "Missile", "6": "Ring",
  "7": "Bolt", "8": "Shield", "9": "Cutter",
};

// Iron Soldier -- confirmed against the physical overlay scan. 5/8/0 have
// no individual label (the center column is one continuous block of text
// describing shoulder/hip/hand mount options, not per-key captions). *
// and # share a single "RESET" caption printed once between them -- the
// scan doesn't say whether both are required together or either works
// alone, so both are labeled the same rather than guessing at a combo.
const IRON_SOLDIER_DESC = {
  "1": "Right Shoulder", "2": "Advanced Controls", "3": "Left Shoulder",
  "4": "Right Hip", "6": "Left Hip",
  "7": "Right Hand", "9": "Left Hand",
  "*": "Reset", "#": "Reset",
};

// Hover Strike -- confirmed against the physical overlay scan. The
// overlay also captions the real Option button ("OPTION: Select
// Alternate Weapon"), so that's included too via the "option" real-
// button-target key, same lookup the Mappings tab and pause-screen help
// text both already use for firea/fireb/firec/option/pause.
const HOVER_STRIKE_DESC = {
  "1": "Launch", "2": "Lock-On", "3": "Launch",
  "4": "Radar/Compass", "5": "Cycle Lock-On", "6": "Radar/Compass",
  "7": "External Camera", "8": "Camera Adjust", "9": "External Camera",
  "0": "Music", "*": "Reset", "#": "Reset",
  "option": "Select Alternate Weapon",
};

// Doom -- confirmed against the physical overlay scan. 8 is the game's
// own logo printed in the center of the grid, not a function. 0/*/# are
// blank on this scan (unlike Wolfenstein/Hover Strike, no music-note icon
// here), so left out rather than assumed.
const DOOM_DESC = {
  "1": "Fist / Chainsaw", "2": "Pistol", "3": "Shotgun",
  "4": "Chaingun", "5": "Rocket Launcher", "6": "Plasma Rifle",
  "7": "BFG 9000", "9": "Map",
};

// Cybermorph -- confirmed against the physical overlay scan. * and # are
// blank (plain symbols, no text) -- "Music" is only under 0.
const CYBERMORPH_DESC = {
  "1": "Super Weapon", "2": "Super Weapon", "3": "Super Weapon",
  "4": "Toggle", "5": "Forward View", "6": "Cockpit View",
  "7": "Left View", "8": "Rear View", "9": "Right View",
  "0": "Music",
};

// Alien vs Predator -- 1-4 confirmed against the physical overlay scans
// (three separate overlays, one per playable character) for which keys
// have icons at all; the actual weapon/ability names come from a full
// control-reference FAQ (https://gamefaqs.gamespot.com/jaguar/586871-
// alien-vs-predator/faqs/62711/), cross-checked against a manual scan
// (archive.org/details/avp-jag) for 1-5 Marine/Predator specifically.
// Went through two rounds of correction against that FAQ: Alien has NO
// numpad weapon/attack keys at all (its A/B/C real buttons are Claw/
// Bite/Tail attack -- an earlier draft misattributed those to numpad
// 1/2/3, which was wrong) and Invisibility is the real Option button,
// not numpad 0 (a manual scan's HUD-legend numbering was misread as a
// keypad digit reference). 6/7/8/9/*/# apply to all three characters
// identically; 1-4 differ per character (Alien has none); 5/6 are
// Predator-only. * and # are FAQ-confirmed as a genuine simultaneous-
// press combo ("Numpad * + # = Reset Game"), not two independent
// buttons -- current keypad architecture can't actually send both at
// once yet, see project_jaguar_port_todo memory. 1-4 drop the per-side
// "(Marine)"/"(Predator)" tags that 5/6/option still carry -- the two
// weapon names are already unambiguous on their own, and the character
// callout was mostly just eating space in the Mappings tab dropdown.
const ALIEN_VS_PREDATOR_DESC = {
  "1": "Shotgun / Combi Stick",
  "2": "Pulse Rifle / Shoulder Cannon",
  "3": "Flame Thrower / Smart Disk",
  "4": "Smart Gun / Wrist Blades",
  "5": "Health Pak, hold (Predator)",
  "6": "Multispectrum Filter (Predator)",
  "7": "Strafe Left", "8": "Map", "9": "Strafe Right",
  "*": "Reset (with #)", "#": "Reset (with *)",
  "option": "Toggle Invisibility (Predator)",
};

const GAME_MAPPINGS = {
  // Alien vs Predator (World)
  "96bc77cfd1b2df85b5e6ae05594e74b0": { _name: "Alien vs Predator (World)", descriptions: ALIEN_VS_PREDATOR_DESC },
  "15d9864ce22a8786151928f5bf613b7b": { _name: "Alien vs Predator (World)", descriptions: ALIEN_VS_PREDATOR_DESC },
  "d126e7fa72c99ef92a132e4e1ce18b6c": { _name: "Alien vs Predator (World) (Beta)", descriptions: ALIEN_VS_PREDATOR_DESC },
  "bbb8efdd570d268f86a14e0893ba3e5f": { _name: "Alien vs Predator (World) (Beta)", descriptions: ALIEN_VS_PREDATOR_DESC },
  "750106d9ec9aa7fea0326eb3397755dd": { _name: "Alien vs Predator (World) (Beta)", descriptions: ALIEN_VS_PREDATOR_DESC },
  "8bdfc02f6542d95e3582db6757e33474": { _name: "Alien vs Predator (World) (Beta)", descriptions: ALIEN_VS_PREDATOR_DESC },
  "51ae6d493492ebf9ca3b3bd919e46fc4": { _name: "Alien vs Predator (World) (v0.93) (Beta)", descriptions: ALIEN_VS_PREDATOR_DESC },
  "2b299e92e82031a31235da74850670cf": { _name: "Alien vs Predator (World) (v0.93) (Beta)", descriptions: ALIEN_VS_PREDATOR_DESC },

  // Breakout 2000 -- disableFastBlitter: doesn't render correctly with
  // the fast blitter, needs the accurate one. No overlay data yet.
  "73a03ac854e2e87ee7ca1c42ef64a301": { _name: "Breakout 2000 (USA, Europe)", disableFastBlitter: true },
  "a4b4003c11b55d0b28aa34bb113bbde4": { _name: "Breakout 2000 (USA, Europe)", disableFastBlitter: true },
  "242d383c944c8649f57efe30f8a84215": { _name: "Breakout 2000 (USA, Europe) (Beta)", disableFastBlitter: true },
  "d1b1bfb5845a09467b7601ad103734ce": { _name: "Breakout 2000 (USA, Europe) (Beta)", disableFastBlitter: true },

  // Missile Command 3D -- disableFastBlitter: doesn't render correctly
  // with the fast blitter, needs the accurate one. No overlay data yet.
  "3dd8ee48afb83629c87ec0b6de790c25": { _name: "Missile Command 3D (World)", disableFastBlitter: true },
  "e50d123659dc2b56b23ac4d0be9e5e01": { _name: "Missile Command 3D (World)", disableFastBlitter: true },

  // Wolfenstein 3D -- disableFastBlitter: this game doesn't render
  // correctly with the fast blitter, needs the accurate one.
  "3584cb83461c8666a3f28ea0c431a3db": { _name: "Wolfenstein 3D (World)", descriptions: WOLFENSTEIN_3D_DESC, disableFastBlitter: true },
  "e95a5d4d625640c15c1ec376eba2abee": { _name: "Wolfenstein 3D (World)", descriptions: WOLFENSTEIN_3D_DESC, disableFastBlitter: true },

  // Cybermorph -- disableFastBlitter: same rendering issue as
  // Wolfenstein 3D, needs the accurate blitter.
  "0ad7cf284117042132e56b0a0a5af3e7": { _name: "Cybermorph (World) (Beta)", descriptions: CYBERMORPH_DESC, disableFastBlitter: true },
  "f7ccc865e2a84b2eb941209a86676bd6": { _name: "Cybermorph (World) (Beta)", descriptions: CYBERMORPH_DESC, disableFastBlitter: true },
  "1c2e3d172151dcae3b3fc9a23084dcf2": { _name: "Cybermorph (World) (Rev A)", descriptions: CYBERMORPH_DESC, disableFastBlitter: true },
  "63e7e435f13a5a20ca8a2bf6e40ac27b": { _name: "Cybermorph (World) (Rev A)", descriptions: CYBERMORPH_DESC, disableFastBlitter: true },
  "81dc55f1abaa89f4b3d510cb4c2e5fe8": { _name: "Cybermorph (World) (Rev B)", descriptions: CYBERMORPH_DESC, disableFastBlitter: true },
  "a2762624a57ea85875b7700aac07a61b": { _name: "Cybermorph (World) (Rev B)", descriptions: CYBERMORPH_DESC, disableFastBlitter: true },

  // Doom
  "3a5878ea3f391174becc37b037318804": { _name: "Doom (World)", descriptions: DOOM_DESC },
  "1e3b7dfe15e4911bb7331f352eed3c33": { _name: "Doom (World)", descriptions: DOOM_DESC },

  // Hover Strike -- disableFastBlitter: doesn't render correctly with
  // the fast blitter, needs the accurate one.
  "51d65ce8171daf0a255a30b44dac07cf": { _name: "Hover Strike (World)", descriptions: HOVER_STRIKE_DESC, disableFastBlitter: true },
  "545b4f36992de772d48a9f13491fb894": { _name: "Hover Strike (World)", descriptions: HOVER_STRIKE_DESC, disableFastBlitter: true },

  // Iron Soldier
  "e9aac34f010aae4d0c781a34975d2aaf": { _name: "Iron Soldier (World)", descriptions: IRON_SOLDIER_DESC },
  "c9a25d6aaa39972388b41d5509e630fb": { _name: "Iron Soldier (World)", descriptions: IRON_SOLDIER_DESC },

  // Trevor McFur in the Crescent Galaxy
  "bb04ea04aefa100d7e7f87f46db71f57": { _name: "Trevor McFur in the Crescent Galaxy (World)", descriptions: TREVOR_MCFUR_DESC },
  "84bfe188dd5424a709d217b2a13ce082": { _name: "Trevor McFur in the Crescent Galaxy (World)", descriptions: TREVOR_MCFUR_DESC },
  "4adc06af180e90d6f24d3f98096bbc3a": { _name: "Trevor McFur in the Crescent Galaxy (World) (Beta)", descriptions: TREVOR_MCFUR_DESC },
  "63ff8abf6bfcac1ccbfa504b235568c5": { _name: "Trevor McFur in the Crescent Galaxy (World) (Beta)", descriptions: TREVOR_MCFUR_DESC },
  "bafebcbf5a0973fcf5c130c56ffeabb2": { _name: "Trevor McFur in the Crescent Galaxy (World) (Rev A)", descriptions: TREVOR_MCFUR_DESC },
  "c6d92d3bd839c6aa301692b10d9efe76": { _name: "Trevor McFur in the Crescent Galaxy (World) (Rev A)", descriptions: TREVOR_MCFUR_DESC },
};

/**
 * Resolve the effective mappings/descriptions/disableFastBlitter for a
 * Jaguar ROM -- the platform-wide default, with any per-game override (by
 * MD5 hash) layered on top. Always returns a usable object, even for a
 * completely unrecognized hash.
 */
export function getJaguarMappings(md5) {
  const override = (md5 && GAME_MAPPINGS[md5]) || {};
  return {
    mappings: { ...DEFAULT_MAPPINGS, ...(override.mappings || {}) },
    descriptions: { ...DEFAULT_DESCRIPTIONS, ...(override.descriptions || {}) },
    disableFastBlitter: override.disableFastBlitter === true,
  };
}
