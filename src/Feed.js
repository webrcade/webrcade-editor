import { 
  uuidv4,
  Feed,
  FetchAppData,  
  LOG,
} from '@webrcade/app-common'

const assignIds = (feed) => {
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
        return assignIds(new Feed(feedJson, 0));
      })
      .then(feed => {
        resolve([feed, feedJson]);
      })
      .catch(msg => {
        // TODO: Error with ...
        reject('Error reading feed: ' + msg);
      })
  });
}

export { loadFeedFromUrl };