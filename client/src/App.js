import React, { Component } from "react";
import { CssBaseline } from "@material-ui/core";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import Link from '@material-ui/core/Link';

import getWeb3 from "./utils/getWeb3";
import { geoToH3 } from 'h3-js';
import CryptoSpatialCoordinateContract from "./contracts/CryptoSpatialCoordinate.json";

import MainAppBar from './components/MainAppBar';
import MainDrawer from './components/MainDrawer';
import MainMap from './components/MainMap';
import AddFeatureDialog from './components/AddFeatureDialog';

const theme = createMuiTheme({
  palette: {
    type: 'dark', // dark : light    
  },
});

class App extends Component {

  /**
   * @notice state variables 
   */

  state = {
    web3: null,
    accounts: null,
    contract: null,
    drawerOpen: false,
    features: [],
    addFeatureOpen: false,
    lat: 0.0,
    lng: 0.0,
    transactionHash: "",
  }

  /**
   * @notice componentDidMount 
   */

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();

      const deployedCSC = CryptoSpatialCoordinateContract.networks[networkId];
      const instanceCSC = new web3.eth.Contract(
        CryptoSpatialCoordinateContract.abi,
        deployedCSC && deployedCSC.address,
      );

      instanceCSC.events.LogCSCIndexedEntityAdded((err, events) => this.cscIndexAdded(err, events)).on('error', console.error);

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instanceCSC });

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
    this.updateFeatureIndex();
  };

  /**
 * @notice updateFeatureIndex Button on the AppBar
 * @todo replace it with a button directly on the map
 *        the mainmap should use the features state variable of this Component 'App'
 *        like the DrawerList
 *        This will allow to avoid using OnRef (this.mainMap.)
 */

  updateMapFeatureIndex = (evt) => {
    this.mainMap.updateFeatureIndex();
  };

  /**
   * TODO merge with the previous fucntion
   */

  updateFeatureIndex = async () => {
    fetch('http://localhost:4000/collections/cscindex')
      .then(res => {
        return res.json();
      }).then(data => {
        this.setState({ features: data });
      });
    this.mainMap.updateFeatureIndex(); // will be deleted after main map routed to this.state.features
  }

  /**
   * @notice handle ethereum events from CSC smart contract
   * @TODO move this code to the backend server  
   * @param {*} err error 
   * @param {*} events 
   */

  cscIndexAdded(err, events) {
    // console.log(events.returnValues.owner);
    this.updateFeatureIndex();
  }

  /*************** Add Parcel Dialog events **************************** */

  /**
  * @notice AddFeatureToBlockChain
  */

  AddFeatureToBlockChain = async (lat, lng) => {
    this.setState({ addFeatureOpen: true, lng, lat });
  }

  handleAddressChange = (evt) => {
    this.setState({ parcelAddressId: evt.target.value });
    console.log(this.state.parcelAddressId);
  };

  handleLabelChange = (evt) => {
    this.setState({ parcelLabel: evt.target.value });
    console.log(this.state.parcelLabel);
  };

  claimParcel = async (evt) => {
    this.setState({ addFeatureOpen: false });
    const { accounts, contract } = this.state;
    // Get network provider and web3 instance.
    const web3 = this.state.web3;

    const h3Index = geoToH3(this.state.lng, this.state.lat, 15);
    const h3IndexHex = web3.utils.asciiToHex(h3Index);

    const result = await contract.methods.addCSCIndexedEntity(h3IndexHex).send({ from: accounts[0] }).on('error', console.error);

    this.setState({ snackbarOpen: true , transactionHash : result.events.LogCSCIndexedEntityAdded.transactionHash });
    // console.log(result.events.LogCSCIndexedEntityAdded.transactionHash );
    // console.log(result.events.LogCSCIndexedEntityAdded.returnValues.cscIndex );
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
    const preventDefault = event => event.preventDefault();

    return (
      <div className="App">
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <MainDrawer drawerOpen={this.state.drawerOpen}
            closeDrawer={this.closeDrawer}
            features={this.state.features}
          />
          <MainAppBar toggleDrawer={this.toggleDrawer}
            updateFeatureIndex={this.updateMapFeatureIndex}
          />

          <MainMap onRef={ref => (this.mainMap = ref)}
            addFeature={this.AddFeatureToBlockChain}
          />

          <AddFeatureDialog addFeatureOpen={this.state.addFeatureOpen}
            handleAddFeatureDialogClose={this.handleAddFeatureDialogClose}
            handleLabelChange={this.handleLabelChange}
            handleAddressChange={this.handleAddressChange}
            claimParcel={this.claimParcel}
          />

          <Snackbar
            anchorOrigin={{ vertical, horizontal }}
            key={`${vertical},${horizontal}`}
            open={this.state.snackbarOpen}
            onClose={this.handleSnackbarClose}
            autoHideDuration={6000}
            ContentProps={{
              'aria-describedby': 'message-id',
            }}
            message={<span id="message-id">
              <Link href={"https://rinkeby.etherscan.io/tx/"+this.state.transactionHash} 
                    // onClick={preventDefault}
                    target="_blank" 
                    rel="noopener">

                  Claimed parcel added to the immutable Registry  </Link></span>}
          />

        </ThemeProvider>
      </div>
    );
  }
}

export default App;