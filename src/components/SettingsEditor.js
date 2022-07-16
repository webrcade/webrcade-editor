import * as React from 'react';
import Tab from '@mui/material/Tab';

import * as Util from '../Util';
import Editor from './common/editor/Editor';
import EditorSwitch from './common/editor/EditorSwitch';
import EditorTabPanel from './common/editor/EditorTabPanel';
import { GlobalHolder } from '../Global';

import { settings } from '@webrcade/app-common'

function DisplayTab(props) {
  const {
    tabValue,
    tabIndex,
    values,
    setValues
  } = props;

  return (
    <EditorTabPanel value={tabValue} index={tabIndex}>
      <div>
        <EditorSwitch
          label="Vertical sync"
          tooltip="Whether to attempt to sync the application's (emulator, etc.) refresh rate with the current display."
          onChange={(e) => {
            const vals = { ...values, vsync: e.target.checked };
            setValues(vals);
          }}
          checked={Util.asBoolean(values.vsync)}
        />
      </div>
      <div>
        <EditorSwitch
          label="Bilinear filter"
          tooltip="Whether to apply a bilinear filter to the application's (emulator, etc.) output."
          onChange={(e) => {
            const vals = { ...values, bilinear: e.target.checked };
            setValues(vals);
          }}
          checked={Util.asBoolean(values.bilinear)}
        />
      </div>
    </EditorTabPanel>
  );
}

function AdvancedTab(props) {
  const {
    tabValue,
    tabIndex,
    values,
    setValues
  } = props;

  return (
    <EditorTabPanel value={tabValue} index={tabIndex}>
      <div>
        <EditorSwitch
          label="Experimental apps"
          tooltip="Whether to enable experimental applications (not ready for general public release)."
          onChange={(e) => {
            const vals = { ...values, expApps: e.target.checked };
            setValues(vals);
          }}
          checked={Util.asBoolean(values.expApps)}
        />
      </div>
    </EditorTabPanel>
  );
}

export default function SettingsEditor(props) {
  const [tabValue, setTabValue] = React.useState(0);
  const [isOpen, setOpen] = React.useState(false);
  const [values, setValues] = React.useState({});

  GlobalHolder.setSettingsEditorOpen = (open) => {
    setOpen(open);
  }

  const forceUpdate = Util.useForceUpdate();

  const displayTab = 0;
  const advancedTab = 1;

  return (
    <Editor
      title={"Settings"}
      height={250}
      maxWidth={false}
      isOpen={isOpen}
      setOpen={setOpen}
      tabValue={tabValue}
      setTabValue={setTabValue}
      onShow={() => {
        // setCategory(Util.cloneObject(category))
        const vals = {
          expApps: settings.isExpAppsEnabled(),
          vsync: settings.isVsyncEnabled(),
          bilinear: settings.isBilinearFilterEnabled()
        }
        setValues({
          ...vals,
          originalValues : vals
        })
        forceUpdate();
      }}
      onOk={() => {

        settings.setExpAppsEnabled(values.expApps);
        settings.setVsyncEnabled(values.vsync);
        settings.setBilinearFilterEnabled(values.bilinear);
        settings.save().finally(() => {
          if (values.originalValues.expApps !== values.expApps) {
            window.location.reload();
          } else {
            setOpen(false);
          }
        });
        return false;
      }}
      tabs={[
        <Tab label="Display" key={displayTab} />,
        <Tab label="Advanced" key={advancedTab} />,
      ]}
      tabPanels={(
        <>
          <DisplayTab
            tabValue={tabValue}
            tabIndex={displayTab}
            setValues={setValues}
            values={values}
          />
          <AdvancedTab
            tabValue={tabValue}
            tabIndex={advancedTab}
            setValues={setValues}
            values={values}
          />
        </>
      )}
    />
  );
}
