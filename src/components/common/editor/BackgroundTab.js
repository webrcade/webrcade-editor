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
    onChange
  } = props;
  const [backgroundError, setBackgroundError] = React.useState(null);

  return (
    <EditorTabPanel value={tabValue} index={tabIndex}>
      <div>
        <EditorTextField
          sx={{ width: '50ch' }}
          label="Background location (URL)"
          onChange={onChange}
          value={Util.asString(thumbSrc)}
          helperText={backgroundError}
          color={backgroundError ? "warning" : undefined}
          focused={backgroundError ? true : false}
        />
      </div>
      <div>
        <EditorImage
          src={thumbSrc}
          defaultSrc={defaultThumbSrc}
          errorCallback={setBackgroundError}
          sx={{
            objectFit: 'cover',
            height: '100%'
          }}
        />
      </div>
    </EditorTabPanel>
  );
}
