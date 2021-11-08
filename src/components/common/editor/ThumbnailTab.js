import * as React from 'react';

import { Global } from '../../../Global';
import * as Util from '../../../Util';
import EditorImage from '../../common/editor/EditorImage';
import EditorTabPanel from '../../common/editor/EditorTabPanel';
import EditorTextField from '../../common/editor/EditorTextField';

export default function ThumbnailTab(props) {
  const {
    tabValue,
    tabIndex,
    thumbSrc, 
    defaultThumbSrc,
    onChange
  } = props;
  const [thumbnailError, setThumbnailError] = React.useState(null);

  return (
    <EditorTabPanel value={tabValue} index={tabIndex}>
      <div>
        <EditorTextField
          sx={{ width: '50ch' }}
          label="Thumbnail location (URL)"
          onChange={onChange}
          value={Util.asString(thumbSrc)}
          helperText={thumbnailError}
          color={thumbnailError ? "warning" : undefined}
          focused={thumbnailError ? true : false}
        />
      </div>
      <div>
        <EditorImage
          src={thumbSrc}
          defaultSrc={defaultThumbSrc}
          requiredSize={Global.getThumbSize()}
          errorCallback={setThumbnailError}
        />
      </div>
    </EditorTabPanel>
  );
}
