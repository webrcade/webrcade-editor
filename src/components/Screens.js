import * as React from 'react';

import CategoryEditor from './CategoryEditor'; 
import CreateFromUrlDialog from './CreateFromUrlDialog';
import DisplayMessage from './DisplayMessage'; 
import FeedEditor from './FeedEditor';
import ImportDialog from './ImportDialog';
import ItemEditor from './item-editor/ItemEditor';

export default function Screens() {

  return (
    <>
      <CategoryEditor />
      <CreateFromUrlDialog />
      <FeedEditor />
      <DisplayMessage />
      <ImportDialog/>
      <ItemEditor />
    </>
  );
}