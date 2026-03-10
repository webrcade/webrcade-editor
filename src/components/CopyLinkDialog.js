import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import useMediaQuery from '@mui/material/useMediaQuery';

import { useTheme } from '@mui/material/styles';

import { Global, GlobalHolder } from '../Global';
import { enableDropHandler } from '../UrlProcessor';
import { usePrevious } from '../Util';

import * as WrcCommon from '@webrcade/app-common';

const copyToClipboard = (text) => {
  const input = document.createElement('input');
  input.value = text;

  // Critical for iOS Safari:
  input.setAttribute('readonly', '');
  input.style.position = 'fixed';
  input.style.top = '0';
  input.style.left = '0';
  input.style.opacity = '1'; // Not hidden
  input.style.zIndex = '-1'; // Visually non-disruptive
  input.style.height = '1px'; // Minimal size
  input.style.fontSize = '16px'; // iOS Safari bug: small font sizes can break selection

  document.body.appendChild(input);
  input.focus();
  input.select();

  try {
    const successful = document.execCommand('copy');
    if (!successful) {
      throw new Error('Copy command failed');
    }
  } catch (err) {
    console.warn('Copy failed', err);
  }

  document.body.removeChild(input);
};

const minimizeLink = (location, copyLinkProps, setCopyLinkProps) => {
  const originalLocation = location;

  if (copyLinkProps.minLink) {
    return;
  }

  fetch(`https://is.gd/create.php?format=json&url=${encodeURIComponent(location)}`)
  .then(async (res) => {
    if (res.ok) {
      return res.json();
    } else {
      // Try to parse error message from body (though is.gd returns 200 even on errors)
      const errorBody = await res.json().catch(() => null);
      const errorMsg = errorBody?.errormessage || "Error attempting to shorten URL";
      throw new Error(errorMsg);
    }
  })
  .then((json) => {
    if (json?.shorturl && typeof json.shorturl === "string") {
      location = json.shorturl;
    } else if (json?.errormessage) {
      throw new Error(json.errormessage);
    } else {
      throw new Error("Invalid response from is.gd");
    }
  })
  .catch((err) => {
    WrcCommon.LOG.error(err);
    Global.displayMessage(err.message || "An error occurred while attempting to shorten the URL.", "error");
  })
  .finally(() => {
    // Global.openBusyScreen(false);
    if (location !== originalLocation) {
      setCopyLinkProps({ ...copyLinkProps, minLink: location });
    }
  });

  // fetch("https://spoo.me", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/x-www-form-urlencoded",
  //     "Accept": "application/json"
  //   },
  //   body: `url=${encodeURIComponent(location)}`
  // })
  // .then(async (res) => {
  //   if (res.ok) {
  //     return res.json();
  //   } else {
  //     const errorBody = await res.json().catch(() => null);
  //     const errorMsg = errorBody?.UrlError || "Error attempting to shorten URL";
  //     throw new Error(errorMsg);
  //   }
  // })
  // .then((json) => {
  //   if (json?.short_url?.toLowerCase().startsWith("https://spoo.me")) {
  //     location = json.short_url;
  //   } else {
  //     throw new Error("Invalid response from spoo.me");
  //   }
  // })
  // .catch((err) => {
  //   WrcCommon.LOG.error(err);
  //   Global.displayMessage(err.message || "An error occurred while attempting to shorten the URL.", "error");
  // })
  // .finally(() => {
  //   // Global.openBusyScreen(false);
  //   if (location !== originalLocation) {
  //     setCopyLinkProps({ ...copyLinkProps, minLink: location });
  //   }
  // });

  // Global.openBusyScreen(true, "Shortening URL...", true, false);
  // new WrcCommon.FetchAppData(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(location)}`).fetch()
  //   .then((res) => {
  //     if (res.ok) {
  //         return res.text();
  //     } else {
  //       throw Error("Error attempting to shorten URL");
  //     }
  //   })
  //   .then((text) => {
  //     if (text.toLowerCase().indexOf("//tinyurl.com") !== -1) {
  //       location = text;
  //     } else {
  //       throw Error("Invalid response from tinyurl");
  //     }
  //   })
  //   .catch((err) => {
  //     WrcCommon.LOG.error(err);
  //     Global.displayMessage("An error occurred while attempting to shorten the URL.", "error");
  //   })
  //   .finally(() => {
  //     // Global.openBusyScreen(false);
  //     if (location !== originalLocation) {
  //       setCopyLinkProps({...copyLinkProps, minLink: location});
  //     }
  //   });
}

// const minimizeLink = (location, copyLinkProps, setCopyLinkProps) => {
//   const originalLocation = location;

//   if (copyLinkProps.minLink) {
//     return;
//   }

//   // Global.openBusyScreen(true, "Shortening URL...", true, false);
//   fetch("https://clc.is/api/links", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify({ target_url: location })
//   })
//     .then((res) => {
//       if (res.ok) {
//         return res.json();
//       } else {
//         throw new Error("Error attempting to shorten URL");
//       }
//     })
//     .then((data) => {
//       if (data && data.short_url && data.short_url.startsWith("https://clc.is")) {
//         location = data.short_url;
//       } else {
//         throw new Error("Invalid response from clc.is");
//       }
//     })
//     .catch((err) => {
//       WrcCommon.LOG.error(err);
//       Global.displayMessage("An error occurred while attempting to shorten the URL.", "error");
//     })
//     .finally(() => {
//       // Global.openBusyScreen(false);
//       if (location !== originalLocation) {
//         setCopyLinkProps({ ...copyLinkProps, minLink: location });
//       }
//     });
// };

const CopyLinkDialog = (props) => {
  const [isOpen, setOpen] = React.useState(false);
  const prevOpen = usePrevious(isOpen);
  const [copyLinkProps, setCopyLinkProps] = React.useState({ link: "", checked: false });
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  // Enable/disable the drop handler
  if (prevOpen && !isOpen) {
    enableDropHandler(true);
  } else if (!prevOpen && isOpen) {
    enableDropHandler(false);
  }

  GlobalHolder.setCopyLinkDialogOpen = setOpen;
  GlobalHolder.setCopyLinkDialogProps = setCopyLinkProps;

  const title = copyLinkProps.title;
  const success = copyLinkProps.success;

  const disabledShortened = copyLinkProps.disableShortened;

  const getLink = () => {
    return copyLinkProps.checked && copyLinkProps.minLink ? copyLinkProps.minLink : copyLinkProps.link;
  }

  return (
    <Dialog
      open={isOpen}
      onClose={() => setOpen(false)}
      fullScreen={fullScreen}
    >
      <DialogTitle>{title ? title : "Copy Stand-alone Link"}</DialogTitle>
      <DialogContent>
        {!disabledShortened && (
          <div>
            <FormControlLabel sx={{ whiteSpace: 'nowrap', ml: 1 }} control={
              <Switch
                onChange={(e) => {
                  const updatedProps = {...copyLinkProps, checked: e.target.checked};
                  setCopyLinkProps(updatedProps);
                  if (e.target.checked) {
                    minimizeLink(copyLinkProps.link, updatedProps, setCopyLinkProps)
                  }
                }}
              />
            }
            label={"Shortened URL"}
          />
          </div>
        )}
        <div>
          <TextField
            value={getLink()}
            onChange={() => {}}
            InputProps={{
              disabled: true,
            }}
            sx={{ m: 1.5, width: { xs: '35ch', sm: '40ch' }, }}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => {
          setOpen(false);
          setTimeout(() => {
            copyToClipboard(getLink());
            Global.displayMessage(
              success || "Successfully copied stand-alone link (URL) to clipboard.",
              "success"
            );
          }, 0);
        }}>
          Copy
        </Button>
        <Button onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CopyLinkDialog;
