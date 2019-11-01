import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DraftsIcon from '@material-ui/icons/Drafts';

export default class ClaimsList extends React.Component {
  state = {
    features: [],
  }

  render() {
    return (
      <div width={'100%'}>
        <List component="nav" aria-label="features geohash list">
          {/* {this.state.features.map(value => ( */}
          {this.props.features.map(value => (
            <ListItem button
                key={value.properties.geohash}
              >
                <ListItemIcon>
                  <DraftsIcon />
                </ListItemIcon>
                <ListItemText primary={value.properties.geohash} />
              </ListItem>
            ))
          }
        </List>
      </div>
    );

  }
}
