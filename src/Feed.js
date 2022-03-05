import {
  uuidv4,
  Feed,
  FetchAppData,
  config,
  isDev,
} from '@webrcade/app-common'

import * as Util from './Util';

const createIdsMap = (ids) => {
  const idsMap = {};
  ids.forEach((id) => {
    idsMap[id] = true;
  });
  return idsMap;
}

const findItem = (feed, categoryId, itemId) => {
  if (feed.categories) {
    for (let i = 0; i < feed.categories.length; i++) {
      const cat = feed.categories[i];
      if (cat.items && categoryId === cat.id) {
        for (let j = 0; j < cat.items.length; j++) {
          const item = cat.items[j];
          if (itemId === item.id) {
            return [i, j];
          }
        }
      }
    }
  }
  return null;
}

const findCategory = (feed, categoryId) => {
  if (feed.categories) {
    for (let i = 0; i < feed.categories.length; i++) {
      const cat = feed.categories[i];
      if (categoryId === cat.id) {
        return i;
      }
    }
  }
  return -1;
}

const addId = (obj) => {
  obj.id = uuidv4();
}

const addAddedTime = (obj) => {
  obj.added = Date.now();
  return obj;
}

const getItem = (feed, categoryId, itemId) => {
  const res = findItem(feed, categoryId, itemId);
  if (res) {
    return feed.categories[res[0]].items[res[1]];
  }
  return null;
}

const replaceItem = (feed, categoryId, itemId, item) => {
  const res = findItem(feed, categoryId, itemId);
  if (res) {
    feed.categories[res[0]].items[res[1]] = item;
  }
}

const addItemsToCategory = (feed, categoryId, items) => {
  const cat = getCategory(feed, categoryId);
  if (cat) {
    if (!cat.items) {
      cat.items = [];
    }
    items.forEach((i) => {
      const clone = Util.cloneObject(i);
      clone.id = uuidv4()
      addAddedTime(clone);
      cat.items.push(clone);
    });
  }
}

const addCategoryToFeed = (feed, cat) => {  
  // TODO: Should this clone and add id?
  feed.categories.push(cat);
}

const replaceCategory = (feed, categoryId, category) => {
  const idx = findCategory(feed, categoryId);
  if (idx >= 0) {
    feed.categories[idx] = category;
  }
}

const deleteItemsFromCategory = (feed, categoryId, itemIds) => {
  const itemIdsMap = createIdsMap(itemIds);
  const cat = getCategory(feed, categoryId);
  if (cat && cat.items) {
    for (let i = cat.items.length - 1; i >= 0; i--) {
      if (itemIdsMap[cat.items[i].id]) {
        cat.items.splice(i, 1);
      }
    }
  }
}

const deleteCategories = (feed, categoryIds) => {
  const categoryIdsMap = createIdsMap(categoryIds);
  if (feed.categories) {
    const cats = feed.categories;
    for (let i = cats.length - 1; i >= 0; i--) {
      if (categoryIdsMap[cats[i].id]) {
        cats.splice(i, 1);
      }
    }
  }
}

const getCategory = (feed, categoryId) => {
  if (feed.categories) {
    const idx = findCategory(feed, categoryId);
    if (idx >= 0) {
      return feed.categories[idx];
    }
  }
  return null;
}

const cloneCategories = (feed, categoryIds) => {
  const categoryIdsMap = createIdsMap(categoryIds);
  if (feed.categories) {
    const cats = feed.categories;
    for (let i = cats.length - 1; i >= 0; i--) {
      if (categoryIdsMap[cats[i].id]) {
        const clone = Util.cloneObject(cats[i]);
        clone.id = uuidv4();
        cats.splice(i + 1, 0, clone);
      }
    }
  }
}

const moveCategoriesUp = (feed, categoryIds) => {
  const categoryIdsMap = createIdsMap(categoryIds);
  let allowed = false;
  if (feed.categories) {
    const cats = feed.categories;
    for (let i = 0; i < cats.length; i++) {
      if (categoryIdsMap[cats[i].id]) {
        if (allowed) {
          let prev = cats[i - 1];
          cats[i - 1] = cats[i];
          cats[i] = prev;
        }
      } else {
        allowed = true;
      }
    }
  }
}

const moveCategoriesDown = (feed, categoryIds) => {
  const categoryIdsMap = createIdsMap(categoryIds);
  let allowed = false;
  if (feed.categories) {
    const cats = feed.categories;
    for (let i = cats.length - 1; i >= 0; i--) {
      if (categoryIdsMap[cats[i].id]) {
        if (allowed) {
          let prev = cats[i + 1];
          cats[i + 1] = cats[i];
          cats[i] = prev;
        }
      } else {
        allowed = true;
      }
    }
  }
}

const assignIds = (feed) => {
  feed.id = uuidv4();
  if (feed.categories) {
    feed.categories.forEach((cat, i) => {
      cat.id = uuidv4();
      if (cat.items) {
        cat.items.forEach((item, i) => {
          item.id = uuidv4();
        });
      }
    });
  }
  return feed;
}

const loadFeed = (feedJson) => {
  const feed = new Feed(feedJson, 0, false);
  const result = feed.getClonedFeed();
  assignIds(result);
  return result;
}

const loadFeedFromUrl = (url) => {
  return new Promise((resolve, reject) => {
    new FetchAppData(url).fetch()
      .then(response => response.json())
      .then(json => {
        resolve(loadFeed(json))
      })
      .catch(msg => {
        reject('Error reading feed: ' + msg);
      })
  });
}

const loadFeedFromFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = (e) => {
      reject('Error reading feed: ' + e);
    }
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);
        resolve(loadFeed(json))
      } catch (e) {
        reject('Error reading feed: ' + e);
      }
    }
    reader.readAsText(file)
  });
}

const exportFeed = (feed) => {
  const result = Util.cloneObject(feed);
  delete result.id;
  if (result.categories) {
    result.categories.forEach((cat, i) => {
      delete cat.id;
      if (cat.items) {
        cat.items.forEach((item, i) => {
          delete item.id;
        });
      }
    });
  }

  return result;
}

const exampleFeed = () => {
  const feed = {
    title: "Example Feed",
    longTitle: "WebЯcade Example Feed",
    description: "A simple example feed that demonstrates the use of optional properties, multiple categories, and multiple games.",
    thumbnail: "https://i.imgur.com/4lT1CSt.jpg",
    background: "https://i.imgur.com/IfP6ZnI.jpg",
    props: {},
    categories: [
      {
        title: "Shooters",
        longTitle: "Shooter Games",
        description: "A \"shoot 'em up\", also known as a \"shmup\" or \"STG\" (the common Japanese abbreviation for \"shooting games\"), is a game in which the protagonist combats a large number of enemies by shooting at them while dodging their fire.",
        thumbnail: "https://i.imgur.com/OjDedze.jpg",
        background: "https://i.imgur.com/IfvC9S8.jpg",
        items: [
          {
            title: "Astro Force",
            type: "sms",
            description: "Astro Force is a nod to classic Shoot ’em ups from back in the day. Heavily inspired by Thunder force, RSG, Aleste, Gaiares, MSX Nemesis, and R-Type. Astro Force features 6 stages, 30+ enemy types, and 11 bosses.",
            thumbnail: "https://i.imgur.com/yObH5Yt.png",
            background: "https://i.imgur.com/298qtC7.png",
            props: {
              rom: "https://dl.dropboxusercontent.com/s/ggc87mfds9bax9p/astroforce.sms"
            }
          },
          {
            title: "Blade Buster",
            type: "nes",
            description: "Blade Buster is a score attack shmup that comes with two game modes; two and five minutes, each ending with an epic boss battle.",
            thumbnail: "https://i.imgur.com/eW9RoYg.png",
            background: "https://i.imgur.com/ZxeaHXo.png",
            props: {
              rom: "https://dl.dropboxusercontent.com/s/ye4f2tqtujvo1ny/bladebuster.nes"
            }
          },
          {
            title: "Omega Blast",
            type: "genesis",
            description: "Omega Blast was created by homebrew developer Nendo. It is a bullet hell shooter in which you have 2 minutes to blast everything you possibly can to achieve the highest score.",
            thumbnail: "https://i.imgur.com/b0hu9rV.png",
            background: "https://i.imgur.com/o0zxHO3.png",
            props: {
              rom: "https://dl.dropboxusercontent.com/s/i6x579gv1unalh6/omegablast.bin"
            }
          }
        ]
      },
      {
        title: "Puzzlers",
        longTitle: "Puzzle Games",
        description: "Puzzle video games make up a broad genre of video games that emphasize puzzle-solving. The types of puzzles can test many problem-solving skills including logic, pattern recognition, sequence solving, spatial recognition, and word completion.",
        thumbnail: "https://i.imgur.com/rnKiCqW.jpg",
        background: "https://i.imgur.com/SikCzND.jpg",
        items: [
          {
            title: "Alter Ego",
            type: "nes",
            description: "You control a hero who has a phantom twin, his alter ego. When the hero moves, his alter ego moves in a mirrored fashion. In some levels the movements are mirrored horizontally, in others vertically. You can switch between the hero and his alter ego a limited number of times per level.",
            thumbnail: "https://i.imgur.com/5kqQ8OY.png",
            background: "https://i.imgur.com/EKcsCaR.png",
            props: {
              rom: "https://dl.dropboxusercontent.com/s/v61vhu3nhzc0jt9/alterego.nes"
            }
          },
          {
            title: "Skipp and Friends",
            type: "snes",
            description: "The object of the game is to move all three characters to the exit in each level. Each player has 2 limited special abilities that you may use to help advance through the level. The in-game status bar displays the name of each ability and how many times it can be used during that level.",
            thumbnail: "https://i.imgur.com/zNp5I6B.png",
            background: "https://i.imgur.com/VaPqpBG.png",
            props: {
              rom: "https://dl.dropboxusercontent.com/s/t3ch4yg4s8nrf4t/skippandfriends.smc"
            }
          },
          {
            title: "Slide Boy",
            longTitle: "Slide Boy in Mazeland",
            type: "7800",
            description: "Slide your way out of dangerous mazes, avoid the obstacles, activate some switches and exit each room before the time run out.",
            thumbnail: "https://i.imgur.com/MJ0wnBq.png",
            background: "https://i.imgur.com/KmCqj21.png",
            props: {
              rom: "https://dl.dropboxusercontent.com/s/rngpvg45je9x80r/slideboy.a78"
            }
          }
        ]
      }
    ]
  }
  return assignIds(feed);
}

const newFeed = () => {
  const feed = {
    title: "New feed",
    props: {},
    categories: [{
      title: "New category"
    }]
  };
  return assignIds(feed);
}

const getDefaultFeedUrl = () => {
  return (isDev() ? config.getLocalUrl() : "../..") + "/default-feed.json";
}

export {
  addCategoryToFeed,
  addId,
  addItemsToCategory,
  cloneCategories,
  deleteCategories,
  deleteItemsFromCategory,
  exportFeed,
  getCategory,
  getDefaultFeedUrl,
  getItem,
  moveCategoriesUp,
  moveCategoriesDown,
  newFeed,
  exampleFeed,
  replaceCategory,
  replaceItem,
  loadFeed,
  loadFeedFromFile,
  loadFeedFromUrl
};