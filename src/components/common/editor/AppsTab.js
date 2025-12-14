import * as React from 'react';

import EditorTextField from '../../common/editor/EditorTextField';
import EditorTabPanel from '../../common/editor/EditorTabPanel';
import EditorSelect from './EditorSelect';
import EditorButton from './EditorButton';
import { Typography } from '@mui/material';
import {
  AppRegistry,
} from '@webrcade/app-common'


export default function AppsTab(props) {
  const {
    tabValue,
    tabIndex,
    overrides,
    isUser,
    setOverrides,
  } = props;

  const [alias, setAlias] = React.useState("");

  const registry = AppRegistry.instance;

  const aliasToApps = React.useMemo(() => {
    const map = registry.buildAliasToAppsMap();

    // Sort aliases by "human-readable" name
    const sorted = Object.keys(map).sort((a, b) => {
      const an = registry.getGeneralShortNameForType(a);
      const bn = registry.getGeneralShortNameForType(b);
      return an.localeCompare(bn);
    });

    return { map, sorted };
  }, [registry]);

  console.log(overrides)

  const aliasMenuItems = aliasToApps.sorted
    //.filter(a => aliasToApps.map[a].length > 1) // remove aliases with only 1 app
    .map(a => ({
      value: a,
      name: registry.getGeneralShortNameForType(a)
    }));

  const currentAlias = alias === "" ? aliasMenuItems[0].value : alias;
  const def = "__default__";

  const sortedApps = [...aliasToApps.map[currentAlias]].sort((a, b) => {
    // Sort by default first (true comes before false)
    if (a.default && !b.default) return -1;
    if (!a.default && b.default) return 1;

    // Otherwise, sort by name
    return a.name.localeCompare(b.name);
  });

  let description = null;
  const currentAppKey = overrides[currentAlias];
  if (currentAppKey) {
    const app = sortedApps.find(app => app.typeName === currentAppKey);
    if (app) {
      if (app.description) {
        description = app.description;
      } else {
        description = "No description available.";
      }
    }
  }

  return (
    <EditorTabPanel value={tabValue} index={tabIndex}>
      <Typography sx={{ mt: .5, mb: 2 }}>
        Select an application for each alias (or fall back to the defaults)
      </Typography>
      <EditorSelect
        label="Application Alias"
        tooltip="Select the alias (system, etc.) you want to set a default application for."
        value={currentAlias}
        menuItems={aliasMenuItems}
        onChange={(e) => {
          setAlias(e.target.value);
        }}
        sx={{ mb: 1.5 }}
      />
      <EditorSelect
        label="Mapped Application"
        tooltip="Choose application, or use default"
        value={overrides[currentAlias] ? overrides[currentAlias] : def}
        menuItems={[
          { value: def, name: "(use default)" },
          ...sortedApps.map(app => ({
            value: app.typeName,
            name: app.name + (app.default ? " *" : "")
          }))
        ]}
        onChange={(e) => {
          const val = e.target.value;
          if (val === def) {
            if (overrides[currentAlias]) delete overrides[currentAlias];
          } else {
            overrides[currentAlias] = e.target.value;
          }
          setOverrides(overrides)
        }}
        sx={{ mb: 2.0 }}
      />
      {description ?
        <EditorTextField
          label="Application Description"
          value={description}
          multiline
          rows={5}     // fixed height
          sx={{ width: '60ch', mb: 1.5 }}
          InputProps={{ readOnly: true }}
        /> :
        isUser ? (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontStyle: 'italic', ml: 1.5, mb: 2.0, maxWidth: '500px' }}
          >
            Uses the feed-specified application for this alias, or falls back to the alias’s default (which may change over time).
          </Typography>
        ) : (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontStyle: 'italic', ml: 1.5, mb: 2.0 }}
          >
            Uses the default application for this alias (may change over time).
          </Typography>
        )
      }
      {(overrides && Object.keys(overrides).length > 0) &&
        <div>
          <EditorButton
            sx={{ ml: 1.5 }}
            label="Clear Selections"
            onClick={() => {
              setOverrides({});
            }}
          />
        </div>
      }
    </EditorTabPanel>
  );
}
