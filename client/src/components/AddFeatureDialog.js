import React, { useState, useContext } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';


import DelaContext from '../context/dela-context';
import AppSnackbar from './AppSnackbar';

export default function AddFeatureDialog(props) {
  /**
   * @dev state variables
   */
  const [parcelLabel, setParcelLabel] = useState("");
  const [parcelAddressId, setParcelAddressId] = useState("");
  const [parcelArea, setParcelArea] = useState("");
  const [parcelType, setParcelType] = useState("");

  const [formValid, setFormValid] = useState(true)

  const [transactionHash, setTransactionHash] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const context = useContext(DelaContext);


  /**
   * @dev Claim Parcel onClick event handler
   */

  const handleClaimParcel = async () => {
    if (parcelArea === "" || parcelArea < 0 || parcelLabel === "" || parcelType === "" || setParcelAddressId === "") {
      setFormValid(false);
    }
    else {
      const lat = props.latlng.lat;
      const lng = props.latlng.lng;
      const result = await context.claimParcel(lat, lng, "wkbHash",
                                              parcelArea, parcelAddressId, 
                                              parcelLabel, parcelType);

      setTransactionHash(result);
      setSnackbarOpen(true);
      context.closeAddFeatureDialog();
    }
  }

  /**
   * @dev rendering
   */
  return (
    <div>
      <Dialog
        open={context.addFeatureDialogOpen}
        onClose={context.closeAddFeatureDialog}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
          Claim Parcel
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            To claim this parcel, please fill-in the following informations.
          </DialogContentText>
          <TextField
            required
            autoFocus
            error={parcelLabel === "" && !formValid}
            margin="dense"
            id="label"
            label="Label"
            fullWidth
            onChange={(evt) => setParcelLabel(evt.target.value)}
          />
          <TextField
            required
            autoFocus
            error={parcelAddressId === "" && !formValid}
            margin="dense"
            id="address"
            label="External Address ID"
            fullWidth
            onChange={(evt) => setParcelAddressId(evt.target.value)}
          />
          <TextField
            autoFocus
            error={(parcelArea === "" && !formValid) || Number(parcelArea) < 0}
            required
            margin="dense"
            id="area"
            type="number"
            label="Area"
            fullWidth
            onChange={(evt) => setParcelArea(evt.target.value)}
          />

          <TextField
            autoFocus
            error={parcelType === "" && !formValid}
            margin="dense"
            id="type"
            label="Type (Building, Agriculture, Industrial, ...)"
            fullWidth
            onChange={(evt) => setParcelType(evt.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={context.closeAddFeatureDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleClaimParcel} color="primary">
            Claim
          </Button>
        </DialogActions>
      </Dialog>
      <AppSnackbar snackbarOpen={snackbarOpen} transactionHash={transactionHash} />
    </div>
  )
};
