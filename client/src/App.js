import React, { Component } from "react";
import { Button, Card, Text, Heading, Box, Flex } from 'rimble-ui';

import { Map, TileLayer, GeoJSON } from "react-leaflet";

import { geoToH3 } from "h3-js";

import CryptoSpatialCoordinateContract from "./contracts/CryptoSpatialCoordinate.json";
import getWeb3 from "./utils/getWeb3";

import "./App.css";

class App extends Component {

  state = {
    storageValue: 0,
    h3Index : 0,
    web3: null,
    accounts: null,
    contract: null,
    lat: 0.00,
    lng: 3.00,
    zoom: 2,
    features: [],
  }

  geoJSONStyle() {
    return {
      radius: 8,
      fillColor: "#ff7800",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    }
  }

  onEachFeature(feature, layer) {
    const popupContent = ` <Popup><p>Informations</p><pre>geoHash: ${feature.properties.geohash}</pre></Popup>`
    layer.bindPopup(popupContent)
  }

  constructor(props) {
    super(props);
    // N’appelez pas `this.setState()` ici !
    // this.state = { counter: 0 };
    fetch('http://localhost:4000/getindexes')
      .then(res => {
        return res.json();
      }).then(data => {
        this.state.features = data;
      });
  }

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
    this.setState({ h3Index });
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
    const position = [this.state.lat, this.state.lng];

    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <Heading m={4}>Onchain Solutions for Open Land Administration</Heading>
        <Flex flexWrap="wrap">
        <Card width={"620px"} mx={"auto"} px={4}>
          <Heading.h3>
            The Crypto-Spatial Index value is:
          </Heading.h3>
          <Box><Text  textAlign="centre" mb={2}> {this.state.storageValue} </Text></Box>
          <Button mb={4} onClick={this.addCSCIndex.bind(this)}>Add CSC Index</Button>
      
          <Heading.h3>
            The H3 Hex (DGGS compliant) value is:
          </Heading.h3>
          <Box><Text textAlign="centre" mb={2}> {this.state.h3Index} </Text></Box>
          <Button onClick={this.convertToH3.bind(this)}>Convert to H3</Button>
        </Card>

        <Card width={"700px"} mx={"auto"} px={4}>
          <Map center={position} zoom={this.state.zoom}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <GeoJSON
              data={this.state.features}
              style={this.geoJSONStyle}
              onEachFeature={this.onEachFeature}
            />
          </Map>
        </Card>
        </Flex>
      </div>
    );
  }
}

export default App;
