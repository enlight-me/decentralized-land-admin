import React, { useState, useContext, createRef } from 'react';
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import Control from "react-leaflet-control";
import Fab from '@material-ui/core/Fab';
import EditIcon from '@material-ui/icons/Edit';
import MapIcon from '@material-ui/icons/Map';

import DelaContext from '../context/dela-context';
import AddFeatureDialog from './AddFeatureDialog';

/**
 * @dev React-Leaflet functionnal component
 */

export default function MainMap(props) {

  /**
   * @notice state variables 
   */

  const [addMode, setAddMode] = useState(false);
  const [latlng, setLatLng] = useState({});

  const context = useContext(DelaContext);

  const position = [40.0, 3];
  const zoom = 5;

  const mapRef = createRef()

  const handleClick = (e) => {
    const map = mapRef.current
    if (map != null) {
      setLatLng(e.latlng);
      console.log(e.latlng);
      context.openAddFeatureDialog();
    }
  }

  /**
   * @notice Render the component
   */

  return (
    <div>
      <Map
        center={position}
        zoom={zoom}
        onClick={(e) => { if (addMode) { handleClick(e) } }}
        ref="CSCMap"
        // onLocationfound={this.handleLocationFound}
        ref={mapRef}
      >

        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={position}>

          <Popup >
            <div>
              {/* style={"width:20%x; height:150px; marginTop:10px"}>
              <h1 style={"text-align:center; font-size:22px"}>Parcel informations</h1>
              <table style={"width:100%; text-align:left; font-size:15px;border-collapse:collapse;"}>
                <tr style="border-bottom: 1px solid #ddd;"><td>Label: </td><td> ${parcelValues[1]}</td></tr>
                <tr style="border-bottom: 1px solid #ddd;"><td>External address: </td><td>${parcelValues[0]} </td></tr>
                <tr style="border-bottom: 1px solid #ddd;"><td>Area: </td><td>${parcelValues[2]} </td></tr>
                <tr style="border-bottom: 1px solid #ddd;"><td>Type: </td><td>${parcelValues[3]} </td></tr>
              </table>
            </div>
            <div style= {"text-align:justify;"}>
              <a href={"#"} className={"myButton"} >Update</a>
              <a href={"#"} className={"myButton"} style={"margin-left:10px;"}>Revoke</a> */}
            </div>
          </Popup>

        </Marker>

        <Control>
          <Fab color={addMode ? "secondary" : "primary"}
            aria-label={addMode ? "Add" : "View"}
            onClick={() => setAddMode(!addMode)}
          >
            {addMode ? <EditIcon /> : <MapIcon />}
          </Fab>
        </Control>

      </Map>

      <AddFeatureDialog latlng={latlng} />
    </div>

  );

}