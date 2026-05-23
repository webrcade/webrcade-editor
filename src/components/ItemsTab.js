import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';

import { Global, GlobalHolder } from '../Global';
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
      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
        <SelectCategory
          feed={feed}
          category={category}
          setCategory={setCategory} />
        <IconButton
          size="medium"
          disabled={!category}
          sx={{ ml: 1, mt: 1.25 }}
          onClick={() => {
            const cat = Feed.getCategory(feed, category);
            if (cat) Global.editCategory(cat);
          }}
        >
          <EditIcon fontSize="medium" />
        </IconButton>
      </Box>
      <ItemsTable
        feed={feed}
        category={category}
      />
    </>
  );
}
