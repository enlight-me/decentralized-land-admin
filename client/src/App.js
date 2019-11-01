import React, { Component } from "react";
import { CssBaseline } from "@material-ui/core";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Cyan from '@material-ui/core/colors/cyan';

import getWeb3 from "./utils/getWeb3";
import { geoToH3 } from 'h3-js';
import CryptoSpatialCoordinateContract from "./contracts/CryptoSpatialCoordinate.json";

import MainAppBar from './components/MainAppBar';
import MainDrawer from './components/MainDrawer';
import MainMap from './components/MainMap';

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
    features: []
  }

  /**
   * @notice componentDidMount
   * 
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
   * @notice handle ethereum events from CSC smart contract
   * @TODO move this code to the backend server  
   * @param {*} err error 
   * @param {*} events 
   */

  cscIndexAdded(err, events) {
    const owner = events.returnValues.owner;
    const index = events.returnValues.cscIndex;
    const geoHash = events.returnValues.geoHash;
    const transactionHash = events.transactionHash;
    const addFeatureURL = 'http://localhost:4000/collections/cscindex/addFeature?';

    fetch(addFeatureURL + 'geohash=' + geoHash + '&owner=' + owner + '&index=' + index + '&transactionHash=' + transactionHash)
      .then(res => {
        return res.json();
      }).then(data => {
        this.mainMap.updateFeatureIndex();
      });      
  }

  /**
   * @notice handleAddFeatureClick //// Unused
   */

  handleAddFeatureClick = async (evt) => {
    alert('Button Add clicked');
  }

  /**
   * @notice AddFeatureToBlockChain
   */

  AddFeatureToBlockChain = async (lat, lng) => {
    const { accounts, contract } = this.state;
   // Get network provider and web3 instance.
    const web3 = this.state.web3;
    
    const h3Index = geoToH3(lng, lat, 15);
    const h3IndexHex = web3.utils.asciiToHex(h3Index);

    const result = await contract.methods.addCSCIndexedEntity(h3IndexHex).send({ from: accounts[0] }).on('error', console.error);

    this.updateFeatureIndex();
    // console.log(result.events.LogCSCIndexedEntityAdded.returnValues.cscIndex );
  }

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

  /**
   * @notice updateFeatureIndex 
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
          this.setState({features : data});
        });
    };

  /** 
   * @notice render the component 
   */

  render() {
    return (
      <div className="App">
        <ThemeProvider theme={theme}>
          <CssBaseline/>
          <MainDrawer drawerOpen={this.state.drawerOpen}
            closeDrawer={this.closeDrawer}
            addFeature={this.handleAddFeatureClick}
            features={this.state.features}
          />
          <MainAppBar color={Cyan} // do not work ???
                      toggleDrawer={this.toggleDrawer} 
                      updateFeatureIndex={this.updateMapFeatureIndex}
                      />
          <MainMap onRef={ref => (this.mainMap = ref)} 
                   addFeature={this.AddFeatureToBlockChain} 
                    />      
            
        </ThemeProvider>
      </div>
    );
  }
}

export default App;