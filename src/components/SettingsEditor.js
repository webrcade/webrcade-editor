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
import EditorTextField from './common/editor/EditorTextField';
import EditorValidator from './common/editor/EditorValidator';
import AppsTab from './common/editor/AppsTab';
import { Global, GlobalHolder } from '../Global';

import { dropbox, settings, achievements, Resources, SCREEN_SIZES, TEXT_IDS } from '@webrcade/app-common'


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
          <Button sx={{ ml: 1.5 }} variant="outlined" startIcon={values.dbLinked ? <LinkOffIcon /> : <LinkIcon />}
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
      {values.cloudStorage && (
        <div>
          <EditorSwitch
            label="Disable saves after state load"
            tooltip="Whether to disable in-games saves after loading a save state."
            onChange={(e) => {
              const vals = { ...values, disableInGame: e.target.checked };
              setValues(vals);
            }}
            checked={Util.asBoolean(values.disableInGame)}
          />
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

const raValidator = new EditorValidator();

function AchievementsTab(props) {
  const { tabValue, tabIndex, values, setValues } = props;
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [okCount, setOkCount] = React.useState(0);

  const raEnabled = Boolean(values.raEnabled);
  const raLinked = Boolean(values.raLinked);

  const usernameValid = raValidator.isValid(tabIndex, 'username');
  const passwordValid = raValidator.isValid(tabIndex, 'password');

  return (
    <EditorTabPanel value={tabValue} index={tabIndex}>
      <div>
        <EditorSwitch
          label="Enabled"
          tooltip="Whether to enable RetroAchievements support."
          onChange={(e) => setValues({ ...values, raEnabled: e.target.checked })}
          checked={raEnabled}
        />
      </div>
      {raEnabled && !raLinked && (
        <>
          <div>
            <EditorTextField
              required
              sx={{ mt: 0.0 }}
              label="Username"
              value={username}
              error={!usernameValid}
              onChange={(e) => {
                setUsername(e.target.value);
                raValidator.checkMinLength(tabIndex, 'username', e.target.value);
              }}
            />
          </div>
          <div>
            <EditorTextField
              required
              sx={{ mb: 3 }}
              label="Password"
              type="password"
              value={password}
              error={!passwordValid}
              onChange={(e) => {
                setPassword(e.target.value);
                raValidator.checkMinLength(tabIndex, 'password', e.target.value);
              }}
            />
          </div>
        </>
      )}
      {raEnabled && (
        <>
          <div>
            <Button
              variant="outlined"
              startIcon={raLinked ? <LinkOffIcon /> : <LinkIcon />}
              sx={{ ml: 1.5 }}
              onClick={() => {
                if (!raLinked) {
                  raValidator.checkMinLength(tabIndex, 'username', username);
                  raValidator.checkMinLength(tabIndex, 'password', password);
                  setOkCount(okCount + 1);
                  if (raValidator.getMinInvalidTab() >= 0) return;
                  achievements.login(username, password)
                    .then((result) => {
                      if (result.success) {
                        setValues({ ...values, raLinked: true });
                        setUsername('');
                        setPassword('');
                        raValidator.reset();
                        Global.displayMessage('Successfully logged into RetroAchievements.', 'success');
                      } else {
                        Global.displayMessage(result.error, 'error');
                      }
                    })
                    .catch((e) => Global.displayMessage(e.message, 'error'));
                } else {
                  achievements.logout()
                    .then(() => {
                      setValues({ ...values, raLinked: false });
                      raValidator.reset();
                      setUsername('');
                      setPassword('');
                    })
                    .catch((e) => Global.displayMessage(e.message, 'error'));
                }
              }}
            >
              {raLinked ? 'Logout From Retro Achievements' : 'Login To Retro Achievements'}
            </Button>
          </div>
        </>
      )}
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
  const appsTab = 1;
  const cloudStorageTab = 2;
  const achievementsTab = 3;
  const advancedTab = 4;

  return (
    <Editor
      title={"Settings"}
      // height={400}
      isOpen={isOpen}
      setOpen={setOpen}
      tabValue={tabValue}
      setTabValue={setTabValue}
      onShow={() => {
        // setCategory(Util.cloneObject(category))
        const vals = {
          raEnabled: settings.isRaEnabled(),
          raLinked: settings.getRaToken() !== null,
          expApps: settings.isExpAppsEnabled(),
          vsync: settings.isVsyncEnabled(),
          bilinear: settings.isBilinearFilterEnabled(),
          cloudStorage: settings.isCloudStorageEnabled(),
          screenSize: settings.getScreenSize(),
          dbLinked: settings.getDbToken() !== null,
          disableInGame: settings.isGameSavesDisabledAfterState(),
          overrides: settings.getOverrides() ? settings.getOverrides() : {}
        }
        setValues({
          ...vals,
          originalValues: vals
        })
        forceUpdate();
      }}
      onOk={() => {
        // If enabled but not linked, turn off
        if (values.cloudStorage && !values.dbLinked) values.cloudStorage = false;
        if (values.raEnabled && !values.raLinked) values.raEnabled = false;
        settings.setExpAppsEnabled(values.expApps);
        settings.setRaEnabled(values.raEnabled);
        settings.setVsyncEnabled(values.vsync);
        settings.setBilinearFilterEnabled(values.bilinear);
        settings.setScreenSize(values.screenSize);
        settings.setCloudStorageEnabled(values.cloudStorage);
        settings.setGameSavesDisabledAfterState(values.disableInGame);
        settings.setOverrides(values.overrides)
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
        <Tab label="Applications" key={appsTab} />,
        <Tab label="Cloud Storage" key={cloudStorageTab} />,
        <Tab label="Achievements" key={achievementsTab} />,
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
          <AppsTab
            isUser={true}
            tabValue={tabValue}
            tabIndex={appsTab}
            overrides={values.overrides ? values.overrides : {}}
            setOverrides={(overrides) => {
              const vals = { ...values, overrides: overrides }
              setValues(vals);
            }}
          />
          <CloudStorageTab
            tabValue={tabValue}
            tabIndex={cloudStorageTab}
            setValues={setValues}
            values={values}
          />
          <AchievementsTab
            tabValue={tabValue}
            tabIndex={achievementsTab}
            values={values}
            setValues={setValues}
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
