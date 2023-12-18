import * as React from 'react';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

import {
  LOG
} from '@webrcade/app-common'

import * as WrcCommon from '@webrcade/app-common'

import { Global } from '../../../Global';
import Editor from '../../common/editor/Editor';
import EditorButton from '../../common/editor/EditorButton';
import EditorSwitch from '../../common/editor/EditorSwitch';
import EditorTabPanel from '../../common/editor/EditorTabPanel';
import EditorTextField from '../../common/editor/EditorTextField';
import EditorFileChooser from '../../common/editor/EditorFileChooser';
import { Typography } from '@mui/material';
import Repackage from './Repackage';
import { openSelectCloudFolderDialog } from '../../cloud/generate-manifest/SelectCloudFolderDialog';
import { openDownloadFileDialog } from '../../DownloadFileDialog';
import CommonTooltip from '../../common/CommonTooltip';

let _setId = null;
let _setOpen = null;
let _setFile = null;
let _setCloudStorage = null;
let _setSelectedNode = null;
let _setOutputFolder = null;
let _setModel = null;
let id = 0;

export async function openRepackageDialog() {
  _setId(id++);
  _setOpen(true);
  _setCloudStorage(WrcCommon.settings.isCloudStorageEnabled());
  _setFile(null);
  _setModel(null);
  _setSelectedNode(null);
  _setOutputFolder("");
}

function getFullPath(selectedNode, outputFolder) {
  while (outputFolder.indexOf("//") >= 0) {
    outputFolder = outputFolder.replace("//", "/");
  }
  if (outputFolder.endsWith("/")) {
    outputFolder = outputFolder.substring(0, outputFolder.length - 1);
  }

  let path = "";
  if (selectedNode) {
    path += selectedNode.path;
    if (!path.endsWith("/")) {
      path += "/";
    }
    path += outputFolder.startsWith("/") ?
      outputFolder.substring(1) : outputFolder;
  }
  return path;
}

export function RepackageDialog() {
  const [isOpen, setOpen] = React.useState(false);
  const [id, setId] = React.useState(false);
  const [file, setFile] = React.useState(false);
  const [cloudStorage, setCloudStorage] = React.useState(true);
  const [selectedNode, setSelectedNode] = React.useState(null);
  const [outputFolder, setOutputFolder] = React.useState("");
  const [model, setModel] = React.useState(null);

  _setOpen = setOpen;
  _setFile = setFile;
  _setCloudStorage = setCloudStorage;
  _setSelectedNode = setSelectedNode;
  _setModel = setModel;
  _setOutputFolder = setOutputFolder;
  _setId = setId;

  if (!isOpen) return <></>;

  return (
    <RepackageDialogInner
      key={id}
      isOpen={isOpen}
      setOpen={setOpen}
      cloudStorage={cloudStorage}
      setCloudStorage={setCloudStorage}
      file={file}
      setFile={setFile}
      selectedNode={selectedNode}
      setSelectedNode={setSelectedNode}
      model={model}
      setModel={setModel}
      outputFolder={outputFolder}
      setOutputFolder={setOutputFolder}
    />
  );
}

function RepackageDialogInner({
  isOpen,
  setOpen,
  file,
  setFile,
  cloudStorage,
  setCloudStorage,
  selectedNode,
  setSelectedNode,
  model,
  setModel,
  outputFolder,
  setOutputFolder
}) {
  const repackageTab = 0;

  const fullPath = getFullPath(selectedNode, outputFolder);

  const onOk = async () => {
    Global.openBusyScreen(true, "Repackaging archive...");
    try {
      const repackage = new Repackage();
      const results = await repackage.repackage(file);
      const regex = /.zip/i;
      const name = file.name.replace(regex, '-wrc.zip')

      if (!cloudStorage) {
        const archive = await repackage.createArchive(name, results);
        openDownloadFileDialog(archive, name);
        setFile(null);
        setOpen(false);
      } else {
        console.log(results);
        await repackage.writeToCloud(model, results, fullPath, name,
          () => { setOpen(false) }
        );
      }
    } catch (e) {
      LOG.error(e);
      Global.displayMessage("An error occurred while attempting to repackage the archive.", "error");
    } finally {
      Global.openBusyScreen(false);
    }
  }

  return (
    <Editor
      title="Repackage Archive"
      height={WrcCommon.settings.isCloudStorageEnabled() ? 450 : 340}
      isOpen={isOpen}
      setOpen={setOpen}
      tabValue={repackageTab}
      setTabValue={() => { }}
      onShow={() => { }}
      okTitle={"Repackage"}
      onOk={() => {
        onOk();
        return false;
      }}
      okDisabled={
        (!file) ||
        (cloudStorage && (!fullPath || fullPath.length === 0))
      }
      tabs={[
        <Tab label="Repackage" key={repackageTab} />,
      ]}
      tabPanels={(
        <>
          <EditorTabPanel value={repackageTab} index={repackageTab}>
            <Typography sx={{ mt: .5, mb: 2 }}>
              Select an archive (.zip) file to repackage.
            </Typography>
            <Box>
              <Stack
                spacing={0}
                direction="row"
                alignItems="center"
              >
                <EditorTextField
                  disabled
                  sx={{ width: '50ch' }}
                  label="Package Archive"
                  value={file ? file.name : ""}
                />
                <EditorFileChooser
                  sx={{ m: 0 }}
                  label="Select file..."
                  onChange={
                    (e) => {
                      const files = e.target.files;
                      if (files.length > 0) {
                        const f = files[0];
                        setFile(f);

                        let name = f.name;
                        if (name.toLowerCase().endsWith(".zip")) {
                          name = name.substring(0, name.length - 4);
                        }
                        setOutputFolder(name);
                      }
                    }
                  }
                />
              </Stack>
            </Box>
            {WrcCommon.settings.isCloudStorageEnabled() &&
              <>
                <Box>
                  <EditorSwitch
                    label="Output to Cloud Storage"
                    tooltip="Whether to repackage and save the output to cloud storage."
                    onChange={(e) => {
                      setCloudStorage(e.target.checked);
                    }}
                    checked={cloudStorage}
                  />
                </Box>
                {cloudStorage &&
                  <>
                    <Box sx={{ mt: -1 }}>
                      <Stack
                        spacing={0}
                        direction="row"
                        alignItems="center"
                      >
                        <EditorTextField
                          disabled
                          sx={{ width: '50ch' }}
                          label="Destination Folder"
                          value={selectedNode ? selectedNode.path : ""}
                        />
                        <EditorButton
                          label="Select folder..."
                          onClick={() => {
                            openSelectCloudFolderDialog((model, node) => {
                              setModel(model);
                              setSelectedNode(node);
                            });
                          }}
                        />
                      </Stack>
                    </Box>
                    <Box>
                      <CommonTooltip title="One or more sub-folders to create. Multiple sub-folders must be separated by a forward slash.">
                        <Box sx={{width: 'fit-content'}}>
                          <EditorTextField
                            sx={{ width: '50ch', mb: 2.5 }}
                            label="Sub-Folders to Create (optional)"
                            value={outputFolder}
                            onChange={(e) => setOutputFolder(e.target.value)}
                          />
                        </Box>
                      </CommonTooltip>
                    </Box>
                    {fullPath.length > 0 &&
                      <CommonTooltip title={fullPath}>
                        <Box sx={{
                          ml: 1.5,
                          py: .5,
                          px: 1,
                          border: '1px dashed grey',
                          maxWidth: '50ch',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          opacity: 0.5
                        }}>
                          <Typography
                            variant="caption"
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              color: '#fff'
                            }}
                          >{fullPath}</Typography>
                        </Box>
                      </CommonTooltip>
                    }
                  </>
                }
              </>
            }
          </EditorTabPanel>
        </>
      )}
    />
  );
}