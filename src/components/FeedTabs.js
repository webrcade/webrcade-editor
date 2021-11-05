import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import CategoriesTable from './CategoriesTable';
import ItemsTab from './ItemsTab';

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

function FeedTabs(props) {
  const { feed } = props;
  const [tabValue, setTabValue] = React.useState(0);

  function tabProps(index) {
    return { id: `feed-tab-${index}` };
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
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
        <CategoriesTable feed={feed} />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <ItemsTab feed={feed} />
      </TabPanel>
    </>
  );
}

export default FeedTabs;