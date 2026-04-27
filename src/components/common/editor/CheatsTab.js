import * as React from 'react';

import EditorTabPanel from '../../common/editor/EditorTabPanel';
import EditorUrlField from '../../common/editor/EditorUrlField';
import * as Util from '../../../Util';

export default function CheatsTab(props) {
  const {
    tabValue,
    tabIndex,
    object,
    setObject,
  } = props;

  return (
    <EditorTabPanel value={tabValue} index={tabIndex}>
      <div>
        <EditorUrlField
          sx={{ width: '50ch' }}
          label="Cheat File (URL)"
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
    </EditorTabPanel>
  );
}
