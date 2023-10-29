import {
  LOG
} from '@webrcade/app-common'

import { GlobalHolder } from '../../../Global';
import GenerateManifestWrapper from '../../cloud/generate-manifest/GenerateManifestWrapper';

window.zip.configure({ useWebWorkers: false });

class BaseComponent {
  isPackage() {
    return false;
  }

  isFile() {
    return false;
  }
}

class PackageFile extends BaseComponent {
  constructor(entry) {
    super();
    this.entry = entry;
    this.inPackage = false;
  }

  isFile() {
    return true;
  }

  getSize() {
    return this.entry.uncompressedSize;
  }

  getName() {
    return this.entry.filename;
  }

  isPackaged() {
    return this.inPackage;
  }

  setPackaged(v) {
    this.inPackage = v;
  }
}

class Package extends BaseComponent {
  constructor() {
    super();
    this.files = [];
  }

  isPackage() {
    return true;
  }

  addFile(file) {
    this.files.push(file);
  }

  getFileCount() {
    return this.files.length;
  }

  getTotalSize() {
    let size = 0;
    for (let i = 0; i < this.files.length; i++) {
      size += this.files[i].getSize();
    }
    return size;
  }

  async createPackage() {
    const { zip } = window;
    const blobWriter = new zip.BlobWriter("application/zip");
    const zipWriter = new zip.ZipWriter(blobWriter);
    for (let i = 0; i < this.files.length; i++) {
      const f = this.files[i];
      const writer = new zip.BlobWriter();
      const blob = await f.entry.getData(writer, {});
      await zipWriter.add(f.getName(), new zip.BlobReader(blob));
    }
    return await zipWriter.close();
  }
}

export default class Repackage {

  TARGET_SIZE = 50 * 1024 * 1024; // TODO: move to 50

  constructor() {
    this.files = [];
    this.packages = [];
  }

  buildPackages() {
    const { files, packages, TARGET_SIZE } = this;

    while (true) {
      let curPackage = new Package();
      let curTotal = 0;
      for (let i = 0; i < files.length; i++) {
        const f = files[i];
        if (f.isPackaged()) {
          continue;
        }
        const s = f.getSize();
        if (s <= (TARGET_SIZE - curTotal)) {
          curTotal += s;
          curPackage.addFile(f);
          f.setPackaged(true);
        }
      }

      if (curPackage.getFileCount() === 0) {
        break;
      } else {
        packages.push(curPackage);
        curPackage = new Package();
        curTotal = 0;
      }
    }
  }

  async repackage(file) {
    const { zip } = window;

    LOG.info("## Repackage: " + file.name);

    // Read entries
    const reader = new zip.ZipReader(new zip.BlobReader(file));
    try {
      const entries = await reader.getEntries();
      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        if (!entry.directory) {
          const f = new PackageFile(entry);
          this.files.push(f);
        }
      }
    } finally {
      await reader.close();
    }

    // Sort by size
    this.files.sort((a, b) => {
      return -(a.getSize() - b.getSize());
    });

    for (let i = 0; i < this.files.length; i++) {
      const f = this.files[i];
      LOG.info(`${f.getName()} : ${Math.round((f.getSize() / (1024 * 1024)) * 100) / 100} mb`);
    }

    this.buildPackages();

    const results = [];

    for (let i = 0; i < this.packages.length; i++) {
      const p = this.packages[i];
      LOG.info(`Package ${i}: ${p.getTotalSize()}, ${p.getFileCount()} files.`);
      results.push(p);
    }

    for (let i = 0; i < this.files.length; i++) {
      const f = this.files[i];
      if (!f.isPackaged()) {
        results.push(f);
      }
    }

    return results;
  }

  async createArchive(name, results) {
    const { zip } = window;

    const manifest = {
      props: {
        title: name
      }
    }

    const files = [];
    manifest.files = files;

    const zipWriter = new zip.ZipWriter(new zip.BlobWriter("application/zip"));
    let packageIndex = 1;
    for (let i = 0; i < results.length; i++) {
      const r = results[i];

      const f = {
        url: ""
      }
      if (r.isPackage()) {
        f.extract = true;
        const blob = await r.createPackage();
        const name = `pak${packageIndex++}.zip`;
        f.name = name;
        await zipWriter.add(name, new zip.BlobReader(blob));
      } else {
        f.name = r.getName();
        const blob = await r.entry.getData(new zip.BlobWriter(), {});
        await zipWriter.add(r.getName(), new zip.BlobReader(blob));
      }
      files.push(f);
    }

    const manifestStr = JSON.stringify(manifest, null, 2);
    const manifestBytes = new TextEncoder().encode(manifestStr);
    const manifestBlob = new Blob([manifestBytes], {
      type: "application/json;charset=utf-8"
    });
    await zipWriter.add("WRC-MANIFEST.JSON", new zip.BlobReader(manifestBlob));

    return await zipWriter.close();
  }

  // TODO: Method that returns path and file
  // TODO: Cloud method that will create dir, walks dirs and attempts to create
  // TODO: Cloud method that will write blob to destination
  // TODO: Once written, run the manifest generator on the root path

  getPath(rootPath, name) {
    let n = "";
    let f = name;
    let idx = name.lastIndexOf("/");
    if (idx !== -1) {
      n = name.substring(0, idx);
      f = name.substring(idx + 1);
    }

    if (n.length > 0) {
      if (!rootPath.endsWith("/")) {
        rootPath += "/";
      }

      if (n.startsWith("/")) {
        n = n.substring(1);
      }
    }

    return [rootPath + n, f];
  }

  async writeToCloud(model, results, rootPath, name, onSuccess) {
    const { zip } = window;
    const { storage } = model;

    let packageIndex = 1;
    for (let i = 0; i < results.length; i++) {
      const r = results[i];

      let blob = null;
      let name = null;
      if (r.isPackage()) {
        blob = await r.createPackage();
        name = `pak${packageIndex++}.zip`;
      } else {
        let retry = 5;
        while (retry-- > 0) {
          try {
            blob = await r.entry.getData(new zip.BlobWriter(), {});
            break;
          } catch (e) {
            console.log(e);
            console.log("Retrying...");
          }
        }
        name = r.getName();
      }
      const path = this.getPath(rootPath, name);
      const fullPath = path[0] + "/" + path[1];
      console.log(fullPath);
      GlobalHolder.setBusyScreenMessage(`Uploading file ${i + 1} of ${results.length}...`);
      await storage.uploadFile(blob, fullPath);
    }

    GlobalHolder.setBusyScreenMessage(`Generating manifest file...`);

    await new GenerateManifestWrapper().generate(
      async () => {
        return await storage.generateManifest(rootPath, name);
      },
      () => {
        onSuccess();
      },
      false
    )
  }
}
