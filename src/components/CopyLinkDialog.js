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

const copyToClipboard = (elementId, value) => {
  var input = document.getElementById(elementId);
  input.value = value;
  var isiOSDevice = navigator.userAgent.match(/ipad|iphone/i);
  if (isiOSDevice) {
    var editable = input.contentEditable;
    var readOnly = input.readOnly;
    input.contentEditable = true;
    input.readOnly = false;
    var range = document.createRange();
    range.selectNodeContents(input);
    var selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    input.setSelectionRange(0, 999999);
    input.contentEditable = editable;
    input.readOnly = readOnly;
  } else {
    input.select();
  }
  document.execCommand('copy');
}

const minimizeLink = (location, copyLinkProps, setCopyLinkProps) => {
  const originalLocation = location;

  if (copyLinkProps.minLink) {
    return;
  }

  // Global.openBusyScreen(true, "Shortening URL...", true, false);
  new WrcCommon.FetchAppData(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(location)}`).fetch()
    .then((res) => {
      if (res.ok) {
          return res.text();
      } else {
        throw Error("Error attempting to shorten URL");
      }
    })
    .then((text) => {
      if (text.indexOf("//tinyurl.com") !== -1) {
        location = text;
      } else {
        throw Error("Invalid response from tinyurl");
      }
    })
    .catch((err) => {
      WrcCommon.LOG.error(err);
      Global.displayMessage("An error occurred while attempting to shorten the URL.", "error");
    })
    .finally(() => {
      // Global.openBusyScreen(false);
      if (location !== originalLocation) {
        setCopyLinkProps({...copyLinkProps, minLink: location});
      }
    });
}

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
          const copyEl = window.document.createElement('span');
          copyEl.innerHTML = '<input type="text" id="copyField" value="" style="opacity: 0; top: 0; position: absolute; z-index: -100"/></input>';
          window.document.body.appendChild(copyEl);

          setTimeout(() => {
            copyToClipboard('copyField', getLink());
            Global.displayMessage(
              success ? success : "Successfully copied stand-alone link (URL) to clipboard.", "success");
            window.document.body.removeChild(copyEl);
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