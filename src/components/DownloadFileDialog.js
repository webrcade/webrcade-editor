import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import ContentLabel
 from './common/ContentLabel';

 let _setId = null;
let _setOpen = null;
let _setFile = null;
let _setName = null;
let id = 0;

export function openDownloadFileDialog(file, name) {
  _setId(id++);
  _setOpen(true);
  _setFile(file);
  _setName(name);
}

export function DownloadFileDialog() {
  const [isOpen, setOpen] = React.useState(false);
  const [id, setId] = React.useState(false);
  const [file, setFile] = React.useState(null);
  const [name, setName] = React.useState(null);

  _setOpen = setOpen;
  _setId = setId;
  _setFile = setFile;
  _setName = setName;

  if (!isOpen) return <></>;

  return (
    <DownloadFileDialogInner
      key={id}
      isOpen={isOpen}
      setOpen={setOpen}
      file={file}
      name={name}
    />
  );
}

const DownloadFileDialogInner = ({isOpen, file, setOpen, name}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const resolvedName = name ? name : file ? file.name : "(unknown)";

  const download = () => {
    const url = URL.createObjectURL(file);
    var element = document.createElement('a');
    element.setAttribute('href', url);
    element.setAttribute('download', resolvedName);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    setOpen(false);
  }

  return (
    <Dialog
      open={isOpen}
      onClose={() => setOpen(false)}
      fullScreen={fullScreen}
    >
      <DialogTitle>{"Download File"}</DialogTitle>
      <DialogContent>
        <div>
          <ContentLabel
            content={<DownloadRoundedIcon/>}
            label={resolvedName}
            onClick={() => download()}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

