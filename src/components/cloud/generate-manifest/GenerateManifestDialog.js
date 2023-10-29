import * as React from 'react';
import Tab from '@mui/material/Tab';
import Stack from '@mui/material/Stack';
import useTheme from '@mui/material/styles/useTheme';

import Editor from '../../common/editor/Editor';
import EditorButton from '../../common/editor/EditorButton';
import EditorTabPanel from '../../common/editor/EditorTabPanel';
import EditorTextField from '../../common/editor/EditorTextField';
import { Typography } from '@mui/material';
import { openSelectCloudFolderDialog } from '../../cloud/generate-manifest/SelectCloudFolderDialog';
import GenerateManifestWrapper from './GenerateManifestWrapper';

let _setId = null;
let _setOpen = null;
let _setModel = null;
let _setNodeSelected = null;
let id = 0;

export async function openManifestDialog() {
  _setId(id++);
  _setModel(null);
  _setNodeSelected(null);
  _setOpen(true);
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
      setModel={setModel}
    />
  );
}

function GenerateManifestDialogInner({ isOpen, setOpen, model, setModel, nodeSelected, setNodeSelected }) {
  const theme = useTheme();
  const generateTab = 0;

  const onOk = async () => {
    console.log("generate manifest.");
    console.log(nodeSelected);

    new GenerateManifestWrapper().generate(
      async () => {
        return await model.getStorage().generateManifestFromNode(nodeSelected);
      },
      () => {
        setOpen(false);
      },
      true
    )
  }

  return (
    <Editor
      title="Generate Package Manifest File"
      height={340}
      maxWidth={"md"}
      isOpen={isOpen}
      setOpen={setOpen}
      tabValue={generateTab}
      setTabValue={() => { }}
      onShow={() => { }}
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
            <Typography sx={{ mt: .5 }}>
              Select a folder that contains the contents to generate the manifest file for.<br />
            </Typography>
            <Typography sx={{ mb: 2 }} variant={"subtitle2"} color={theme.palette.primary.main}>
              (For example, the root folder of a game)
            </Typography>
            <Stack
              spacing={0}
              direction="row"
              alignItems="center"
            >
              <EditorTextField
                disabled
                sx={{ width: '50ch' }}
                label="Package Root Folder"
                value={nodeSelected ? nodeSelected.path : ""}
              />
              <EditorButton
                label="Select folder..."
                onClick={() => {
                  openSelectCloudFolderDialog((model, node) => {
                    setModel(model);
                    setNodeSelected(node)
                  });
                }}
              />
            </Stack>
            {/* <TreeComponent model={model} setNodeSelected={setNodeSelected}/> */}
          </EditorTabPanel>
        </>
      )}
    />
  );
}