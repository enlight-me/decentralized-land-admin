import React, { Component } from "react";
import { CssBaseline } from "@material-ui/core";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import Link from '@material-ui/core/Link';
import { geoToH3 } from 'h3-js';

import GlobalState from './context/GlobalState';
import MainAppBar from './components/MainAppBar';
import MainDrawer from './components/MainDrawer';
// import MainMap from './components/MainMap';
// import AddFeatureDialog from './components/AddFeatureDialog';

const theme = createMuiTheme({
  palette: {
    type: 'light', // dark : light    
  },
});

class App extends Component {

  /**
   * @notice state variables 
   */

  state = {
    drawerOpen: false,
    addFeatureOpen: true,
    lat: 0.0,
    lng: 0.0,
    transactionHash: null,
    parcelLabel: null,
    parcelAddressId: null,
    parcelArea: 0,
    parcelType: null
  }

  /**
   * @notice handle ethereum events from CSC smart contract
   * @TODO move this code to the backend server  
   * @param {*} err error 
   * @param {*} events 
   */

  cscIndexAdded = async (err, events) => {
    // console.log(events.returnValues.owner);
    this.updateFeatureIndex();
  }

  parcelClaimed(err, events) {
    this.updateFeatureIndex();
  }
  /*************** Add Parcel Dialog events **************************** */

  /**
  * @notice addFeatureToBlockChain
  */

  addFeatureToBlockChain = async (lat, lng) => {
    this.setState({ addFeatureOpen: true, lng, lat });
  };

  handleAddressChange = (evt) => {
    this.setState({ parcelAddressId: evt.target.value });
  };

  handleLabelChange = (evt) => {
    this.setState({ parcelLabel: evt.target.value });
  };

  handleAreaChange = (evt) => {
    this.setState({ parcelArea: evt.target.value });
  };

  handleTypeChange = (evt) => {
    this.setState({ parcelType: evt.target.value });
  };

  handleAddFeatureDialogClose = () => {
    this.setState({ addFeatureOpen: false });
  };

  /***************    Snackbar events ********************************** */
  handleSnackbarClose = () => {
    this.setState({ snackbarOpen: false });
  };

  /***************    Drawer events ************************************ */
  /**
   * @notice openDrawer
   */

  openDrawer = (evt) => {
    this.setState({ drawerOpen: true });
  };

  /**
   * @notice closeDrawer
   */
  closeDrawer = (evt) => {
    this.setState({ drawerOpen: false });
  };

  /**
   * @notice toggleDrawer close/open the main side Drawer
   */
  toggleDrawer = (evt) => {
    this.setState({ drawerOpen: !this.state.drawerOpen });
  };

  /** *************************************************************
   * @notice render the component 
   */

  render() {
    const vertical = 'bottom';
    const horizontal = 'right';

    return (
      <div className="App">
        <GlobalState>
          <ThemeProvider theme={theme}>
            <CssBaseline />

            <MainDrawer drawerOpen={this.state.drawerOpen}
              closeDrawer={this.closeDrawer}
              features={this.state.features}
              parcels={this.state.parcels}
            />

            <MainAppBar toggleDrawer={this.toggleDrawer}
              updateFeatureIndex={this.updateMapFeatureIndex}
            />

            {/* <MainMap onRef={ref => (this.mainMap = ref)}
              addFeature={this.addFeatureToBlockChain}
              contractParcelReg={this.state.contractParcelReg}
              accounts={this.state.accounts}
              web3={this.state.web3}
            /> */}

            {/* <AddFeatureDialog addFeatureOpen={this.state.addFeatureOpen} /> */}

            {/* <Snackbar
              anchorOrigin={{ vertical, horizontal }}
              key={`${vertical},${horizontal}`}
              open={this.state.snackbarOpen}
              onClose={this.handleSnackbarClose}
              autoHideDuration={6000}
              ContentProps={{
                'aria-describedby': 'message-id',
              }}
              message={<span id="message-id">
                <Link href={"https://rinkeby.etherscan.io/tx/" + this.state.transactionHash}
                  target="_blank"
                  rel="noopener">

                  Claimed parcel added to the immutable Registry  </Link></span>}
            /> */}

          </ThemeProvider>
        </GlobalState>
      </div>
    );
  }
}

export default App;