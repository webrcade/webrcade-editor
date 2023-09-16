import * as React from 'react';
// import useTheme from '@mui/material/styles/useTheme';

import { TreeView } from "@mui/x-tree-view/TreeView";
import { ExpandMore } from "@mui/icons-material";
import { ChevronRight } from "@mui/icons-material";
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import { Box } from "@mui/material";
import * as Util from '../../../Util';
import { Global } from '../../../Global';

import {
  LOG
} from '@webrcade/app-common'

export default function TreeComponent({ model, setNodeSelected }) {
  const [expanded, setExpanded] = React.useState([]);
  const [selected, setSelected] = React.useState([]);
  const forceRefresh = Util.useForceUpdate();
  // const theme = useTheme();

  return (
    <Box sx={{ background: '#2A2A2A', px: 1.5, py: 1.5, borderRadius: 2.4 }}>
      <TreeView
        defaultCollapseIcon={<ExpandMore />}
        defaultExpandIcon={<ChevronRight />}
        defaultParentIcon={<FolderRoundedIcon />}
        defaultEndIcon={<FolderRoundedIcon />}
        expanded={expanded}
        selected={selected}
        sx={{ height: 240, flexGrow: 1, overflowY: 'auto' }}
        onNodeToggle={(event, nodeIds) => {
          setExpanded(nodeIds);
        }}
        onNodeSelect={async (event, nodeId) => {
          const node = model.getNode(nodeId);
          try {
            await model.addNodes(node, node.getPath(), () => {
              setExpanded([nodeId, ...expanded]);
            }, () => { forceRefresh() });
          } catch (e) {
            LOG.error(e);
            Global.displayMessage("An error occurred while attempting to read the folder.", "error");
          }
          setSelected([nodeId]);
          setNodeSelected(node);
        }}
      >
        {model.renderTree()}
      </TreeView>
    </Box>
  );
}