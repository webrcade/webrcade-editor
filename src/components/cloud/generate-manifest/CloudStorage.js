import * as WrcCommon from '@webrcade/app-common'

class CloudStorage {
  constructor() {
    this.cloudEnabled = null;
    this.dropbox = WrcCommon.dropbox;
  }

  async isCloudEnabled() {
    if (this.cloudEnabled === null) {
      this.cloudEnabled = await this.dropbox.testWrite();
      if (!this.cloudEnabled)
        throw Error("Error attempting to write test file");
    }
    return this.cloudEnabled;
  }

  async listFolder(path) {
    return await this.dropbox.listFolder(path);
  }

  async createSharedLink(path) {
    let url = null;
    try {
      const result = await this.dropbox.createSharedLink(path);
      url = result.result.url;
    } catch (e) {
      const error = e?.error?.error?.shared_link_already_exists;
      if (error) {
        url = error.metadata.url;
      } else {
        throw (e);
      }
    }
    console.log(url);
    return url;
  }

  async createManifestFile(path, manifest) {
    const str = JSON.stringify(manifest, null, 2);
    const bytes = new TextEncoder().encode(str);
    const blob = new Blob([bytes], {
      type: "application/json;charset=utf-8"
   });
    return await this.dropbox.uploadFile(blob, path);
  }

  async addChildren(rootPath, path, files) {

    const result = await this.listFolder(path);
    console.log(result);

    if (result?.result?.entries) {
      const entries = result.result.entries;
      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        const tag = entry[".tag"];
        if (tag === "folder") {
          await this.addChildren(rootPath, entry.path_display, files);
        } else if (tag === "file" && entry.path_lower.substring(rootPath.length + 1) !== "wrc-manifest.json") {
          const url = await this.createSharedLink(entry.path_display);
          const f = {
            name: entry.path_display.substring(rootPath.length + 1),
            url: url
          }
          if (entry.path_lower.endsWith(".zip")) {
            f.extract = true;
          }
          files.push(f);
        }
      }
    }
  }

  async generateManifest(node) {
    const manifest = {
      props: {
        title: node.getName()
      }
    }

    const files = [];
    manifest.files = files;
    await this.addChildren(node.getPath(), node.getPath(), files);

    const name = "WRC-MANIFEST.JSON";
    const manifestFile = node.getPath() +
      (node.getPath().endsWith("/") ? name : "/" + name);

    await this.createManifestFile(manifestFile, manifest);
    return await this.createSharedLink(manifestFile);
  }
}

export { CloudStorage }
