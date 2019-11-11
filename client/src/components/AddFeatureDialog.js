import React, { useState, useContext } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

import { geoToH3 } from 'h3-js';

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

  const [transactionHash, setTransactionHash] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const context = useContext(DelaContext);

  /**
   * @dev send a claim parcel transaction and handle results
   */

  const claimParcel = async () => {
    const accounts = context.accounts;
    const contractParcelReg = context.contractParcelReg;
    const web3 = context.web3;
    const lat = 37.0;
    const lng = 3.0;

    const h3Index = geoToH3(lat, lng, 15);
    const h3IndexHex = web3.utils.utf8ToHex(h3Index);
    const wkbHash = web3.utils.asciiToHex("wkbHash");
    const area = Number(parcelArea);

    try {
      const result = await contractParcelReg.methods.claimParcel(h3IndexHex,
        wkbHash,
        parcelAddressId,
        parcelLabel,
        area,
        parcelType)
        .send({ from: accounts[0] });

      setTransactionHash(result.events.LogParcelClaimed.transactionHash);
      setSnackbarOpen(true);
      props.addFeatureDialogClose();
    }
    catch (error) {
      if (error.code === 4001) {
        // handle the "error" as a rejection
        alert(`Transaction cancelled by the user.`);
      } else {
        // Catch any errors for any of the above operations.
        alert(`Failed to send Claim transaction for unknown reason, please check the console log.`,
        );
      }
      console.error(error);
    }
  };


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
            margin="dense"
            id="label"
            label="Label"
            fullWidth
            onChange={(evt) => setParcelLabel(evt.target.value)}
          />
          <TextField
            required
            autoFocus
            margin="dense"
            id="address"
            label="External Address ID"
            fullWidth
            onChange={(evt) => setParcelAddressId(evt.target.value)}
          />
          <TextField
            autoFocus
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
            error
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
          <Button onClick={claimParcel} color="primary">
            Claim
          </Button>
        </DialogActions>
      </Dialog>
      <AppSnackbar snackbarOpen={snackbarOpen} transactionHash={transactionHash}/>
    </div>
  )
};
