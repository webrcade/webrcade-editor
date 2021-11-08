import * as React from 'react';

import BusyScreen from './BusyScreen';
import CategoryEditor from './CategoryEditor'; 
import DisplayMessage from './DisplayMessage'; 
import FeedEditor from './FeedEditor';
import ImportDialog from './ImportDialog';
import ItemEditor from './item-editor/ItemEditor';

export default function Screens() {

  return (
    <>
      <BusyScreen />
      <CategoryEditor />
      <FeedEditor />
      <DisplayMessage />
      <ImportDialog/>
      <ItemEditor />
    </>
  );
}