import React, { useState, useContext, useEffect, createRef } from 'react';
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import Control from "react-leaflet-control";
import Fab from '@material-ui/core/Fab';
import EditIcon from '@material-ui/icons/Edit';
import MapIcon from '@material-ui/icons/Map';
import Tooltip from '@material-ui/core/Tooltip';
import L from 'leaflet';
import wkx from 'wkx';
import gju from 'geojson-utils';

import DelaContext from '../context/dela-context';
import ManageParcelDialog from './ManageParcelDialog';
import ParcelDetails from './ParcelDetails';
import FeatureGroupMapToolBar from './FeatureGroupMapToolBar';

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
  const [geometryWKB, setGeometryWKB] = useState(null);

  const context = useContext(DelaContext);

  const mapRef = createRef();
  const position = [40.0, 3];
  const zoom = 5;

  /**
   * @notice onClick event handler 
   */

  const handleClick = (e) => {
    // if (map != null) {
    //   console.log(e.latlng);
      // setLatLng(e.latlng);
      // context.setUpdateMode(false);
      // context.openManageParcelDialog(true);
    // }
  };

  /**
   * @notice center the map on the user location 
   */

  useEffect(() => {
    const map = mapRef.current
    if (map != null) {
      map.leafletElement.locate()
    }
  }, []);

  const handleLocationFound = (e) => {
    const map = mapRef.current;
    if (map != null) map.leafletElement.locate({ setView: true, maxZoom: zoom });
  };

  /**
   * @notice handle feature creation event fired from the leaflet-drax toolbar
   * @param geojson the GeoJSON of the created feature
   */
  const onFeatureCreation = (geojson) => {

    var geometryWKB = wkx.Geometry.parseGeoJSON(geojson.geometry).toWkb();
    setGeometryWKB(geometryWKB);

    switch (geojson.geometry.type) {
      case 'Point': {
        const coords = geojson.geometry.coordinates;
        setLatLng({ 'lat': coords[1], 'lng': coords[0] });
        context.setUpdateMode(false);
        context.openManageParcelDialog(true);
        break;
      }
      case 'Polygon': {
        var center = gju.rectangleCentroid(geojson.geometry);
        const coords = center.coordinates;
        setLatLng({ 'lat': coords[1], 'lng': coords[0] });
        context.setUpdateMode(false);
        context.openManageParcelDialog(true);
        break;
      }
      default: console.log(geojson.geometry);
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
        onLocationfound={handleLocationFound}
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
                <ParcelDetails parcel={parcel} owner={true} expansion={false} />
              </Popup>
            </Marker>
            :
            <Marker position={parcel.latlng} key={`marker-${idx}`} owner={false}>
              <Popup>
                <ParcelDetails parcel={parcel} expansion={false} />
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

        {addMode && <FeatureGroupMapToolBar onChange={onFeatureCreation} />}

        <ManageParcelDialog latlng={latlng} geometryWKB={geometryWKB}/>
      </Map>

    </div>

  );

}