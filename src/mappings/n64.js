// Per-game property overrides for Nintendo 64, keyed by ROM MD5 hash.
//
// Same mechanism as mappings/jaguar.js (see that file for the fuller
// writeup), scaled down: N64 doesn't need a button-remapping layer like
// Jaguar's numpad overlays, just a place to attach per-game overrides for
// props that ship as sensible per-title defaults instead of requiring the
// user to find the Testing tab and flip them manually -- starting with
// disableOpenGL2 (see applyGameSettings()/getUseRealBios() precedent in
// webrcade-app-retro-virtual-jaguar/src/emulator/index.js for the same
// props-driven-default idea). Only applies to the RETRO_MUPEN64PLUS_NEXT
// core -- disableOpenGL2 is inert on the other N64 cores, which don't
// have a GLES2 fallback build to switch to.
const GAME_MAPPINGS = {
  // 1080 Snowboarding -- disableOpenGL2: to start with, tracking down a
  // WebGL2 rendering issue on this title.
  "632c98cf281cda776e66685b278a4fa6": { _name: "1080 Snowboarding (Europe) (En,Ja,Fr,De)", disableOpenGL2: true },
  "f58b3055a2c642fb2f563f11b6b597ea": { _name: "1080 Snowboarding (Europe) (En,Ja,Fr,De)", disableOpenGL2: true },
  "fa27089c425dbab99f19245c5c997613": { _name: "1080 Snowboarding (Japan, USA) (En,Ja)", disableOpenGL2: true },
  "18381c8f37e2b29f5940eea9b5f96814": { _name: "1080 Snowboarding (Japan, USA) (En,Ja)", disableOpenGL2: true },

  // Star Wars Episode I: Battle for Naboo -- countPerOp: 2 for a
  // performance boost, audioLatency: 2 (High) for audio hitches.
  "0bd1f7bb9f4b02520e4e9285c809f099": { _name: "Star Wars Episode I - Battle for Naboo (Europe)", countPerOp: 2, audioLatency: 2 },
  "415a266c6dff65350fd577a127a2d601": { _name: "Star Wars Episode I - Battle for Naboo (Europe)", countPerOp: 2, audioLatency: 2 },
  "3cb88b934572e7520f35e5458798775b": { _name: "Star Wars Episode I - Battle for Naboo (USA)", countPerOp: 2, audioLatency: 2 },
  "abc8665fc1a2c76ff61394aea0dad6c3": { _name: "Star Wars Episode I - Battle for Naboo (USA)", countPerOp: 2, audioLatency: 2 },

  // Star Wars: Shadows of the Empire -- audioLatency: 2 (High) for audio
  // hitches. Covers every dump in roms.json's n64 section.
  "591cf8e672c9cc0fe9c871cc56dcc854": { _name: "Star Wars - Shadows of the Empire (Europe)", audioLatency: 2 },
  "5e440149b6beb286aad3a0b1f10ade9e": { _name: "Star Wars - Shadows of the Empire (Europe)", audioLatency: 2 },
  "5cce8ad5f86e8a373a7525dc4c7e6705": { _name: "Star Wars - Shadows of the Empire (USA)", audioLatency: 2 },
  "cb1e1f8d818ab3cadea2cbe24994c9fe": { _name: "Star Wars - Shadows of the Empire (USA)", audioLatency: 2 },
  "4076973cfda277fc876e9f066cc73deb": { _name: "Star Wars - Shadows of the Empire (USA) (Beta) (1996-10-15)", audioLatency: 2 },
  "944ac4d381a42197f259bd734fbe1095": { _name: "Star Wars - Shadows of the Empire (USA) (Beta) (1996-10-15)", audioLatency: 2 },
  "fa635e837275d28fd5a24d5675ba42c8": { _name: "Star Wars - Shadows of the Empire (USA) (Rev 1)", audioLatency: 2 },
  "547321df653203ad7bcbc178d9c37bf6": { _name: "Star Wars - Shadows of the Empire (USA) (Rev 1)", audioLatency: 2 },
  "c7b40352aad8d863d88d51672f9a0087": { _name: "Star Wars - Shadows of the Empire (USA) (Rev 2)", audioLatency: 2 },
  "99b150a2e655d771ee1695cc1df65b65": { _name: "Star Wars - Shadows of the Empire (USA) (Rev 2)", audioLatency: 2 },

  // Perfect Dark -- audioLatency: 2 (High) for audio hitches. Covers every
  // dump in roms.json's n64 section, debug versions included.
  "d9b5cd305d228424891ce38e71bc9213": { _name: "Perfect Dark (Europe) (En,Fr,De,Es,It)", audioLatency: 2 },
  "6f86452863716270c51c4f433af47534": { _name: "Perfect Dark (Europe) (En,Fr,De,Es,It)", audioLatency: 2 },
  "ad2de210a3455ba5ec541f0c78d91444": { _name: "Perfect Dark (Europe) (Debug Version) (2000-04-26)", audioLatency: 2 },
  "6591a8d4a54df2edd351080dd37cb924": { _name: "Perfect Dark (Europe) (Debug Version) (2000-04-26)", audioLatency: 2 },
  "538d2b75945eae069b29c46193e74790": { _name: "Perfect Dark (Japan)", audioLatency: 2 },
  "041b6a5025585e70ac658975f6dcbcd7": { _name: "Perfect Dark (Japan)", audioLatency: 2 },
  "7f4171b0c8d17815be37913f535e4e93": { _name: "Perfect Dark (USA)", audioLatency: 2 },
  "eaedd63ae7609c8c795db93aa2437c4c": { _name: "Perfect Dark (USA)", audioLatency: 2 },
  "aa93f4df16fceada399a749f5ad2f273": { _name: "Perfect Dark (USA) (Debug Version) (2000-03-22)", audioLatency: 2 },
  "160fedb6c2d81e2a19387be1048cd79e": { _name: "Perfect Dark (USA) (Debug Version) (2000-03-22)", audioLatency: 2 },
  "e03b088b6ac9e0080440efed07c1e40f": { _name: "Perfect Dark (USA) (Rev 1)", audioLatency: 2 },
  "f267577a1faeca4c07f1bb188452ca80": { _name: "Perfect Dark (USA) (Rev 1)", audioLatency: 2 },

  // Indiana Jones and the Infernal Machine -- audioLatency: 2 (High) for
  // audio hitches. Covers every dump in roms.json's n64 section, the
  // Australia proto included.
  "70de1eab508596b6bbefd168b5d07194": { _name: "Indiana Jones and the Infernal Machine (USA)", audioLatency: 2 },
  "2e32be40f6aeaa549579b026989a017f": { _name: "Indiana Jones and the Infernal Machine (USA)", audioLatency: 2 },
  "63d7ab29ba3dfc5d5b12c1d9c5832355": { _name: "Indiana Jones and the Infernal Machine (Australia) (Proto)", audioLatency: 2 },
  "0af8f08bdbeeb7c7196c3bb1d5b27030": { _name: "Indiana Jones and the Infernal Machine (Australia) (Proto)", audioLatency: 2 },
};

/**
 * Resolve the effective per-game overrides for an N64 ROM by MD5 hash.
 * Always returns a usable object, even for a completely unrecognized hash
 * (matching applist.js's own defaults: disableOpenGL2 false, countPerOp 0/
 * disabled, audioLatency 0/Low).
 */
export function getN64Mappings(md5) {
  const override = (md5 && GAME_MAPPINGS[md5]) || {};
  return {
    disableOpenGL2: override.disableOpenGL2 === true,
    countPerOp: parseInt(override.countPerOp, 10) || 0,
    audioLatency: parseInt(override.audioLatency, 10) || 0,
  };
}
