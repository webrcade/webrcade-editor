import {
  resolvePath,
  FetchAppData,
  Unzip,
  LOG
} from '@webrcade/app-common'

class GameRegistryImpl {
  constructor() {
    this.db = {};
  }

  DB_FILE = resolvePath("roms.json.zip");
  // eslint-disable-next-line
  TITLE_REGEX = /^([^\(]*).*$/i

  METADATA = {
    '2600': {
      thumbPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-2600-images/master/Named_Titles/resized',
      backPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-2600-images/master/Named_Snaps/output',
      descriptionPrefix: 'https://raw.githubusercontent.com/webrcade-assets/webrcade-assets-metadata/master/descriptions/Atari%202600/output'
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
  }

  CUSTOM_PROPS = {
    /* Genesis */

    // Ms. Pac-Man
    "cfe7f3023b21bcf697bcf5e1be461ee7": { pad3button: true },

    /* 2600 */

    // Air Sea Battle
    "16cb43492987d2f32b423817cdaaf7c4": { swap: true },
    // Basketball
    "ab4ac994865fb16ebb85738316309457": { swap: true },
    // Home Run
    "0bfabf1e98bdb180643f35f2165995d0": { swap: true },
    // Surround
    "4d7517ae69f95cfbc053be01312b7dba": { swap: true },

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

  async find(md5) {
    const { METADATA, TITLE_REGEX } = this;
    let ret = {};
    for (let type in this.db) {
      let shortName = null;
      let name = this.db[type][md5];

      if (name) {
        const matches = name.match(TITLE_REGEX);
        if (matches.length > 1) {
          shortName = matches[1].trim();
        }

        const hasShortName = shortName && shortName.length > 0;

        ret.title = hasShortName ? shortName : name;
        if (hasShortName) {
          ret.longTitle = name;
        }
        ret.type = type;
        const md = METADATA[type];
        const file = encodeURIComponent(name);
        if (md) {
          if (md.backPrefix) {
            const url = `${md.backPrefix}/${file}.png`;
            if (await this.checkExists(url)) {
              ret.background = url;
            }
          }
          if (md.thumbPrefix) {
            const url = `${md.thumbPrefix}/${file}.png`;
            if (await this.checkExists(url)) {
              ret.thumbnail = url;
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
              ret.description = description; //trimmed;
            }
          }

          if (ret.thumbnail && !ret.background) {
            ret.background = ret.thumbnail;
          }
          if (ret.background && !ret.thumbnail) {
            ret.thumbnail = ret.background;
          }
          if (ret.background) {
            ret.backgroundPixelated = true;
          }
        }

        // Lookup metadata override
        const mdOverride = this.METADATA_OVERRIDE[md5];
        if (mdOverride) {
          ret = { ...ret, ...mdOverride };
        }

        // Lookup custom props
        const props = this.CUSTOM_PROPS[md5];
        if (props) {
          ret.props = props;
        }
      }
    }

    return ret;
  }
}

const GameRegistry = new GameRegistryImpl();

export default GameRegistry;