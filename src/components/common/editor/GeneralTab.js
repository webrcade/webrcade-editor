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
    validator,
    addValidateCallback,
    otherFields,
    nameField
  } = props;

  React.useEffect(() => {
    if (addValidateCallback) {
      addValidateCallback(
        "GeneralTab-" + tabIndex,
        () => { validator.checkMinLength(tabIndex, "title", object.title); }
      );
    }
  }, [addValidateCallback, object, tabIndex, validator]);

  return (
    <EditorTabPanel value={tabValue} index={tabIndex}>
      {nameField ? nameField : (
        <div>
          <EditorTextField
            required
            label="Title"
            onDropText={(text) => { setObject({ ...object, title: text }) }}
            onChange={(e) => { setObject({ ...object, title: e.target.value }) }}
            value={Util.asString(object.title)}
            error={!validator.isValid(tabIndex, "title")}
          />
      </div>)
      }
      <div>
        <EditorTextField
          sx={{ width: '50ch' }}
          label="Long title"
          onDropText={(text) => { setObject({ ...object, longTitle: text }) }}
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
          onDropText={(text) => { setObject({ ...object, description: text }) }}
          onChange={(e) => { setObject({ ...object, description: e.target.value }) }}
          value={Util.asString(object.description)}
        />
      </div>
      {otherFields}
    </EditorTabPanel>
  );
}
