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
    const featureAddress = await instance.methods.getFeature(feature.properties.csc).call();

    const web3 = this.props.web3;
    var parcel = new web3.eth.Contract(LAParcel.abi, featureAddress);
    const label = await parcel.methods.label().call();
    console.log(label);

    const popupContent = ` <Popup><p>Informations</p><pre>dggsIndex: ${feature.properties.dggsIndex} <br/>${label}</pre></Popup>`
    // const popupContent = (<ParcelMapPopup/>);
    layer.bindPopup(popupContent)
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