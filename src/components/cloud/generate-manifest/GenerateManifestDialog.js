import * as React from 'react';
import Tab from '@mui/material/Tab';
import useTheme from '@mui/material/styles/useTheme';

import {
  LOG
} from '@webrcade/app-common'

import { Global } from '../../../Global';
import Editor from '../../common/editor/Editor';
import EditorTabPanel from '../../common/editor/EditorTabPanel';
import { CloudStorage } from './CloudStorage';
import TreeModel from './TreeModel';
import TreeComponent from './TreeComponent';
import { Typography } from '@mui/material';

let _setId = null;
let _setOpen = null;
let _setModel = null;
let _setNodeSelected = null;
let id = 0;

export async function openManifestDialog() {
  try {
    Global.openBusyScreen(true, "Reading cloud storage...");
    let cloudStorage = null;
    try {
      cloudStorage = new CloudStorage();
      const enabled = await cloudStorage.isCloudEnabled();
      if (!enabled) {
        LOG.info("Cloud is not enabled.")
        return;
      }

      const treeModel = new TreeModel(cloudStorage);
      await treeModel.init();
      _setModel(treeModel);
    } catch (e) {
      LOG.error(e);
      Global.displayMessage("An error occurred attempting to connect to cloud storage.", "error");
      return;
    }

    _setId(id++);
    _setNodeSelected(null);
    _setOpen(true);
  } finally {
    Global.openBusyScreen(false);
  }
}

export function GenerateManifestDialog() {
  const [isOpen, setOpen] = React.useState(false);
  const [id, setId] = React.useState(false);
  const [model, setModel] = React.useState(false);
  const [nodeSelected, setNodeSelected] = React.useState(null);

  _setOpen = setOpen;
  _setNodeSelected = setNodeSelected;
  _setModel = setModel;
  _setId = setId;

  if (!isOpen) return <></>;

  return (
    <GenerateManifestDialogInner
      key={id}
      nodeSelected={nodeSelected}
      setNodeSelected={setNodeSelected}
      isOpen={isOpen}
      setOpen={setOpen}
      model={model}
    />
  );
}

const setTabValue = () => { };

function GenerateManifestDialogInner({ isOpen, setOpen, model, nodeSelected, setNodeSelected }) {
  const theme = useTheme();
  const generateTab = 0;

  const onOk = async () => {
    console.log("generate manifest.");
    console.log(nodeSelected);

    Global.openBusyScreen(true, "Generating manifest file...");
    try {
      const manifestUrl = await model.getStorage().generateManifest(nodeSelected);
      Global.displayMessage("Successfully created package manifest file.", "success");
      setOpen(false);
      setTimeout(() => {
        Global.openCopyLinkDialog(
          true,
          manifestUrl,
          "Package Manifest File URL",
          "Successfully copied the package manifest file URL to the clipboard.",
          true
        )

      }, 0);
    } catch (e) {
      LOG.error(e);

      // Check for token scope error
      if (e?.error?.error?.required_scope) {
        Global.displayMessage("This operation requires an updated Dropbox token. Please use settings to unlink and relink to Dropbox.", "error");
      } else {
        Global.displayMessage("An error occurred while attempting to generate the manifest.", "error");
      }
    } finally {
      Global.openBusyScreen(false);
    }
  }

  return (
    <Editor
      title="Generate Package Manifest File"
      height={400}
      isOpen={isOpen}
      setOpen={setOpen}
      tabValue={generateTab}
      setTabValue={setTabValue}
      onShow={() => {
        console.log("on show...");
      }}
      okTitle={"Generate"}
      onOk={() => {
        onOk();
        return false;
      }}
      okDisabled={!nodeSelected}
      tabs={[
        <Tab label="Generate" key={generateTab} />,
      ]}
      tabPanels={(
        <>
          <EditorTabPanel value={generateTab} index={generateTab}>
            <Typography sx={{mt: .5}}>
              Select a folder that contains the contents to generate the manifest file for.<br/>
            </Typography>
            <Typography sx={{mb: 2}} variant={"subtitle2"} color={theme.palette.primary.main}>
              (For example, the root folder of a game)
            </Typography>
            <TreeComponent model={model} setNodeSelected={setNodeSelected}/>
          </EditorTabPanel>
        </>
      )}
    />
  );
}