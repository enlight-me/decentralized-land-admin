import React, { Component } from 'react';
import { Map, TileLayer, GeoJSON } from "react-leaflet";
import Control from "react-leaflet-control";
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import MapIcon from '@material-ui/icons/Map';

// import { geoToH3 } from "h3-js";

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

    fetch('http://localhost:4000/collections/cscindex')
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

  onEachFeature(feature, layer) {
    const popupContent = ` <Popup><p>Informations</p><pre>geoHash: ${feature.properties.csc}</pre></Popup>`
    layer.bindPopup(popupContent)
  }

  /**
   * @notice updateFeatureIndex fetch the spatialite database and update the displayed markers
   */

  updateFeatureIndex() {
    fetch('http://localhost:4000/collections/cscindex')
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
            //  onClick={props.addFeature}
            // onClick={() => this.setState({ bounds: [51.3, 0.7] })}
            onClick={() => this.setState({addMode : !this.state.addMode})}
          >
            {this.state.addMode ?  <AddIcon /> : <MapIcon /> }
          </Fab>
        </Control>
      </Map>

    );
  }

}