import React, { useState, useContext, createRef } from 'react';
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import { makeStyles } from '@material-ui/core/styles';
import Control from "react-leaflet-control";
import Fab from '@material-ui/core/Fab';
import EditIcon from '@material-ui/icons/Edit';
import MapIcon from '@material-ui/icons/Map';
import Tooltip from '@material-ui/core/Tooltip';
import L from 'leaflet';

import DelaContext from '../context/dela-context';
import AddFeatureDialog from './AddFeatureDialog';
import ParcelDetails from './ParcelDetails';

/**
 * @dev map icons
 */

 const lackingPoint = new L.Icon({
  iconUrl: require('../assets/glyph-marker-icon.png'),
  iconRetinaUrl: require('../assets/glyph-marker-icon.png'),
  iconAnchor: [20, 40],
  popupAnchor: [0, -35],
  iconSize: [23, 40],
})

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

  const mapRef = createRef();
  const position = [40.0, 3];
  const zoom = 5;

  /**
   * @dev Events handlers 
   */

  const handleClick = (e) => {
    const map = mapRef.current
    if (map != null) {
      setLatLng(e.latlng);
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
        // onLocationfound={this.handleLocationFound}
        ref={mapRef}
        style={addMode ? { cursor: 'crosshair' } : null}
      >

        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {context.parcels.map((parcel, idx) => { 
          return parcel.owner === context.accounts[0] ?
            <Marker position={parcel.latlng} key={`marker-${idx}`} icon={lackingPoint}>
              <Popup>              
                <ParcelDetails parcel={parcel} owner={true}/>
              </Popup>
            </Marker>
            :            
            <Marker position={parcel.latlng} key={`marker-${idx}`}  owner={false}>
            <Popup>              
              <ParcelDetails parcel={parcel} />
            </Popup>
          </Marker>
        })}

        <Control>

          <Fab color={addMode ? "secondary" : "primary"}
            aria-label={addMode ? "Add" : "View"}
            onClick={() => setAddMode(!addMode)}
          >
            {addMode ? <EditIcon /> : <Tooltip title="Edit" aria-label="edit"><MapIcon /></Tooltip>}
          </Fab>
        </Control>

      </Map>

      <AddFeatureDialog latlng={latlng} />
    </div>

  );

}