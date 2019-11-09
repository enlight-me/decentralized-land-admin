import React, { Component } from 'react';
import { Map, TileLayer, GeoJSON } from "react-leaflet";
import Control from "react-leaflet-control";
import Fab from '@material-ui/core/Fab';
import EditIcon from '@material-ui/icons/Edit';
import MapIcon from '@material-ui/icons/Map';


import LAParcel from "../contracts/LAParcel.json";
// import ParcelMapPopup from './ParcelMapPopup';

export default class MainMap extends Component {

  /**
   * @notice state variables 
   */

  state = {
    lat: 37.00,
    lng: 3.00,
    zoom: 7,
    features: [],
    addMode: false
  };

  /**
   * @notice GeoJSON Vector layer style
   */

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

  /**
   * @notice the constructior
   * @param props the passed properties 
   */

  constructor(props) {
    super(props);

    fetch('http://localhost:4000/collections/features')
      .then(res => {
        return res.json();
      }).then(data => {
        this.state.features = data;
      });
    this.geoJsonLayer = React.createRef();
    
  }

  /**
   * @notice create a popup for each feature added to the map
   * @param {*} feature 
   * @param {*} layer 
   */

  onEachFeature = async (feature, layer) => {
    //  h3Resolution;  name;  srs; featuresCount
    const instance = this.props.contractParcelReg;
    // console.log(instance);
    const featureAddress = await instance.methods.getFeature(feature.properties.csc)
                                                 .call({from: this.props.accounts[0]}, (error, result) => {
                                                            if (error) console.log( error);
                                                          });

    const web3 = this.props.web3;
    const parcel = new web3.eth.Contract(LAParcel.abi, featureAddress);
    const parcelValues = await parcel.methods.fetchParcel().call();
    
    const Content = ` <Popup >
          <div style=" width:20%x; height:150px; marginTop:10px">
          <h1 style="text-align:center; font-size:22px">Parcel informations</h1>
          <table style="width:100%; text-align:left; font-size:15px;border-collapse:collapse;">
          <tr style="border-bottom: 1px solid #ddd;"><td>Label: </td><td> ${parcelValues[1]}</td></tr>
          <tr style="border-bottom: 1px solid #ddd;"><td>External address: </td><td>${parcelValues[0]} </td></tr>
          <tr style="border-bottom: 1px solid #ddd;"><td>Area: </td><td>${parcelValues[2]} </td></tr>
          <tr style="border-bottom: 1px solid #ddd;"><td>Type: </td><td>${parcelValues[3]} </td></tr>
          </table></div>
          <div style = “text-align:justify;”>
          <a href="#" class="myButton" >Update</a>
          <a href="#" class="myButton" style="margin-left:10px;">Deny</a>
          </div></Popup>`;
          
          layer.bindPopup(Content)
  }

  /**
   * @notice updateFeatureIndex fetch the spatialite database and update the displayed markers
   */

  updateFeatureIndex() {
    fetch('http://localhost:4000/collections/features')
      .then(res => {
        return res.json();
      }).then(data => {
        this.setState({ features: data });
        this.geoJsonLayer.current.leafletElement.clearLayers().addData(data);
      });
  }

  /**
   * @notice to handle calls for map updates
   */
  componentDidMount() {
    this.props.onRef(this)
  }

  componentWillUnmount() {
    this.props.onRef(undefined)
  }

  /**
   * @notice Render the component
   */
  render() {
 
    const position = [this.state.lat, this.state.lng];

    return (

      <Map
        center={position}
        zoom={this.state.zoom}
        onClick={(e) => {if(this.state.addMode) {this.props.addFeature(e.latlng.lat, e.latlng.lng)}}}
        ref="CSCMap">
         
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSON
          ref={this.geoJsonLayer}
          data={this.state.features}
          style={this.geoJSONStyle}
          onEachFeature={this.onEachFeature}
        />
        <Control>
          <Fab color={this.state.addMode ?  "secondary": "primary"}
               aria-label={this.state.addMode ?  "Add": "View"}            
            onClick={() => this.setState({addMode : !this.state.addMode})}
          >
            {this.state.addMode ?  <EditIcon /> : <MapIcon /> }
          </Fab>
        </Control>
      </Map>

    );
  }

}