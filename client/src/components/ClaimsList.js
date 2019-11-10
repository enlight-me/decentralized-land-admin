import React, { useContext } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DraftsIcon from '@material-ui/icons/Drafts';

import DelaContext from '../context/dela-context';

export default function ClaimsList(props) {

  const context = useContext(DelaContext);

  return (
    <div width={'100%'}>
      <List component="nav" aria-label="features geohash list">
        {context.features.map(value => (
          <ListItem button
            key={value.properties.csc}
          >
            <ListItemIcon>
              <DraftsIcon />
            </ListItemIcon>
            <ListItemText primary={value.properties.regName} />
          </ListItem>
        ))
        }
      </List>
    </div>
  );

}
