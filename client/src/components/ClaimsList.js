import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DraftsIcon from '@material-ui/icons/Drafts';

export default class ClaimsList extends React.Component {
  
  render() {    
    var parcels = this.props.parcels;
    console.log(parcels, typeof(parcels));
    // const p = Object.values(parcels);
    // console.log(p);
    // parcels.map((value) => console.log(value));

    return (
      <div width={'100%'}>
        <List component="nav" aria-label="features geohash list">
  {/*       {this.props.features.map(value => ( */}
          {/* {Object.keys(parcels).map((value) => (
            <ListItem button
                key={value[0]}
              >
                <ListItemIcon>
                  <DraftsIcon />
                </ListItemIcon>
                <ListItemText primary={parcels[value]} />
              </ListItem>
            ))
          } */}
        </List>
      </div>
    );

  }
}
