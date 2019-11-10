import React, { setState, useContext } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

import { geoToH3 } from 'h3-js';

import DelaContext from '../context/dela-context';

export default function AddFeatureDialog (props) {

  // const [transactionHash, setTransactionHash] = setState("");
  const [parcelLabel, setParcelLabel] = setState("");
  const [parcelAddressId, setParcelAddressId] = setState("");
  const [parcelArea, setParcelArea] = setState("");
  const [parcelType, setParcelType] = setState("");

  const context = useContext(DelaContext);

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
  
    const result = await contractParcelReg.methods.claimParcel(h3IndexHex,
      wkbHash,
      parcelAddressId,
      parcelLabel,
      area,
      parcelType)
      .send({ from: accounts[0] })
      .on('error', console.error);

    //   this.setState({ addFeatureOpen: false });
  
    // this.setState({ snackbarOpen: true, transactionHash: result.events.LogParcelClaimed.transactionHash });
  };
  
  return (
      
      <Dialog
        open={props.addFeatureOpen}
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
            onChange={(evt)=>setParcelLabel(evt.target.value)}
          />
            <TextField
            required
            autoFocus
            margin="dense"
            id="address"
            label="External Address ID"
            fullWidth
            onChange={(evt)=>setParcelAddressId(evt.target.value)}
          />
            <TextField
            autoFocus
            required
            margin="dense"
            id="area"
            type="number"
            label="Area"
            fullWidth
            onChange={(evt)=>setParcelArea(evt.target.value)}
          />

          <TextField
            autoFocus
            error
            margin="dense"
            id="type"
            label="Type (Building, Agriculture, Industrial, ...)"
            fullWidth
            onChange={(evt)=>setParcelType(evt.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={props.handleAddFeatureDialogClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={claimParcel} color="primary">
            Claim
          </Button>
        </DialogActions>
      </Dialog>
  )
};
