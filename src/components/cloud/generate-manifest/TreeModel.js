import CircularProgress from '@mui/material/CircularProgress';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import CustomTreeItem from "./CustomTreeItem";

class TreeNode {
  constructor(id, name, path) {
    this.id = id;
    this.name = name;
    this.path = path;
    this.children = [];
    this.loading = false;
  }

  getId() {
    return this.id;
  }

  getName() {
    return this.name;
  }

  getPath() {
    return this.path;
  }

  getChildren() {
    return this.children;
  }

  addChild(node) {
    this.children.push(node);
  }

  setLoading(v) {
    this.loading = v;
  }

  isLoading() {
    return this.loading;
  }
}

export default class TreeModel {
  constructor(storage) {
    this.storage = storage;
    this.root = [];
    this.nodesById = {}
    this.nextId = 0;
    this.childrenLoaded = {}
    this.expanded = {}
    this.expandedArr = [];
  }

  getStorage() {
    return this.storage;
  }

  getExpanded() {
    console.log(this.expandedArr)
    return this.expandedArr;
  }

  toggleExpanded(nodeId) {
    if (this.expanded[nodeId]) {
      delete this.expanded[nodeId];
    } else {
      this.expanded[nodeId] = true;
    }

    this.expandedArr = [];
    for (let key in this.expanded) {
      console.log('key: ' + key);
      this.expandedArr.push(key);
    }
  }

  getNode(nodeId) {
    return this.nodesById[nodeId];
  }

  async addNodes(parentNode, path, cb, loadingCb) {
    if (parentNode && this.childrenLoaded[parentNode.getId()]) {
      return;
    }

    if (parentNode) {
      parentNode.setLoading(true);
      if (loadingCb) loadingCb();
    }

    try {
      const results = await this.storage.listFolder(path);

      let count = 0;

      if (results?.result?.entries) {
        const entries = results.result.entries;
        entries.sort((a, b) => {
          return a.name.localeCompare(b.name);
        });

        for (let i = 0; i < entries.length; i++) {
          const entry = entries[i];
          if (entry[".tag"] === "folder") {
            count++;
            const node = new TreeNode(("node-" + (this.nextId++) + entry.name), entry.name, entry.path_display);
            this.nodesById[node.getId()] = node;
            if (!parentNode) {
              this.root.push(node)
            } else {
              parentNode.addChild(node);
            }
          }
        }
      }

      if (parentNode) {
        this.childrenLoaded[parentNode.getId()] = true;
      }

      if (cb && count > 0) cb();
    } finally {
      if (parentNode) parentNode.setLoading(false);
    }
  }

  async init() {
    await this.addNodes(null, "");
  }

  renderNode(node) {
    let icon = undefined;
    if (node.isLoading()) {
      icon = <CircularProgress size={14}/>;
    } else if (node.getChildren().length === 0 && this.childrenLoaded[node.getId()]) {
      icon = <FolderOutlinedIcon />
    }

    return (
      <CustomTreeItem
        icon={icon}
        key={node.getId()}
        nodeId={node.getId()}
        label={node.getName()}
      >
        {node.getChildren().map((node) => this.renderNode(node))}
      </CustomTreeItem>
    );
  }

  renderTree() {
    return (
      <>
        {this.root.map((node) => this.renderNode(node))}
      </>
    );
  }
}
