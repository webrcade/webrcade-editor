import * as React from 'react';

import BusyScreen from './BusyScreen';
import CategoryEditor from './CategoryEditor'; 
import DisplayMessage from './DisplayMessage'; 
import ImportDialog from './ImportDialog';
import ItemEditor from './item-editor/ItemEditor';

export default function Screens() {

  return (
    <>
      <BusyScreen />
      <CategoryEditor />
      <DisplayMessage />
      <ImportDialog/>
      <ItemEditor />
    </>
  );
}