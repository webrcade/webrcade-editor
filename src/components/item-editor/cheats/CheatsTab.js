import * as React from 'react';

import * as WrcCommon from '@webrcade/app-common';
import * as Feed from '../../../Feed';
import { uploadSingleFile } from '../../../LocalFileProcessor';
import { Global } from '../../../Global';
import EditorTabPanel from '../../common/editor/EditorTabPanel';
import EditorUrlField from '../../common/editor/EditorUrlField';
import * as Util from '../../../Util';
import GameRegistry from '../../../GameRegistry';
import CheatDatabaseDialog from './CheatDatabaseDialog';

export default function CheatsTab(props) {
  const {
    tabValue,
    tabIndex,
    object,
    setObject,
  } = props;

  const [dbDialogOpen, setDbDialogOpen] = React.useState(false);
  const cheatEntry = GameRegistry.getCheatEntry(object.type);

  const cloudEnabled = WrcCommon.settings.isCloudStorageEnabled();
  const uploadItemFile = cloudEnabled
    ? (file, onProgress) => {
        const feed = Global.getFeed();
        const category = Feed.getCategory(feed, Global.getFeedCategoryId());
        return uploadSingleFile(file, Feed.resolveCategoryItemsPath(feed, category), onProgress);
      }
    : undefined;

  const extraMenuItems = cheatEntry ? [
    {
      label: 'Browse Cheat Database...',
      onClick: () => setDbDialogOpen(true),
      icon: (
        <span
          className="iconify"
          data-icon="mdi:lightning-bolt"
          data-width="20"
          data-height="20"
        />
      ),
    }
  ] : null;

  return (
    <EditorTabPanel value={tabValue} index={tabIndex}>
      <div>
        <EditorUrlField
          sx={{ width: '50ch' }}
          label="Cheat File (URL)"
          extraMenuItems={extraMenuItems}
          onFileUpload={uploadItemFile}
          onDropText={(text) => {
            const props = { ...object.props, cheat: text }
            setObject({ ...object, props })
          }}
          onChange={(e) => {
            const props = { ...object.props, cheat: e.target.value }
            setObject({ ...object, props })
          }}
          value={Util.asString(object.props.cheat)}
        />
      </div>
      {cheatEntry && dbDialogOpen &&
        <CheatDatabaseDialog
          open={dbDialogOpen}
          onClose={() => setDbDialogOpen(false)}
          onSelect={(url) => {
            const props = { ...object.props, cheat: url }
            setObject({ ...object, props })
            setDbDialogOpen(false);
          }}
          cheatEntry={cheatEntry}
          initialSearch={Util.asString(object.title)}
        />
      }
    </EditorTabPanel>
  );
}

