import * as React from 'react';
import Tab from '@mui/material/Tab';

import {
  LOG
} from '@webrcade/app-common'

import { Global } from '../../../Global';
import Editor from '../../common/editor/Editor';
import EditorTabPanel from '../../common/editor/EditorTabPanel';
import { CloudStorage } from './CloudStorage';
import TreeModel from './TreeModel';
import TreeComponent from './TreeComponent';

let _setId = null;
let _setOpen = null;
let _setModel = null;
let _setNodeSelected = null;
let _onSelect = null;
let id = 0;

export async function openSelectCloudFolderDialog(onSelect) {
  _onSelect = onSelect;

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

export function SelectCloudFolderDialog() {
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
    <SelectCloudFolderDialogInner
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

function SelectCloudFolderDialogInner({ isOpen, setOpen, model, nodeSelected, setNodeSelected }) {
  const selectTab = 0;

  return (
    <Editor
      title="Select Cloud Folder"
      maxWidth={"sm"}
      height={320}
      isOpen={isOpen}
      setOpen={setOpen}
      tabValue={selectTab}
      setTabValue={setTabValue}
      onShow={() => {
        console.log("on show...");
      }}
      okTitle={"Select"}
      onOk={() => {
        _onSelect(model, nodeSelected);
        return true;
      }}
      okDisabled={!nodeSelected}
      tabs={[
        <Tab label="Select" key={selectTab} />,
      ]}
      tabPanels={(
        <>
          <EditorTabPanel value={selectTab} index={selectTab}>
            <TreeComponent model={model} setNodeSelected={setNodeSelected} />
          </EditorTabPanel>
        </>
      )}
    />
  );
}