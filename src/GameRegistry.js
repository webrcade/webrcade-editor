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

  find(md5) {
    for (let type in this.db) {
      const name = this.db[type][md5];
      if (name) {
        return [type, name];
      }
    }
  }
}

const GameRegistry = new GameRegistryImpl();

export default GameRegistry;