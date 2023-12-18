import {
  LOG
} from '@webrcade/app-common'

import { Global } from '../../../Global';

export default class GenerateManifestWrapper {
  async generate(doGenerate, onComplete, showStatus) {
    if (showStatus) Global.openBusyScreen(true, "Generating manifest file...");
    try {
      const manifestUrl = await doGenerate();
      Global.displayMessage("Successfully created package manifest file.", "success");
      onComplete();
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
      if (showStatus) Global.openBusyScreen(false);
    }
  }

}
