import * as React from 'react';

import { GlobalHolder } from '../Global';
import ItemsTable from './ItemsTable';
import SelectCategory from './SelectCategory';

export default function ItemsTab(props) {
  const { feed } = props;
  const [category, setCategory] = React.useState("");

  GlobalHolder.setFeedCategoryId = setCategory;

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
