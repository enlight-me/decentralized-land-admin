import React, { useContext } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import DelaContext from '../context/dela-context';

export default function ConfirmRevokeDialog({open, setOpen, parcel}) {
  // const [open, setOpen] = React.useState(false);

  const context = useContext(DelaContext);

  const handleRevokeParcel = () => {
    context.revokeParcel(parcel);
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Revoke your ownership of this parcel?"}</DialogTitle>
        <DialogContent>
        <DialogContentText id="alert-dialog-description">

          Are you sur you want to revoke your ownership of this parcel. <br/>
           Label : {parcel.lbl} / Address : {parcel.addr} / Land use : {parcel.parcelLandUseCode}

        </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRevokeParcel} color="secondary" >
            Revoke
          </Button>
          <Button onClick={handleClose} color="primary" autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
  );
}
