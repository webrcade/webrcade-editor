import * as React from 'react';

import * as Util from '../../../Util';
import EditorTabPanel from '../../common/editor/EditorTabPanel';
import EditorTextField from '../../common/editor/EditorTextField';

export default function GeneralTab(props) {
  const {
    tabValue,
    tabIndex,
    object,
    setObject,
    validator
  } = props;
  return (
    <EditorTabPanel value={tabValue} index={tabIndex}>
      <div>
        <EditorTextField
          required
          label="Title"
          onChange={(e) => { setObject({ ...object, title: e.target.value }) }}
          value={Util.asString(object.title)}
          error={!validator.isValid(tabIndex, "title")}
        />
      </div>
      <div>
        <EditorTextField
          sx={{ width: '50ch' }}
          label="Long title"
          onChange={(e) => { setObject({ ...object, longTitle: e.target.value }) }}
          value={Util.asString(object.longTitle)}
        />
      </div>
      <div>
        <EditorTextField
          sx={{ width: '50ch' }}
          label="Description"
          multiline
          rows={4}
          onChange={(e) => { setObject({ ...object, description: e.target.value }) }}
          value={Util.asString(object.description)}
        />
      </div>
    </EditorTabPanel>
  );
}
