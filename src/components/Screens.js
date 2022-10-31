import * as React from 'react';

import CategoryEditor from './CategoryEditor';
import ConfirmDialog from './ConfirmDialog';
import CopyLinkDialog from './CopyLinkDialog';
import CreateFromUrlDialog from './CreateFromUrlDialog';
import DisplayMessage from './DisplayMessage';
import ExportDialog from './ExportDialog';
import FeedEditor from './FeedEditor';
import ImportDialog from './ImportDialog';
import ItemEditor from './item-editor/ItemEditor';
import LoadFeedDialog from './load-dialog/LoadFeedDialog';
import SettingsEditor from './SettingsEditor';

export default function Screens() {

  return (
    <>
      <CategoryEditor />
      <CopyLinkDialog />
      <CreateFromUrlDialog />
      <FeedEditor />
      <DisplayMessage />
      <ExportDialog />
      <ImportDialog/>
      <ItemEditor />
      <ConfirmDialog />
      <LoadFeedDialog />
      <SettingsEditor />
    </>
  );
}