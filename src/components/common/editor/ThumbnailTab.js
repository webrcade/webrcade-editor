import * as React from 'react';

import { Global } from '../../../Global';
import * as Util from '../../../Util';
import EditorImage from '../../common/editor/EditorImage';
import EditorTabPanel from '../../common/editor/EditorTabPanel';
import EditorUrlField from '../../common/editor/EditorUrlField';

export default function ThumbnailTab(props) {
  const {
    tabValue,
    tabIndex,
    thumbSrc,
    defaultThumbSrc,
    setObject,
    object
  } = props;
  const [thumbnailError, setThumbnailError] = React.useState(null);

  return (
    <EditorTabPanel value={tabValue} index={tabIndex}>
      <div>
        <EditorUrlField
          sx={{ width: '50ch' }}
          label="Thumbnail location (URL)"
          value={Util.asString(thumbSrc)}
          helperText={thumbnailError}
          color={thumbnailError ? "warning" : undefined}
          focused={thumbnailError ? true : false}
          onDropText={(text) => { setObject({ ...object, thumbnail: text }) }}
          onChange={(e) => { setObject({ ...object, thumbnail: e.target.value }) }}
        />
      </div>
      <div>
        <EditorImage
          src={thumbSrc}
          defaultSrc={defaultThumbSrc}
          requiredAspectRatio={Global.getThumbAspectRatio()}
          errorCallback={setThumbnailError}
          onDropText={(text) => { setObject({ ...object, thumbnail: text }) }}
        />
      </div>
    </EditorTabPanel>
  );
}
