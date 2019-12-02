import React, { useState, useContext, createRef } from 'react';
import ReactDOM from 'react-dom';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

import DelaContext from '../context/dela-context';
import AppSnackbar from './AppSnackbar';
import ParcelLandUseCodeAutoList from './ParcelLandUseCodeAutoList';


const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    height: 250,
  }
}));

export default function ManageParcelDialog(props) {

  const classes = useStyles();

  /**
   * @dev state variables
   */
  const [parcelLabel, setParcelLabel] = useState("");
  const [parcelAddress, setParcelAddress] = useState("");
  const [parcelArea, setParcelArea] = useState("");
  const [parcelLandUseCode, setParcelLandUseCode] = useState("");

  const [formValid, setFormValid] = useState(true)

  const [transactionHash, setTransactionHash] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);


  const context = useContext(DelaContext);

  const labelRef = createRef();
  const addressRef = createRef();
  const areaRef = createRef();  

  /**
   * @dev Claim Parcel onClick event handler
   */

  const handleClaimParcel = async () => {
    if (parcelArea === "" || parcelArea < 0 || parcelLabel === "" || parcelLandUseCode === "" || parcelAddress === "") {
      setFormValid(false);
    }
    else {
      const lat = props.latlng.lat;
      const lng = props.latlng.lng;
      const result = await context.claimParcel(lat, lng, "wkbHash", parcelArea, 
                                            parcelAddress, parcelLabel, parcelLandUseCode.value);

      setTransactionHash(result);
      setSnackbarOpen(true);
      context.closeManageParcelDialog();
    }
  }

   /**
   * @dev Update Parcel onClick event handler
   */

  const handleUpdateParcel = async () => {
    const label = ReactDOM.findDOMNode(labelRef.current).querySelector('input').value;
    const address = ReactDOM.findDOMNode(addressRef.current).querySelector('input').value;
    const area = ReactDOM.findDOMNode(areaRef.current).querySelector('input').value;
    const _type = typeof(parcelLandUseCode.value) === 'undefined' ? context.parcelToUpdate.parcelLandUseCode : parcelLandUseCode.value;
    
    if (area.value === "" || area.value < 0 || label.value === "" || address.value === "" || _type === "") {
      setFormValid(false);
    }
    else {

      const result = await context.updateParcel(area, address, label, _type);

      setTransactionHash(result);
      setSnackbarOpen(true);
      context.closeManageParcelDialog();
    }
  }

  /**
   * @dev rendering
   */

  return (
    <div className={classes.root}>
      <Dialog
        PaperProps={{ style: { overflowY: 'visible' } }}
        open={context.manageParcelDialogOpen}
        onClose={context.closeManageParcelDialog}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
        {context.updateMode ? <span> Update parcel </span> : <span> Claim parcel</span> }
        </DialogTitle>
        <DialogContent style={{ overflowY: 'visible' }}>
          <DialogContentText>
            To {context.updateMode ? <span> update </span> : <span> claim</span> } this parcel, please fill-in the following informations.
          </DialogContentText>
          <TextField
            autoFocus
            error={parcelLabel === "" && !formValid}
            margin="dense"
            id="parcel-label"
            label="Label"
            fullWidth
            ref={labelRef}
            defaultValue={context.updateMode ? context.parcelToUpdate.lbl : ""}
            onChange={(evt) => setParcelLabel(evt.target.value)}
          />
          <ParcelLandUseCodeAutoList setParcelLandUseCode={setParcelLandUseCode} 
                              parcelLandUseCode={context.updateMode ? context.parcelToUpdate.parcelLandUseCode : "" }/>
          <TextField
            autoFocus
            error={parcelAddress === "" && !formValid}
            margin="dense"
            id="parcel-address"
            label="External Address"
            fullWidth
            ref={addressRef}
            defaultValue={context.updateMode ? context.parcelToUpdate.addr : ""}
            onChange={(evt) => setParcelAddress(evt.target.value)}
          />
          <TextField
            autoFocus
            error={(parcelArea === "" && !formValid) || Number(parcelArea) < 0}
            margin="dense"
            id="parcel-area"
            type="number"
            label="Area"
            fullWidth
            ref={areaRef}
            defaultValue={context.updateMode ? context.parcelToUpdate.area : ""}
            onChange={(evt) => setParcelArea(evt.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={context.closeManageParcelDialog} color="secondary">
            Cancel
          </Button>
          {context.updateMode ?
            <Button onClick={handleUpdateParcel} color="primary">
              Update
            </Button>
            :
            <Button onClick={handleClaimParcel} color="primary">
              Claim
            </Button>
          }
        </DialogActions>
      </Dialog>
      <AppSnackbar snackbarOpen={snackbarOpen} transactionHash={transactionHash} />
    </div>
  )
};
