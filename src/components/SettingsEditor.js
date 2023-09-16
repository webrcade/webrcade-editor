import * as React from 'react';
import Button from '@mui/material/Button';
import Tab from '@mui/material/Tab';
import LinkIcon from '@mui/icons-material/Link';
import LinkOffIcon from '@mui/icons-material/LinkOff';

import * as Util from '../Util';
import Editor from './common/editor/Editor';
import EditorSelect from './common/editor/EditorSelect';
import EditorSwitch from './common/editor/EditorSwitch';
import EditorTabPanel from './common/editor/EditorTabPanel';
import { Global, GlobalHolder } from '../Global';

import { dropbox, settings, Resources, SCREEN_SIZES, TEXT_IDS } from '@webrcade/app-common'


function CloudStorageTab(props) {
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
          label="Enabled"
          tooltip="Whether to enable cloud-based storage of game saves."
          onChange={(e) => {
            const vals = { ...values, cloudStorage: e.target.checked };
            setValues(vals);
          }}
          checked={Util.asBoolean(values.cloudStorage)}
        />
      </div>
      {values.cloudStorage && (
        <div>
          <Button variant="outlined" startIcon={values.dbLinked ? <LinkOffIcon /> : <LinkIcon />}
            onClick={() => {
              if (!values.dbLinked) {
                // Force cloud storage to be enabled
                settings.setCloudStorageEnabled(true);
                settings.save().finally(() => {
                  dropbox.link()
                    .catch((e) => Global.displayMessage(e, "error"));
                });
              } else {
                settings.setDbToken(null);
                settings.save().finally(() => {
                  setValues({ ...values, ...{ dbLinked: false } });
                });
              }
            }}
          >
            {values.dbLinked ? "Unlink from Dropbox" : "Link to Dropbox"}
          </Button>
        </div>
      )}
    </EditorTabPanel>
  );
}

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
        <EditorSelect
          label="Screen Size"
          tooltip="The screen size to use for displaying the application."
          value={values.screenSize ? values.screenSize : SCREEN_SIZES.SS_NATIVE}
          menuItems={[
            { value: SCREEN_SIZES.SS_NATIVE, name: Resources.getText(TEXT_IDS.SS_NATIVE)},
            { value: SCREEN_SIZES.SS_16_9, name: Resources.getText(TEXT_IDS.SS_16_9)},
            { value: SCREEN_SIZES.SS_FILL, name: Resources.getText(TEXT_IDS.SS_FILL)},
          ]}
          onChange={(e) => {
            const vals = { ...values, screenSize: e.target.value }
            setValues(vals);
          }}
        />
      </div>
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
  const cloudStorageTab = 1;
  const advancedTab = 2;

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
          bilinear: settings.isBilinearFilterEnabled(),
          cloudStorage: settings.isCloudStorageEnabled(),
          screenSize: settings.getScreenSize(),
          dbLinked: settings.getDbToken() !== null
        }
        setValues({
          ...vals,
          originalValues: vals
        })
        forceUpdate();
      }}
      onOk={() => {
        settings.setExpAppsEnabled(values.expApps);
        settings.setVsyncEnabled(values.vsync);
        settings.setBilinearFilterEnabled(values.bilinear);
        settings.setScreenSize(values.screenSize);
        settings.setCloudStorageEnabled(values.cloudStorage);
        settings.save().finally(() => {
          if (values.originalValues.expApps !== values.expApps) {
            window.location.reload();
          } else {
            setOpen(false);
          }
        });
        Global.forceRefresh();
        return false;
      }}
      tabs={[
        <Tab label="Display" key={displayTab} />,
        <Tab label="Cloud Storage" key={cloudStorageTab} />,
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
          <CloudStorageTab
            tabValue={tabValue}
            tabIndex={cloudStorageTab}
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
