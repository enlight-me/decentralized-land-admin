import React, { Component } from "react";
import { CssBaseline } from "@material-ui/core";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import Link from '@material-ui/core/Link';
import { geoToH3 } from 'h3-js';

import getWeb3 from "./utils/getWeb3";
import MainAppBar from './components/MainAppBar';
import MainDrawer from './components/MainDrawer';
import MainMap from './components/MainMap';
import AddFeatureDialog from './components/AddFeatureDialog';

import LAParcelRegistry from "./contracts/LAParcelRegistry.json";
import LAParcel from "./contracts/LAParcel.json";

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
    contractParcelReg: null,
    drawerOpen: false,
    features: [],
    parcels: [],
    addFeatureOpen: false,
    lat: 0.0,
    lng: 0.0,
    transactionHash: null,
    parcelLabel: null,
    parcelAddressId: null,
    parcelArea: 0, 
    parcelType: null
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

      const deployedParcelReg = LAParcelRegistry.networks[networkId];
      const contractParcelReg = new web3.eth.Contract(
        LAParcelRegistry.abi,
        deployedParcelReg && deployedParcelReg.address,
      );      
      contractParcelReg.events.LogParcelClaimed((err, events) => this.parcelClaimed(err, events)).on('error', console.error);

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contractParcelReg });

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

  updateMapFeatureIndex = async (evt) => {
    this.mainMap.updateFeatureIndex();
  };

  /**
   * TODO merge with the previous fucntion
   */

  updateFeatureIndex = async () => {
    fetch('http://localhost:4000/collections/features')
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

  claimParcel = async (evt) => {
    const { accounts, contractParcelReg, parcelLabel, parcelAddressId, parcelArea, parcelType } = this.state;
    // if (parcelAddressId ==="")
    this.setState({ addFeatureOpen: false });
    // Get network provider and web3 instance.
    const web3 = this.state.web3;

    const h3Index = geoToH3(this.state.lng, this.state.lat, 15);
    const h3IndexHex = web3.utils.asciiToHex(h3Index);
    const wkbHash = web3.utils.asciiToHex("wkbHash");
    const area = Number(parcelArea);
    
    const result = await contractParcelReg.methods.claimParcel( h3IndexHex,
                                                                wkbHash,
                                                                parcelAddressId,
                                                                parcelLabel,                                                                
                                                                area, 
                                                                parcelType)
                                              .send({ from: accounts[0] })
                                              .on('error', console.error);

    this.setState({ snackbarOpen: true , transactionHash : result.events.LogParcelClaimed.transactionHash });
  };

  updateParcelsList = async () => {
    console.log("-----------------------------", this.state.features);
    var parcels =[];
    const instance = this.state.contractParcelReg;
    const web3 = this.state.web3;

    this.state.features.map( async(value) => {
          const featureAddress = await instance.methods.getFeature(value.properties.csc).call();
          const parcel = new web3.eth.Contract(LAParcel.abi, featureAddress);
          const parcelValues = await parcel.methods.fetchParcel().call();
          parcels.push(parcelValues);          
        });
    this.setState({ parcels });
    console.log(this.state.parcels);
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

          <MainMap onRef={ref => (this.mainMap = ref)}
            addFeature={this.addFeatureToBlockChain}
            contractParcelReg={this.state.contractParcelReg}
            accounts={this.state.accounts}
            web3={this.state.web3}
          />

          <AddFeatureDialog addFeatureOpen={this.state.addFeatureOpen}
            handleAddFeatureDialogClose={this.handleAddFeatureDialogClose}
            handleLabelChange={this.handleLabelChange}
            handleAddressChange={this.handleAddressChange}
            handleAreaChange = {this.handleAreaChange}
            handleTypeChange = {this.handleTypeChange}
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