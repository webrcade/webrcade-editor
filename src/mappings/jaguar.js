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
// setDefaultForJaguar() (pre-fills a new item in the editor). x/a/b ->
// Fire C/B/A matches genplusgx's (Genesis) own X/A/B -> A/B/C convention
// for a 3-button layout on a 4-button gamepad; lb/rb -> Option covers
// the one hardcoded function every game needs. y/lt/rt are left as spare
// numpad-shortcut slots, same as the other two copies.
const DEFAULT_MAPPINGS = {
  "x": "firec",
  "a": "fireb",
  "b": "firea",
  // "y": "1",
  "lb": "option",
  "rb": "option",
  // "lt": "2",
  // "rt": "3",
};

const DEFAULT_DESCRIPTIONS = {};

// Keyed by ROM MD5 hash (looked up from webrcade/public/roms.json's
// "jaguar" section by title -- no ROM files needed). Descriptions only
// for now, no mappings overrides -- sourced from the physical keypad
// overlays these games shipped with (user-supplied scan) cross-checked
// against manuals/FAQs/community docs where available. Confidence notes
// are per-game below; anything not confirmed by at least the overlay
// image is left out rather than guessed.
//
// Several well-known overlay titles (Battlemorph, Baldies, Blue
// Lightning, Hover Strike: Unconquered Lands) are catalogued in
// roms.json under "jaguarcd" with sequential IDs, not MD5 hashes --
// Jaguar CD is title-matched (getMetaDataByMediaTitle), not hash-matched
// via find(), so they don't fit this MD5-keyed mechanism. Out of scope
// here, not forgotten.

// Cybermorph -- confirmed via manual text ("Keys 1, 2, 3 fire a Super
// Weapon if available", "Toggle Forward Cockpit Crosshair View" for
// 4/5/6) matching the overlay image exactly -- "4" is the crosshair
// toggle specifically (cross-checked against two independent readings
// of the same manual line, not just the overlay art). 7/8/9 (Left/Rear/
// Right View) from the overlay image only, not independently confirmed
// by manual text, but unambiguous on the scan.
const CYBERMORPH_DESC = {
  "1": "Super Weapon", "2": "Super Weapon", "3": "Super Weapon",
  "4": "Crosshair", "5": "Forward View", "6": "Cockpit View",
  "7": "Left View", "8": "Rear View", "9": "Right View",
  "0": "Music",
};

// Doom -- fully confirmed via GameFAQs FAQ text, which resurfaced
// verbatim and consistently across multiple independent searches. 8 is
// genuinely unused (not a transcription gap -- the FAQ enumerates 1-7
// and 9 only). Cross-checked against two other AI-generated readings of
// this same overlay: one shifted every slot by one position (wrong --
// contradicts the sourced FAQ text directly); the other matched 1-7
// exactly but disputed 9=Automap without citing a source of its own.
// Keeping 9=Automap on the strength of the repeated, specific FAQ quote.
const DOOM_DESC = {
  "1": "Fist / Chainsaw", "2": "Pistol", "3": "Shotgun",
  "4": "Chaingun", "5": "Rocket Launcher", "6": "Plasma Rifle",
  "7": "BFG 9000", "9": "Automap",
  "0": "Music",
};

// Hover Strike -- 1/2/3/5 confirmed via community control descriptions
// ("1 or 3 fires sub-weapon", "2 locks reticle on closest enemy", "5
// cycles targets"). 4/6/7 (Radar/Compass, External Camera) from the
// overlay image only. 8 is held, not tapped -- combined with the D-pad
// it pans/zooms a remote camera (8+Up/Down = zoom, 8+Left/Right = pan),
// not a simple one-shot "adjust" action.
const HOVER_STRIKE_DESC = {
  "1": "Launch", "2": "Lock-On", "3": "Launch",
  "4": "Radar / Compass", "5": "Cycle Lock-On", "6": "Radar / Compass",
  "7": "External Camera", "8": "Remote Camera (hold + D-pad to pan/zoom)", "9": "External Camera",
  "0": "Music", "*": "Reset", "#": "Reset",
};

// Iron Soldier -- overlay image only. Community descriptions confirm the
// *concept* (keypad = weapon mount shortcuts matching the in-cockpit
// mount diagram) but not exact digit assignments beyond what's legible
// on the scan. 5/8/0 unlabeled on the overlay (no mount there). "2" and
// "*" are text read directly off the overlay artwork itself (not
// inferred) -- two other AI-generated readings of this same overlay
// both guessed "Reset" for "*" and questioned "2" without offering a
// sourced alternative, so keeping what's actually printed on the scan
// over unsourced guesses.
const IRON_SOLDIER_DESC = {
  "1": "Right Shoulder", "2": "Advanced Controls", "3": "Left Shoulder",
  "4": "Right Hip", "6": "Left Hip",
  "7": "Right Hand", "9": "Left Hand",
  "*": "Weapon List (Standard / Coaxial / Chain Cutter)", "#": "Reset",
};

// Trevor McFur in the Crescent Galaxy -- overlay image only, no manual/
// FAQ text found to cross-check. * unlabeled on the scan.
const TREVOR_MCFUR_DESC = {
  "1": "Magnet", "2": "Tracer", "3": "Beam",
  "4": "Flash", "5": "Missile", "6": "Ring",
  "7": "Bolt", "8": "Shield", "9": "Cutter",
  "0": "Music", "#": "Reset",
};

// Wolfenstein 3D -- overlay image only. Most of the grid is unused (this
// game leans on the keypad far less than the others). Both * and # are
// reset/restart, not just #.
const WOLFENSTEIN_3D_DESC = {
  "1": "Game 1", "2": "Game 2", "3": "Game 3",
  "5": "Save Game", "8": "Map",
  "0": "Music", "*": "Reset", "#": "Reset",
};

// Alien vs Predator -- 7/8/9 and */# now confirmed via actual manual
// scans (archive.org/details/avp-jag, "Controller Inlay" pages for all
// three characters) -- Previous/Map/Next on 7/8/9 identically across
// Marine, Alien, and Predator overlays, and the manual's own caption
// confirms "# PLUS * RESETS THE GAME" (a combo, not two independent
// resets). "0" is NOT Music, despite that being a near-universal
// convention on other Jaguar games -- on all three AVP overlays that
// slot just shows the character's photo (decoration identifying which
// scenario the overlay is for), no function.
//
// 1-6 are deliberately left out: they differ per playable character
// (confirmed by inspecting all three scans directly), so a single
// descriptions object keyed by cartridge hash can't represent all three
// anyway. Notes for whenever per-character data is worth adding: Marine
// has 4 distinct weapon-icon slots (1/2/3/4, not 3) with 5/6 being the
// Weyland-Yutani logo (decorative, not a button); Alien has NO icons at
// all on 1-6 (just decorative artwork -- thematically fitting, the
// Alien is melee-only); Predator's icons are legible enough to be
// fairly confident on two -- 5 is a clear medical cross (Health), 6 is
// a clear eye (Vision Mode toggle) -- but 1/2/3/4 (plausibly Wrist
// Blades/Combi-Stick/Smart Disc/Plasma Caster) aren't certain enough
// from icon shape alone to commit to text.
const ALIEN_VS_PREDATOR_DESC = {
  "7": "Previous", "8": "Map", "9": "Next",
  "*": "Reset (with #)", "#": "Reset (with *)",
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

  // Cybermorph
  "0ad7cf284117042132e56b0a0a5af3e7": { _name: "Cybermorph (World) (Beta)", descriptions: CYBERMORPH_DESC },
  "f7ccc865e2a84b2eb941209a86676bd6": { _name: "Cybermorph (World) (Beta)", descriptions: CYBERMORPH_DESC },
  "1c2e3d172151dcae3b3fc9a23084dcf2": { _name: "Cybermorph (World) (Rev A)", descriptions: CYBERMORPH_DESC },
  "63e7e435f13a5a20ca8a2bf6e40ac27b": { _name: "Cybermorph (World) (Rev A)", descriptions: CYBERMORPH_DESC },
  "81dc55f1abaa89f4b3d510cb4c2e5fe8": { _name: "Cybermorph (World) (Rev B)", descriptions: CYBERMORPH_DESC },
  "a2762624a57ea85875b7700aac07a61b": { _name: "Cybermorph (World) (Rev B)", descriptions: CYBERMORPH_DESC },

  // Doom
  "3a5878ea3f391174becc37b037318804": { _name: "Doom (World)", descriptions: DOOM_DESC },
  "1e3b7dfe15e4911bb7331f352eed3c33": { _name: "Doom (World)", descriptions: DOOM_DESC },

  // Hover Strike
  "51d65ce8171daf0a255a30b44dac07cf": { _name: "Hover Strike (World)", descriptions: HOVER_STRIKE_DESC },
  "545b4f36992de772d48a9f13491fb894": { _name: "Hover Strike (World)", descriptions: HOVER_STRIKE_DESC },

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

  // Wolfenstein 3D
  "3584cb83461c8666a3f28ea0c431a3db": { _name: "Wolfenstein 3D (World)", descriptions: WOLFENSTEIN_3D_DESC },
  "e95a5d4d625640c15c1ec376eba2abee": { _name: "Wolfenstein 3D (World)", descriptions: WOLFENSTEIN_3D_DESC },
};

/**
 * Resolve the effective mappings/descriptions for a Jaguar ROM -- the
 * platform-wide default, with any per-game override (by MD5 hash)
 * layered on top. Always returns a usable {mappings, descriptions}
 * pair, even for a completely unrecognized hash.
 */
export function getJaguarMappings(md5) {
  const override = (md5 && GAME_MAPPINGS[md5]) || {};
  return {
    mappings: { ...DEFAULT_MAPPINGS, ...(override.mappings || {}) },
    descriptions: { ...DEFAULT_DESCRIPTIONS, ...(override.descriptions || {}) },
  };
}
