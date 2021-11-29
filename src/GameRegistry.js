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
  TITLE_REGEX = /^([^\(]*).*.{4}$/i

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
    } catch(e) {
      LOG.error("Error loading types database: " + e);
    }
  }

  async find(md5) {
    const { METADATA, TITLE_REGEX } = this;
    const ret = {};
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
      }
    }
    return ret;
  }
}

const GameRegistry = new GameRegistryImpl();

export default GameRegistry;