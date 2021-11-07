import * as React from 'react';

import { GlobalHolder } from '../Global';
import * as Feed from '../Feed';
import * as Util from '../Util';
import ItemsTable from './ItemsTable';
import SelectCategory from './SelectCategory';

export default function ItemsTab(props) {
  const { feed } = props;
  const [category, setCategory] = React.useState("");

  const prevFeed = Util.usePrevious(feed);

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
