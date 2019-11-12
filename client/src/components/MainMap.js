import React, { useState, useContext, createRef } from 'react';
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import Control from "react-leaflet-control";
import Fab from '@material-ui/core/Fab';
import EditIcon from '@material-ui/icons/Edit';
import MapIcon from '@material-ui/icons/Map';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';

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
      >

        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {context.parcels.map((parcel, idx) => (
          <Marker position={parcel.latlng} key={`marker-${idx}`}>

            <Popup  background={"#e0e0e0"} color={"#234c5e"}>
              <div>
              <Table size="small" aria-label="simple table">
                  <TableBody>
                  <TableRow>
                      <TableCell component="th" scope="row"> Label </TableCell>
                      <TableCell align="right">{parcel.lbl}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row"> Type </TableCell>
                      <TableCell align="right">{parcel.parcelType}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row"> External Address  </TableCell>
                      <TableCell align="right">{parcel.addr}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row"> Area </TableCell>
                      <TableCell align="right">{parcel.area}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <ExpansionPanelActions>
                  <Button size="small" variant="contained" color="primary">Update</Button>
                  <Button size="small" variant="contained" color="secondary">Revoke</Button>
                </ExpansionPanelActions>
              </div>
            </Popup>

          </Marker>
        ))}

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