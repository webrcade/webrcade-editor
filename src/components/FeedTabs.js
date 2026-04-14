import * as React from 'react';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { Global, GlobalHolder } from '../Global';
import CategoriesTable from './CategoriesTable';
import ItemsTab from './ItemsTab';
import SearchTab from './SearchTab';
import Prefs from '../Prefs';
import { usePrevious } from '../Util';

function TabPanel(props) {
  const { children, value, index } = props;

  return (
    <div hidden={value !== index}>
      <Box sx={{ pt: 3 }}>
        {children}
      </Box>
    </div>
  );
}

const PREF_FEED_TAB = "feedsTab.tab";

function FeedTabs(props) {
  const { feed } = props;
  const [tabValue, setTabValue] =
    React.useState(Math.min(Prefs.getIntPreference(PREF_FEED_TAB, 0), 1));
  const [searchVisible, setSearchVisible] = React.useState(false);
  const [lastTab, setLastTab] = React.useState(0);
  const prevTabValue = usePrevious(tabValue);

  const closeSearch = () => {
    setSearchVisible(false);
    setTabValue(lastTab);
  };

  GlobalHolder.toggleSearch = () => {
    if (searchVisible) {
      closeSearch();
    } else {
      setLastTab(tabValue);
      setSearchVisible(true);
      setTabValue(2);
      if (GlobalHolder.focusSearch) GlobalHolder.focusSearch();
    }
  };

  // Store prefs (if applicable)
  React.useEffect(() => {
    if (prevTabValue !== tabValue && tabValue !== 2) {
      Prefs.setPreference(PREF_FEED_TAB, tabValue);
      Prefs.save();
    }
  }, [prevTabValue, tabValue]);

  function tabProps(index) {
    return { id: `feed-tab-${index}` };
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const showCategoryItems = (catId) => {
    Global.setFeedCategoryId(catId);
    setTabValue(1);
  };

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Categories" {...tabProps(0)} />
          <Tab label="Items" {...tabProps(1)} />
          {searchVisible && (
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Search
                  <IconButton
                    size="small"
                    onClick={(e) => { e.stopPropagation(); closeSearch(); }}
                    sx={{ ml: 0.5, p: 0 }}
                  >
                    <CloseIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                </Box>
              }
              {...tabProps(2)}
            />
          )}
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
        <CategoriesTable
          feed={feed}
          showCategoryItems={showCategoryItems}
        />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <ItemsTab feed={feed} />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <SearchTab key={feed.id} feed={feed} />
      </TabPanel>
    </>
  );
}

export default FeedTabs;