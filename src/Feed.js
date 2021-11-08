import {
  uuidv4,
  Feed,
  FetchAppData,
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
      cat.items.push(clone);
    });
  }
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

const newFeed = () => {
  const feed = {
    title: "Example Feed",
    longTitle: "WebЯcade Example Feed",
    description: "A simple example feed that demonstrates the use of optional properties, multiple categories, and multiple games.",
    thumbnail: "https://tinyurl.com/3tda3493",
    background: "https://tinyurl.com/4ma324en",
    categories: [
      {
        title: "Shooters",
        longTitle: "Shooter Games",
        description: "A \"shoot 'em up\", also known as a \"shmup\" or \"STG\" (the common Japanese abbreviation for \"shooting games\"), is a game in which the protagonist combats a large number of enemies by shooting at them while dodging their fire.",
        thumbnail: "https://tinyurl.com/ba4w9ze6",
        background: "https://tinyurl.com/bw45h77k",
        items: [
          {
            title: "Astro Force",
            type: "sms",
            description: "Astro Force is a nod to classic Shoot ’em ups from back in the day. Heavily inspired by Thunder force, RSG, Aleste, Gaiares, MSX Nemesis, and R-Type. Astro Force features 6 stages, 30+ enemy types, and 11 bosses.",
            thumbnail: "https://tinyurl.com/da6s5adj",
            background: "https://tinyurl.com/3bubjkn4",
            props: {
              rom: "https://tinyurl.com/cvdbtdth"
            }
          },
          {
            title: "Blade Buster",
            type: "nes",
            description: "Blade Buster is a score attack shmup that comes with two game modes; two and five minutes, each ending with an epic boss battle.",
            thumbnail: "https://tinyurl.com/xszmcbvu",
            background: "https://tinyurl.com/ya43xf2j",
            props: {
              rom: "https://tinyurl.com/32fkc5r7"
            }
          },
          {
            title: "Omega Blast",
            type: "genesis",
            description: "Omega Blast was created by homebrew developer Nendo. It is a bullet hell shooter in which you have 2 minutes to blast everything you possibly can to achieve the highest score.",
            thumbnail: "https://tinyurl.com/rtubmv28",
            background: "https://tinyurl.com/6czsp3pm",
            props: {
              rom: "https://tinyurl.com/pzv5mssx"
            }
          }
        ]
      },
      {
        title: "Puzzlers",
        longTitle: "Puzzle Games",
        description: "Puzzle video games make up a broad genre of video games that emphasize puzzle-solving. The types of puzzles can test many problem-solving skills including logic, pattern recognition, sequence solving, spatial recognition, and word completion.",
        thumbnail: "https://tinyurl.com/svsc7cnp",
        background: "https://tinyurl.com/y5ywdxpz",
        items: [
          {
            title: "Alter Ego",
            type: "nes",
            description: "You control a hero who has a phantom twin, his alter ego. When the hero moves, his alter ego moves in a mirrored fashion. In some levels the movements are mirrored horizontally, in others vertically. You can switch between the hero and his alter ego a limited number of times per level.",
            thumbnail: "https://tinyurl.com/f39vd77r",
            background: "https://tinyurl.com/4tnsjhm9",
            props: {
              rom: "https://tinyurl.com/4ce8z8a2"
            }
          },
          {
            title: "Skipp and Friends",
            type: "snes",
            description: "The object of the game is to move all three characters to the exit in each level. Each player has 2 limited special abilities that you may use to help advance through the level. The in-game status bar displays the name of each ability and how many times it can be used during that level.",
            thumbnail: "https://tinyurl.com/4usmwc8w",
            background: "https://tinyurl.com/zuysuszd",
            props: {
              rom: "https://tinyurl.com/wffek74"
            }
          },
          {
            title: "Slide Boy",
            longTitle: "Slide Boy in Mazeland",
            type: "7800",
            description: "Slide your way out of dangerous mazes, avoid the obstacles, activate some switches and exit each room before the time run out.",
            thumbnail: "https://tinyurl.com/jvkn9h92",
            background: "https://tinyurl.com/292r6tkm",
            props: {
              rom: "https://tinyurl.com/r5a5ekhb"
            }
          }
        ]
      }
    ]
  }

  /*
  title: "Example Feed",
  categories: [{
    title: "Example Category",
    items: [{
      "title": "Freedoom II",
      "type": "doom",
      "props": {
        "game": "freedoom2"
      }
    }]
  }]
};
*/

  return assignIds(feed);
}

export {
  addId,
  addItemsToCategory,
  cloneCategories,
  deleteCategories,
  deleteItemsFromCategory,
  exportFeed,
  getCategory,
  getItem,
  moveCategoriesUp,
  moveCategoriesDown,
  newFeed,
  replaceCategory,
  replaceItem,
  loadFeedFromFile,
  loadFeedFromUrl
};