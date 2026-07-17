import * as React from 'react';

import * as WrcCommon from '@webrcade/app-common';
import * as Feed from '../../../Feed';
import { uploadSingleFile } from '../../../LocalFileProcessor';
import { Global } from '../../../Global';
import EditorTabPanel from '../../common/editor/EditorTabPanel';
import EditorTextField from '../../common/editor/EditorTextField';
import EditorUrlField from '../../common/editor/EditorUrlField';
import * as Util from '../../../Util';

export default function NdsHomebrewTab(props) {
  const {
    tabValue,
    tabIndex,
    setObject,
    object,
  } = props;

  const cloudEnabled = WrcCommon.settings.isCloudStorageEnabled();
  const uploadItemFile = cloudEnabled
    ? (file, onProgress) => {
        const feed = Global.getFeed();
        const category = Feed.getCategory(feed, Global.getFeedCategoryId());
        return uploadSingleFile(file, Feed.resolveCategoryItemsPath(feed, category), onProgress);
      }
    : undefined;

  return (
    <EditorTabPanel value={tabValue} index={tabIndex}>
      <div>
        <EditorUrlField
          sx={{ width: '50ch' }}
          label="SD Card Archive (URL)"
          onFileUpload={uploadItemFile}
          onDropText={(text) => {
            const props = { ...object.props, sdCardArchive: text }
            setObject({ ...object, props })
          }}
          onChange={(e) => {
            const props = { ...object.props, sdCardArchive: e.target.value }
            setObject({ ...object, props })
          }}
          value={Util.asString(object.props.sdCardArchive)}
        />
      </div>
      <div>
        <EditorTextField
          sx={{ width: '50ch' }}
          label="SD Card Path"
          tooltip="Path prefix for files in the archive (e.g. /roms/). Defaults to root (/) if empty."
          onChange={(e) => {
            const props = { ...object.props, sdCardPath: e.target.value }
            setObject({ ...object, props })
          }}
          value={Util.asString(object.props.sdCardPath)}
        />
      </div>
    </EditorTabPanel>
  );
}
