import * as React from 'react';

import CategoryEditor from './CategoryEditor'; 
import DisplayMessage from './DisplayMessage'; 
import FeedEditor from './FeedEditor';
import ImportDialog from './ImportDialog';
import ItemEditor from './item-editor/ItemEditor';

export default function Screens() {

  return (
    <>
      <CategoryEditor />
      <FeedEditor />
      <DisplayMessage />
      <ImportDialog/>
      <ItemEditor />
    </>
  );
}