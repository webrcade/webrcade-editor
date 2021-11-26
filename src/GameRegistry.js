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

  METADATA = {
    '2600': {
      thumbPrefix: 'https://raw.githubusercontent.com/raz0red/Atari_-_2600/master/Named_Titles',
      backPrefix: 'https://raw.githubusercontent.com/raz0red/Atari_-_2600/master/Named_Snaps',
      descriptionPrefix: 'https://raw.githubusercontent.com/raz0red/RetroFe-Game-info/master/RetroFE%20Story%20Files/Atari%202600'
    },
    '7800': {
      thumbPrefix: 'https://raw.githubusercontent.com/raz0red/Atari_-_7800/master/Named_Titles',
      backPrefix: 'https://raw.githubusercontent.com/raz0red/Atari_-_7800/master/Named_Snaps',
      descriptionPrefix: 'https://raw.githubusercontent.com/raz0red/RetroFe-Game-info/master/RetroFE%20Story%20Files/Atari%207800'
    },
    'gba': {
      thumbPrefix: 'https://raw.githubusercontent.com/raz0red/Nintendo_-_Game_Boy_Advance/master/Named_Titles',
      backPrefix: 'https://raw.githubusercontent.com/raz0red/Nintendo_-_Game_Boy_Advance/master/Named_Snaps',
      descriptionPrefix: 'https://raw.githubusercontent.com/raz0red/RetroFe-Game-info/master/RetroFE%20Story%20Files/Nintendo%20Game%20Boy%20Advance'
    },
    'nes': {
      thumbPrefix: 'https://raw.githubusercontent.com/raz0red/Nintendo_-_Nintendo_Entertainment_System/master/Named_Titles',
      backPrefix: 'https://raw.githubusercontent.com/raz0red/Nintendo_-_Nintendo_Entertainment_System/master/Named_Snaps',
      descriptionPrefix: 'https://raw.githubusercontent.com/raz0red/RetroFe-Game-info/master/RetroFE%20Story%20Files/Nintendo%20Entertainment%20System'          
    },
    'snes': {
      thumbPrefix: 'https://raw.githubusercontent.com/raz0red/Nintendo_-_Super_Nintendo_Entertainment_System/master/Named_Titles',
      backPrefix: 'https://raw.githubusercontent.com/raz0red/Nintendo_-_Super_Nintendo_Entertainment_System/master/Named_Snaps',
      descriptionPrefix: 'https://raw.githubusercontent.com/raz0red/RetroFe-Game-info/master/RetroFE%20Story%20Files/Super%20Nintendo%20Entertainment%20System'          
    },
    'sms': {
      thumbPrefix: 'https://raw.githubusercontent.com/raz0red/Sega_-_Master_System_-_Mark_III/master/Named_Titles',
      backPrefix: 'https://raw.githubusercontent.com/raz0red/Sega_-_Master_System_-_Mark_III/master/Named_Snaps',
      descriptionPrefix: 'https://raw.githubusercontent.com/raz0red/RetroFe-Game-info/master/RetroFE%20Story%20Files/Sega%20Master%20System'          
    },
    'gg': {
      thumbPrefix: 'https://raw.githubusercontent.com/raz0red/Sega_-_Game_Gear/master/Named_Titles',
      backPrefix: 'https://raw.githubusercontent.com/raz0red/Sega_-_Game_Gear/master/Named_Snaps',
      descriptionPrefix: 'https://raw.githubusercontent.com/raz0red/RetroFe-Game-info/master/RetroFE%20Story%20Files/Sega%20Game%20Gear'          
    },
    'genesis': {
      thumbPrefix: 'https://raw.githubusercontent.com/raz0red/Sega_-_Mega_Drive_-_Genesis/master/Named_Titles',
      backPrefix: 'https://raw.githubusercontent.com/raz0red/Sega_-_Mega_Drive_-_Genesis/master/Named_Snaps',
      descriptionPrefix: 'https://raw.githubusercontent.com/raz0red/RetroFe-Game-info/master/RetroFE%20Story%20Files/Sega%20Genesis'          
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
    const { METADATA } = this;
    const ret = {};
    for (let type in this.db) {
      const name = this.db[type][md5];

      if (name) {
        ret.title = name;
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
              const lines = description.split("\n");
              let trimmed = "";
              for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();                
                if (line.length > 0) {
                  trimmed += (i > 0) ? (" " + line) : line;
                } else {
                  break;
                }
              }
              ret.description = trimmed;
            }
          }

          if (ret.thumbnail && !ret.background) {
            ret.background = ret.thumbnail;
          }
          if (ret.background && !ret.thumbnail) {
            ret.thumbnail = ret.background;
          }
        }
      }
    }
    return ret;
  }
}

const GameRegistry = new GameRegistryImpl();

export default GameRegistry;