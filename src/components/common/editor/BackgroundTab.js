import * as React from 'react';

import * as Util from '../../../Util';
import EditorImage from '../../common/editor/EditorImage';
import EditorTabPanel from '../../common/editor/EditorTabPanel';
import EditorTextField from '../../common/editor/EditorTextField';

export default function BackgroundTab(props) {
  const {
    tabValue,
    tabIndex,
    thumbSrc,
    defaultThumbSrc,
    object,
    setObject
  } = props;
  const [backgroundError, setBackgroundError] = React.useState(null);

  return (
    <EditorTabPanel value={tabValue} index={tabIndex}>
      <div>
        <EditorTextField
          sx={{ width: '50ch' }}
          label="Background location (URL)"
          value={Util.asString(thumbSrc)}
          helperText={backgroundError}
          color={backgroundError ? "warning" : undefined}
          focused={backgroundError ? true : false}
          onDropText={(text) => { setObject({ ...object, background: text }) }}
          onChange={(e) => { setObject({ ...object, background: e.target.value }) }}
        />
      </div>
      <div>
        <EditorImage
          src={thumbSrc}
          defaultSrc={defaultThumbSrc}
          errorCallback={setBackgroundError}
          onDropText={(text) => { setObject({ ...object, background: text }) }}
          sx={{
            objectFit: 'cover',
            height: '100%'
          }}
        />
      </div>
    </EditorTabPanel>
  );
}
