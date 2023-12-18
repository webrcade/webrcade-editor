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
import { GenerateManifestDialog } from './cloud/generate-manifest/GenerateManifestDialog';
import { RepackageDialog } from './tools/repackage/RepackageDialog';
import { SelectCloudFolderDialog } from './cloud/generate-manifest/SelectCloudFolderDialog';
import { DownloadFileDialog } from './DownloadFileDialog';

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
      <GenerateManifestDialog />
      <RepackageDialog />
      <SelectCloudFolderDialog />
      <DownloadFileDialog />
    </>
  );
}