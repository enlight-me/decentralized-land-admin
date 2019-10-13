import React, { Component } from "react";
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
// import MenuIcon from '@material-ui/icons/Menu';
import Grid from '@material-ui/core/Grid';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { geoToH3 } from "h3-js";

import CryptoSpatialCoordinateContract from "./contracts/CryptoSpatialCoordinate.json";
import getWeb3 from "./utils/getWeb3";

import "./App.css";

class App extends Component {

  /* TODO add constructor 
   * constructor(props) {
   *   super(props);
   *  // N’appelez pas `this.setState()` ici !
   *   this.state = { counter: 0 };
   *   this.handleClick = this.handleClick.bind(this);
   }*/

  state = { storageValue: 0, web3: null, accounts: null, contractCSC: null };

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
      instanceCSC.events.LogCSCIndexedEntityAdded((err, events) => {
        console.log(events.returnValues)
      })
        .on('error', console.error);

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contractCSC: instanceCSC });

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  convertToH3 = async (event) => {
    // Convert a lat/lng point to a hexagon index at resolution 7
    const h3Index = geoToH3(37.3615593, -122.0553238, 15);
    this.setState({ storageValue: h3Index });
  }

  addCSCIndex = async (event) => {
    const { accounts, contractCSC } = this.state;
    // Get network provider and web3 instance.
    const web3 = this.state.web3;

    const geoHash = web3.utils.toHex("My location coordinates geoHash2")

    const result = await contractCSC.methods.addCSCIndexedEntity(geoHash).send({ from: accounts[0] });

    //const logAccountCSCIndex = result.logs[0].args.cscIndex
    // console.log(result)

    // Update state with the result.
    this.setState({ storageValue: result.events.LogCSCIndexedEntityAdded.returnValues.cscIndex });
  };



  render() {

    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">

        <MuiThemeProvider>
          <AppBar position="static">
            <Toolbar>
              <IconButton edge="start" color="inherit" aria-label="menu">
                
              </IconButton>
              <Typography variant="h6">
                SOLA Chain
          </Typography>
              <Button color="inherit">Login</Button>
            </Toolbar>
          </AppBar>

          <h1>Good to Go!</h1>
          <p> Your Truffle Box is installed and ready.</p>
          <h2>Smart Contract Example</h2>
          <p>
            If your contracts compiled and migrated successfully, below will show
            a stored value of 5 (by default).
        </p>
          <p>
            Try changing the value stored on <strong>line 40</strong> of App.js.
        </p>
          <div>The stored value is: {this.state.storageValue}</div>

          <Grid container spacing={3} direction="column" alignItems="center">
            <Grid item>
              <Button variant="contained" onClick={this.addCSCIndex.bind(this)}>Add CSC Index</Button>
            </Grid>
            <Grid item>
              <Button variant="contained" onClick={this.convertToH3.bind(this)}>Convert to H3</Button>
            </Grid>
          </Grid>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default App;
