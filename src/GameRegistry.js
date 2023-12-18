import {
  normalizeFileName,
  resolvePath,
  settings,
  FetchAppData,
  Unzip,
  LOG
} from '@webrcade/app-common'

import A5200_PROPS from './props/A5200Props.json';
import COLECO_PROPS from './props/ColecoProps.json';

class GameRegistryImpl {
  constructor() {
    this.db = {};

    this.CUSTOM_PROPS = {...this.CUSTOM_PROPS, ...COLECO_PROPS, ...A5200_PROPS};
    // console.log(this.CUSTOM_PROPS)
  }

  DB_FILE = resolvePath("roms.json.zip");
  // eslint-disable-next-line
  TITLE_REGEX = /^([^\(]*).*$/i

  AUTOCOMPLETE = {}

  METADATA = {
    '2600': {
      thumbPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-2600-images/master/Named_Titles/resized',
      backPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-2600-images/master/Named_Snaps/output',
      descriptionPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-metadata/master/descriptions/Atari%202600/output'
    },
    '5200': {
      thumbPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-5200-images/master/Named_Titles/resized',
      backPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-5200-images/master/Named_Snaps/output',
      descriptionPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-metadata/master/descriptions/Atari%205200/output'
    },
    '7800': {
      thumbPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-7800-images/master/Named_Titles/resized',
      backPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-7800-images/master/Named_Snaps/output',
      descriptionPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-metadata/master/descriptions/Atari%207800/output'
    },
    'gba': {
      thumbPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-gba-images/master/Named_Titles/resized',
      backPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-gba-images/master/Named_Snaps/output',
      descriptionPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-metadata/master/descriptions/Nintendo%20Game%20Boy%20Advance/output'
    },
    'nes': {
      thumbPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-nes-images/master/Named_Titles/resized',
      backPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-nes-images/master/Named_Snaps/output',
      descriptionPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-metadata/master/descriptions/Nintendo%20Entertainment%20System/output'
    },
    'snes': {
      thumbPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-snes-images/master/Named_Titles/resized',
      backPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-snes-images/master/Named_Snaps/output',
      descriptionPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-metadata/master/descriptions/Super%20Nintendo%20Entertainment%20System/output'
    },
    'sms': {
      thumbPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-sms-images/master/Named_Titles/resized',
      backPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-sms-images/master/Named_Snaps/output',
      descriptionPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-metadata/master/descriptions/Sega%20Master%20System/output'
    },
    'gg': {
      thumbPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-gg-images/master/Named_Titles/resized',
      backPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-gg-images/master/Named_Snaps/output',
      descriptionPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-metadata/master/descriptions/Sega%20Game%20Gear/output'
    },
    'genesis': {
      thumbPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-genesis-images/master/Named_Titles/resized',
      backPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-genesis-images/master/Named_Snaps/output',
      descriptionPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-metadata/master/descriptions/Sega%20Genesis/output'
    },
    'sg1000': {
      thumbPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-sg1000-images/master/Named_Titles/resized',
      backPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-sg1000-images/master/Named_Snaps/output',
      descriptionPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-metadata/master/descriptions/Sega%20SG-1000/output'
    },
    'gb': {
      thumbPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-gb-images/master/Named_Titles/resized',
      backPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-gb-images/master/Named_Snaps/output',
      descriptionPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-metadata/master/descriptions/Nintendo%20Game%20Boy/output'
    },
    'gbc': {
      thumbPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-gbc-images/master/Named_Titles/resized',
      backPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-gbc-images/master/Named_Snaps/output',
      descriptionPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-metadata/master/descriptions/Nintendo%20Game%20Boy%20Color/output'
    },
    'n64': {
      thumbPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-n64-images/master/Named_Titles/resized',
      backPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-n64-images/master/Named_Snaps/output',
      descriptionPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-metadata/master/descriptions/Nintendo%2064/output'
    },
    'pce': {
      thumbPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-pce-images/master/Named_Titles/resized',
      backPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-pce-images/master/Named_Snaps/output',
      descriptionPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-metadata/master/descriptions/NEC%20PC%20Engine/output'
    },
    'sgx': {
      thumbPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-sgx-images/master/Named_Titles/resized',
      backPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-sgx-images/master/Named_Snaps/output',
      descriptionPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-metadata/master/descriptions/NEC%20SuperGrafx/output'
    },
    'ngp': {
      thumbPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-ngp-images/master/Named_Titles/resized',
      backPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-ngp-images/master/Named_Snaps/output',
      descriptionPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-metadata/master/descriptions/SNK%20Neo%20Geo%20Pocket/output'
    },
    'ngc': {
      thumbPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-ngc-images/master/Named_Titles/resized',
      backPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-ngc-images/master/Named_Snaps/output',
      descriptionPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-metadata/master/descriptions/SNK%20Neo%20Geo%20Pocket%20Color/output'
    },
    'wsc': {
      thumbPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-wsc-images/master/Named_Titles/resized',
      backPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-wsc-images/master/Named_Snaps/output',
      descriptionPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-metadata/master/descriptions/Bandai%20WonderSwan%20Color/output'
    },
    'ws': {
      thumbPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-ws-images/master/Named_Titles/resized',
      backPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-ws-images/master/Named_Snaps/output',
      descriptionPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-metadata/master/descriptions/Bandai%20WonderSwan/output'
    },
    'vb': {
      thumbPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-vb-images/master/Named_Titles/resized',
      backPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-vb-images/master/Named_Snaps/output',
      descriptionPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-metadata/master/descriptions/Nintendo%20Virtual%20Boy/output'
    },
    'lnx': {
      thumbPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-lnx-images/master/Named_Titles/resized',
      backPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-lnx-images/master/Named_Snaps/output',
      descriptionPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-metadata/master/descriptions/Atari%20Lynx/output'
    },
    'neogeo': {
      thumbPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-neogeo-images/master/Named_Titles/resized',
      backPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-neogeo-images/master/Named_Snaps/output',
      descriptionPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-metadata/master/descriptions/SNK%20Neo%20Geo/output'
    },
    'arcade': {
      thumbPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-fbneo-images/master/Named_Titles/resized',
      backPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-fbneo-images/master/Named_Snaps/output',
      descriptionPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-metadata/master/descriptions/Arcade/output'
    },
    'arcade-capcom': {
      thumbPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-fbneo-images/master/Named_Titles/resized',
      backPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-fbneo-images/master/Named_Snaps/output',
      descriptionPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-metadata/master/descriptions/Arcade/output'
    },
    'arcade-konami': {
      thumbPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-fbneo-images/master/Named_Titles/resized',
      backPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-fbneo-images/master/Named_Snaps/output',
      descriptionPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-metadata/master/descriptions/Arcade/output'
    },
    'psx': {
      thumbPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-psx-images/master/Named_Titles/resized',
      backPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-psx-images/master/Named_Snaps/output',
      descriptionPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-metadata/master/descriptions/Sony%20PlayStation%201/output'
    },
    'segacd': {
      thumbPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-segacd-images/master/Named_Titles/resized',
      backPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-segacd-images/master/Named_Snaps/output',
      descriptionPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-metadata/master/descriptions/Sega%20CD/output'
    },
    'pcecd': {
      thumbPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-pcecd-images/master/Named_Titles/resized',
      backPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-pcecd-images/master/Named_Snaps/output',
      descriptionPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-metadata/master/descriptions/NEC%20PC%20Engine-CD/output'
    },
    'coleco': {
      thumbPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-coleco-images/master/Named_Titles/resized',
      backPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-coleco-images/master/Named_Snaps/output',
      descriptionPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-metadata/master/descriptions/ColecoVision/output'
    },
    'pcfx': {
      thumbPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-pcfx-images/master/Named_Titles/resized',
      backPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-pcfx-images/master/Named_Snaps/output',
      descriptionPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-metadata/master/descriptions/NEC%20PC-FX/output'
    },
    'neogeocd': {
      thumbPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-neogeocd-images/master/Named_Titles/resized',
      backPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-neogeocd-images/master/Named_Snaps/output',
      descriptionPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-metadata/master/descriptions/SNK%20Neo%20Geo%20CD/output'
    },
    'quake': {
      thumbPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-quake-images/master/Named_Titles/resized',
      backPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-quake-images/master/Named_Snaps/output',
      descriptionPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-metadata/master/descriptions/Quake/output'
    },
    '3do': {
      thumbPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-3do-images/master/Named_Titles/resized',
      backPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-3do-images/master/Named_Snaps/output',
      descriptionPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-metadata/master/descriptions/Panasonic%203DO/output'
    },
    'scumm': {
      thumbPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-scummvm-images/master/Named_Titles/resized',
      backPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-scummvm-images/master/Named_Snaps/output',
      descriptionPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-metadata/master/descriptions/ScummVM%20Descriptions'
    },
  }

  CUSTOM_PROPS = {
    /* Genesis */

    // Ms. Pac-Man
    "cfe7f3023b21bcf697bcf5e1be461ee7": { pad3button: true },

    /* 2600 */

    // Air Sea Battle
    "16cb43492987d2f32b423817cdaaf7c4": { swap: true },
    // Bachelor Party
    "5b124850de9eea66781a50b2e9837000": { port0: 2, paddleSensitivity: 16, paddleVertical: true, paddleInverted: true, paddleCenter: -10 },
    // Basketball
    "ab4ac994865fb16ebb85738316309457": { swap: true },
    // Beat'Em & Eat'Em (Brazil) (Unl)
    "6c25f58fd184632ca76020f589bb3767": { port0: 2, port1: 2, paddleSensitivity: -50, paddleCenter: 20},
    // Beat'Em & Eat'Em (Europe)
    "b4f31ea8a6cc9f1fd4d5585a87c3b487": { port0: 2, port1: 2, paddleSensitivity: -50, paddleCenter: 20},
    // Beat'Em & Eat'Em (USA)
    "59e96de9628e8373d1c685f5e57dcf10": { port0: 2, port1: 2, paddleSensitivity: -50, paddleCenter: 20},
    // Breakout (Europe)
    "6c76fe09aa8b39ee52035e0da6d0808b": { port0: 2, port1: 2, paddleCenter: -16 },
    // Breakout (Japan, USA)
    "f34f08e5eb96e500e851a80be3277a56": { port0: 2, port1: 2, paddleCenter: -16 },
    // Bugs (Europe)
    "e61210293b14c9c4ecc91705072c6a7e": { port0: 2, port1: 2, paddleCenter: 16 },
    // Bugs (USA)
    "68597264c8e57ada93be3a5be4565096": { port0: 2, port1: 2, paddleCenter: 16 },
    // Bumper Bash (Europe)
    "16ee443c990215f61f7dd1e55a0d2256": { port0: 1 },
    // Bumper Bash (USA)
    "aa1c41f86ec44c0a44eb64c332ce08af": { port0: 1 },
    // Canyon Bomber (USA)
    "feedcc20bc3ca34851cd5d9e38aa2ca6": { port0: 2, port1: 2, paddleVertical: true, paddleCenter: -20, paddleSensitivity: -40 },
    // Casino (Europe)
    "2bc26619e31710a9884c110d8430c1da": { paddleSensitivity: 40, port0: 2, port1: 2 },
    // Casino (USA)
    "b816296311019ab69a21cb9e9e235d12": { paddleSensitivity: 40, port0: 2, port1: 2 },
    // Circus Atari (Europe)
    "30e0ab8be713208ae9a978b34e9e8e8c": { port0: 2, port1: 2, paddleSensitivity: -20 },
    // Circus Atari (Japan, USA)
    "a7b96a8150600b3e800a4689c3ec60a2": { port0: 2, port1: 2, paddleSensitivity: -20 },
    // Demons to Diamonds (USA)
    "f91fb8da3223b79f1c9a07b77ebfa0b2": { port0: 2, port1: 2, paddleSensitivity: -20 },
    // Eggomania (USA)
    "42b2c3b4545f1499a083cfbc4a3b7640": { port0: 2, port1: 2, paddleCenter: -20 },
    // Fireball (USA)
    "386ff28ac5e254ba1b1bac6916bcc93a": { port0: 2, port1: 2, paddleSensitivity: -20 },
    // G.I. Joe - Cobra Strike (USA)
    "c1fdd44efda916414be3527a47752c75": { port0: 1 },
    // Guardian (USA)
    "7ab2f190d4e59e8742e76a6e870b567e": { port0: 2, port1: 2, paddleCenter: -20, paddleSensitivity: 20 },
    // Home Run
    "0bfabf1e98bdb180643f35f2165995d0": { swap: true },
    // Kaboom!
    "5428cdfada281c569c74c7308c7f2c26": { port0: 2, port1: 2 },
    // Music Machine, The (USA)
    "65b106eba3e45f3dab72ea907f39f8b4": { port0: 2, port1: 2,  paddleCenter: 20 },
    // Night Driver
    "392f00fd1a074a3c15bc96b0a57d52a1": { port0: 2, port1: 2 },
    // Party Mix (USA)
    "012b8e6ef3b5fd5aabc94075c527709d": { port0: 2, port1: 2, paddleCenter: -20 },
    // Picnic (USA)
    "17c0a63f9a680e7a61beba81692d9297": { port0: 2, port1: 2, paddleCenter: 30, paddleSensitivity: -20 },
    // Piece o' Cake (USA)
    "d3423d7600879174c038f53e5ebbf9d3": { port0: 2, port1: 2, paddleCenter: -20 },
    // Solar Storm (USA)
    "97842fe847e8eb71263d6f92f7e122bd": { port0: 2, port1: 2, paddleCenter: 20, paddleSensitivity: -20 },
    // Star Wars - Jedi Arena (USA)
    "c9f6e521a49a2d15dac56b6ddb3fb4c7": { port0: 2, port1: 2, paddleSensitivity: -20 },
    // Steeplechase (Europe)
    "f1eeeccc4bba6999345a2575ae96508e": { port0: 2, port1: 2 },
    // Steeplechase (USA)
    "656dc247db2871766dffd978c71da80c": { port0: 2, port1: 2 },
    // Street Racer (USA)
    "396f7bc90ab4fa4975f8c74abe4e81f0": { port0: 2, port1: 2 },
    // Super Breakout (USA)
    "8885d0ce11c5b40c3a8a8d9ed28cefef": { port0: 2, port1: 2 },
    // Super Breakout (USA, Europe) (Atari Anthology)
    "0ad9a358e361256b94f3fb4f2fa5a3b1": { port0: 2, port1: 2 },
    // Surround
    "4d7517ae69f95cfbc053be01312b7dba": { swap: true },
    // Tac-Scan (USA)
    "d45ebf130ed9070ea8ebd56176e48a38": { port0: 2, port1: 2 },
    // Video Olympics (USA)
    "60e0ea3cbe0913d39803477945e9e5ec": { port0: 2, port1: 2, paddleVertical: true, paddleCenter: -10 },
    // Warlords
    "cbe5a166550a8129a5e6d374901dffad": { port0: 2, port1: 2 },
    // Warplock (USA)
    "679e910b27406c6a2072f9569ae35fc8": { port0: 2, port1: 2, paddleCenter: 20 },

    /* NES */

    // Driar
    "ac6adbbc2f43faa64a86463c1a594aee": { pal: true },
    // Elite
    "ada42a2576d85b29da663bbf35b69288": { pal: true },
    "2c832d9fac3229cb7c32a5fe1dd65ad7": { pal: true },

    /* GBA */

    // Anguna
    "9d3a663de5228414d7e6cda7244c5d91": { saveType: 2, flashSize: 65536 },
    // Another World
    "9cef2ca9fba8a4532629f8c7e7c9ddf8": { saveType: 2, flashSize: 65536 },
    // Blast Arena Advance
    "10f2557e1deb8629c04c071cd180c707": { saveType: 2, flashSize: 65536 },
    "cde17fc4f3d41365cb92dd1187196cd8": { saveType: 2, flashSize: 65536 },
    // Broken Circle
    "420a1cf3e052ec30d3612d7d945c525e": { saveType: 1 },
    // Flappy Bird
    "38f78ab97bbbb9bd210d8c96497f788a": { rotation: 270, saveType: 2, flashSize: 65536 },
    // POWDER
    "09f9a4252a88f839f40fdfb44942cb20": { saveType: 2, flashSize: 65536 },
    // SM Quest
    "d6b69c7d686163350141a5860d1599ad": { saveType: 2 },

    /* SMS */

    // DARC
    "466f43446d151b9e6793212d5ce8c373": { ym2413: true },
    // Flight of Pigarus
    "42b79384a1352b47b9ea32d6d3ec6849": { pal: true },
    // Mecha 8
    "d736dc90807bea45e2dc7aa3ff2e8be9": { ym2413: true },

    /* DOOM */

    // Freedoom Phase 1
    "c92783594290d9259017cadd746a62bb": { game: "freedoom1" },
    // Freedoom Phase 2
    "88e0c5180391f5b4eedea0f06df24c4c": { game: "freedoom2" },
    // Doom 1 (Shareware)
    "9c69ed31b99047073cbe9a5aaf616b5b": { game: "doom1" },

    /* 3DO */

    // Alone in the Dark
    "0999360e91c941469c7fceb8b20c6df5": { hack: 4},
    "abedff17853f355ba2b2238ea0d465cc": { hack: 4},
    "49564f60b021fbd59f95f39acf6cbd8d": { hack: 4},
    "192de93ff970cc04caa49d4a723a390f": { hack: 4},
    "4224f017a7b91bfdd69814e2c9fd7c22": { hack: 4},

    // Crash 'n Burn
    "088b32295489444bdfec469e4f074a71": { hack: 1},
    "95f1ba427b83c958bc32974e04007a40": { hack: 1},
    "b62ff1e051a5ed2acc76ad647ee37b50": { hack: 1},

    // DinoPark Tycoon
    "108d2f25ca9a8b09541e30352d59696f": { hack: 2},

    // Microcosm
    "465fdc3bfd701fae4f660a1a1c7c8373": { hack: 3},
    "f680353429def4d3c1e95120fd9c503f": { hack: 3},

    // Samurai Shodown
    "d36d1d26dba93004b33a2d3fae71d03b": { hack: 5},
    "b0a0bf31f20b8a1fc45d2ea552c94540": { hack: 5},
  }

  METADATA_OVERRIDE = {
    // Freedoom Phase 1
    "c92783594290d9259017cadd746a62bb": {
      description: "The Freedoom project aims to create a complete, free content first person shooter game. Phase 1contains four episodes, nine levels each, totalling 36 levels. This game aims for compatibility with The Ultimate Doom mods, also known as plain Doom or Doom 1.",
      thumbnail: "https://play.webrcade.com/default-feed/images/doom/freedoom1-thumb.png",
      background: "https://play.webrcade.com/default-feed/images/doom/freedoom1-background.png"
    },
    // Freedoom Phase 2
    "88e0c5180391f5b4eedea0f06df24c4c": {
      description: "The Freedoom project aims to create a complete, free content first person shooter game. Phase 2 includes 32 levels in one long episode, featuring extra monsters and a double-barrelled shotgun. This project aims for compatibility with Doom II mods.",
      thumbnail: "https://play.webrcade.com/default-feed/images/doom/freedoom2-thumb.png",
      background: "https://play.webrcade.com/default-feed/images/doom/freedoom2-background.png"
    },
    // Doom 1 (Shareware)
    "9c69ed31b99047073cbe9a5aaf616b5b": {
      description: "Doom is a 1993 first-person shooter (FPS) game developed by id Software for MS-DOS. Players assume the role of a space marine, popularly known as Doomguy, fighting his way through hordes of invading demons from Hell. The first episode, comprising nine levels, was distributed freely as shareware and played by an estimated 15–20 million people within two years.",
      thumbnail: "https://play.webrcade.com/default-feed/images/doom/doom1-thumb.png",
      background: "https://play.webrcade.com/default-feed/images/doom/freedoom2-background.png"
    }
  }

  async checkExists(url) {
    try {
      const r = await new FetchAppData(url, { method: "HEAD" })
        .setRetries(0).setProxyDisabled(true).fetch();
      return r.ok;
    } catch (e) {
      LOG.error("Error checking if exists: " + e)
      return false;
    }
  }

  async getText(url) {
    try {
      const r = await new FetchAppData(url)
        .setRetries(0).setProxyDisabled(true).fetch();
      return r.ok ? await r.text() : null;
    } catch (e) {
      LOG.error("Error retrieving text: " + e)
      return null;
    }
  }

  async init() {
    const { DB_FILE } = this;
    try {
      const expAppsEnabled = settings.isExpAppsEnabled();
      this.n64enabled = expAppsEnabled;
      this.a5200enabled = expAppsEnabled;

      const fad = new FetchAppData(DB_FILE);
      const res = await fad.fetch();
      if (res.ok) {
        let blob = await res.blob();
        const uz = new Unzip();
        blob = await uz.unzip(blob, [".json"]);
        const json = await blob.text();
        this.db = JSON.parse(json);
        LOG.info(`Loaded types database (MD5), ${Object.keys(this.db).length} types.`);
      }
    } catch (e) {
      LOG.error("Error loading types database: " + e);
    }
  }

  async isFileInZip(filename, blob) {
    // Collect filenames from zip
    let filenames = {};
    const uz = new Unzip()
      .setFailIfNotFound(false)
      .setEntriesCallback((e) => {
        for (let i = 0; i < e.length; i++) {
          const name = e[i].filename;
          filenames[name] = name;
        }
      });
    await uz.unzip(blob, [], []);
    console.log(filenames);
    return filenames[filename] !== undefined;
  }

  async findByName(name, ext, blob, isFullName = false, verifyBlob = true) {
    let ret = null;
    const fullName = isFullName ? name : name + "." + ext;
    for (let type in this.db._by_name) {
      const result = this.db._by_name[type][fullName];
      if (result) {
        const file = result[0];
        const name = result[1];
        const fileFound = verifyBlob ? await this.isFileInZip(file, blob) : true;
        if (fileFound) {
          ret = {}
          // Set type
          ret.type = type;
          // Add titles
          this.addTitles(ret, name);
          // Add metadata
          await this.addMetaData(ret, type, name);
          break;
        }
      }
    }
    return ret;
  }

  getAutoCompleteOptions(type) {
    const { AUTOCOMPLETE } = this;

    if (type in AUTOCOMPLETE) {
      return AUTOCOMPLETE[type];
    }

    const titleSet = new Set();
    let entries = this.getTypeEntries(type);

    if (entries) {
      const opts = [];
      for (let h in entries) {
        const title = this.getShortName(entries[h]);
        if (!titleSet.has(title)) {
          titleSet.add(title);
          opts.push({
            title: title,
            key: h,
            byName: false
          })
        }
      }
      AUTOCOMPLETE[type] = opts;
      return opts;
    } else {
      if (this.db && type in this.db._by_name) {
        const opts = [];
        entries = this.db._by_name[type];
        for (let f in entries) {
          const title = this.getShortName(entries[f][1]);
          if (!titleSet.has(title)) {
            titleSet.add(title);
            opts.push({
              title: title,
              key: f,
              byName: true
            })
          }
        }
        AUTOCOMPLETE[type] = opts;
        return opts;
      }
    }

    return [];
  }

  getShortName(name) {
    const { TITLE_REGEX } = this;

    let shortName = null;
    const matches = name.match(TITLE_REGEX);
    if (matches.length > 1) {
      shortName = matches[1].trim();
    }

    return shortName ? shortName : name;
  }

  addTitles(info, name) {
    const { TITLE_REGEX } = this;

    let shortName = null;
    const matches = name.match(TITLE_REGEX);
    if (matches.length > 1) {
      shortName = matches[1].trim();
    }

    const hasShortName = shortName && shortName.length > 0;

    info.title = hasShortName ? shortName : name;
    if (hasShortName) {
      info.longTitle = name;
    }
  }

  async addMetaData(info, type, name) {
    const { METADATA } = this;

    const md = METADATA[type];
    let file = normalizeFileName(name);
    file = encodeURIComponent(file);
    if (md) {
      if (md.backPrefix) {
        const url = `${md.backPrefix}/${file}.png`;
        if (await this.checkExists(url)) {
          info.background = url;
        }
      }
      if (md.thumbPrefix) {
        const url = `${md.thumbPrefix}/${file}.png`;
        if (await this.checkExists(url)) {
          info.thumbnail = url;
        }
      }
      if (md.descriptionPrefix) {
        const url = `${md.descriptionPrefix}/${file}.txt`;
        const description = await this.getText(url);
        if (description) {
          // const lines = description.split("\n");
          // let trimmed = "";
          // for (let i = 0; i < lines.length; i++) {
          //   const line = lines[i].trim();
          //   if (line.length > 0) {
          //     trimmed += (i > 0) ? (" " + line) : line;
          //   } else {
          //     break;
          //   }
          // }
          info.description = description.trim(); //trimmed;
        }
      }

      if (info.thumbnail && !info.background) {
        info.background = info.thumbnail;
      }
      if (info.background && !info.thumbnail) {
        info.thumbnail = info.background;
      }
      if (info.background) {
        info.backgroundPixelated = true;
      }
    }
  }

  getTypeEntries(type) {
    return type in this.db ? this.db[type] : null;
  }

  async find(md5) {
    let ret = {};
    for (let type in this.db) {

      // Skip n64 if not enabled
      if (type === 'n64' && !this.n64enabled) continue;

      // Skip 5200 if not enabled
      if (type === '5200' && !this.a5200enabled) continue;

      let name = this.db[type][md5];
      if (name) {
        // Add titles
        this.addTitles(ret, name);

        // Set type
        ret.type = type;

        // Add metadata
        await this.addMetaData(ret, type, name);

        // Lookup metadata override
        const mdOverride = this.METADATA_OVERRIDE[md5];
        if (mdOverride) {
          ret = { ...ret, ...mdOverride };
        }

        // Lookup custom props
        const props = this.CUSTOM_PROPS[md5];
        if (props) {
          const clone = {...props};
          delete clone._name;
          ret.props = clone
        }
      }
    }

    return ret;
  }
}

const GameRegistry = new GameRegistryImpl();

export default GameRegistry;