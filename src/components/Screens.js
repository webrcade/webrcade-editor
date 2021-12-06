import * as React from 'react';

import CategoryEditor from './CategoryEditor'; 
import ConfirmDialog from './ConfirmDialog';
import CreateFromUrlDialog from './CreateFromUrlDialog';
import DisplayMessage from './DisplayMessage'; 
import FeedEditor from './FeedEditor';
import ImportDialog from './ImportDialog';
import ItemEditor from './item-editor/ItemEditor';
import LoadFeedDialog from './load-dialog/LoadFeedDialog';

export default function Screens() {

  return (
    <>
      <CategoryEditor />
      <CreateFromUrlDialog />
      <FeedEditor />
      <DisplayMessage />
      <ImportDialog/>
      <ItemEditor />
      <ConfirmDialog />
      <LoadFeedDialog />
    </>
  );
}