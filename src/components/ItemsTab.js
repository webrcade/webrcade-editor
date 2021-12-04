import * as React from 'react';

import { GlobalHolder } from '../Global';
import * as Feed from '../Feed';
import * as Util from '../Util';
import ItemsTable from './ItemsTable';
import Prefs from '../Prefs';
import SelectCategory from './SelectCategory';

const PREF_CURRENT_CAT = "currentCategory";

export default function ItemsTab(props) {
  const { feed } = props;
  const [category, setCategory] = 
    React.useState(Prefs.getPreference(PREF_CURRENT_CAT, ""));

  const prevFeed = Util.usePrevious(feed);
  const prevCategory = Util.usePrevious(category);

  GlobalHolder.setFeedCategoryId = setCategory;
  GlobalHolder.getFeedCategoryId = () => {
    return category;
  } 

  // Reset page if key changes
  React.useEffect(() => {  
    if (prevFeed !== feed && !Feed.getCategory(feed, category)) {            
      setCategory(
        feed.categories && feed.categories.length > 0 ?
          feed.categories[0].id : "");
      }
  }, [feed, prevFeed, category, setCategory]);

  // Update prefs if category changes
  React.useEffect(() => {  
    if (prevCategory !== category) {            
      Prefs.setPreference(PREF_CURRENT_CAT, category);
      Prefs.save();
    }
  }, [category, prevCategory]);

  return (
    <>
      <SelectCategory 
        feed={feed} 
        category={category}
        setCategory={setCategory} />
      <ItemsTable 
        feed={feed} 
        category={category}
      />
    </>
  );
}
