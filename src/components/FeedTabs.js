import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { Global } from '../Global';
import CategoriesTable from './CategoriesTable';
import ItemsTab from './ItemsTab';
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
    React.useState(Prefs.getIntPreference(PREF_FEED_TAB, 0));
  const prevTabValue = usePrevious(tabValue);

  // Store prefs (if applicable)
  React.useEffect(() => {
    // See if tab has changed
    if (prevTabValue !== tabValue) {
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
    </>
  );
}

export default FeedTabs;