import {
  Storage,
  LOG
} from '@webrcade/app-common'

import * as Util from './Util';

class PrefsImpl {
  constructor() {
    this.storage = new Storage();
    this.prefs = {};
    this.feed = null;
  }

  PREFIX = "editor.";
  PREFERENCES_PROP = this.PREFIX + "prefs";
  FEED_PROP = this.PREFIX + "feed";
  TEST_FEED_PROP = this.PREFIX + "testFeed";

  async load() {
    const { storage, PREFERENCES_PROP, FEED_PROP } = this;
    try {
      this.prefs = await storage.get(PREFERENCES_PROP);
      if (!this.prefs) {
        this.prefs = {};
      }
      const feed = await storage.get(FEED_PROP);
      if (feed) {
        this.feed = feed;
      }
      
    } catch (e) {
      LOG.error("Error loading preferences: " + e);
    }
  }

  async setPreference(name, value) {
    this.prefs[name] = value;
    this.save();
  }

  getPreference(name, defaultValue) {
    return this.prefs[name] ? 
      this.prefs[name] : defaultValue;
  }

  async setLastFeedUrl(lastUrl) {
    this.prefs.lastUrl = lastUrl;
    await this.save();
  }

  getLastFeedUrl() {
    return Util.asString(this.prefs.lastUrl);
  }

  async setLastNewType(type) {
    this.prefs.lastNewType = type;
    await this.save();
  }

  getLastNewType() {
    return Util.asString(this.prefs.lastNewType);
  }

  async setFeed(feed) {
    this.feed = feed;
    await this.saveFeed(this.FEED_PROP, feed);
  }

  async storeTestFeed(feed) {
    await this.saveFeed(this.TEST_FEED_PROP, feed);
  }

  getFeed() {
    return this.feed;
  }

  async save() {
    const { prefs, storage, PREFERENCES_PROP } = this;
    try {
      await storage.put(PREFERENCES_PROP, prefs);
    } catch (e) {
      LOG.error("Error saving preferences: " + e);
    }
  }

  async saveFeed(key, feed) {
    const {storage } = this;
    try {
      await storage.put(key, feed);
    } catch (e) {
      LOG.error("Error saving feed: " + e);
    }
  }
}

const Prefs = new PrefsImpl();

export default Prefs;