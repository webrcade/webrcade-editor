import { 
  uuidv4,
  Feed,
  FetchAppData,  
} from '@webrcade/app-common'

import * as Util from './Util';

const findItem = (feed, categoryId, itemId) => {
  if (feed.categories) {
    for(let i = 0; i < feed.categories.length; i++) {
      const cat = feed.categories[i];
      if (cat.items && categoryId === cat.id) {
        for(let j = 0; j < cat.items.length; j++) {
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

const deleteItemsFromCategory = (feed, categoryId, itemIds) => {
  const itemIdsMap = {};
  itemIds.forEach((id) => {
    itemIdsMap[id] = true;
  });
  const cat = getCategory(feed, categoryId);
  if (cat && cat.items) {
    for (let i = cat.items.length - 1; i >= 0; i--) {
      if(itemIdsMap[cat.items[i].id]) {
        cat.items.splice(i, 1);
      }
    }
  }
} 

const getCategory = (feed, categoryId) => {
  if (feed.categories) {
    for(let i = 0; i < feed.categories.length; i++) {
      const cat = feed.categories[i];
      if (categoryId === cat.id) {
        return cat;
      }
    }
  }
  return null;
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

const loadFeedFromUrl = (url) => {
  return new Promise((resolve, reject) => {
    let feedJson = null;
    new FetchAppData(url).fetch()
      .then(response => response.json())
      .then(json => {
        feedJson = json;
        const feed = new Feed(feedJson, 0);
        feedJson = feed.getClonedFeed();
        assignIds(feedJson);
        return feed;
      })
      .then(feed => {
        console.log(feedJson);
        resolve([feed, feedJson]);
      })
      .catch(msg => {
        // TODO: Error with ...
        reject('Error reading feed: ' + msg);
      })
  });
}

export { 
  addId,
  addItemsToCategory,
  deleteItemsFromCategory,
  getCategory,
  getItem,
  replaceItem,
  loadFeedFromUrl 
};