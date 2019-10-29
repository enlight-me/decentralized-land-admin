import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import FavoriteIcon from '@material-ui/icons/Favorite';

const useStyles = makeStyles(theme => ({
  fab: {
    // position: 'absolute',
    right: theme.spacing(2),
    margin: theme.spacing(1),    
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

export default function FeaturesUpdateButtons() {
  const classes = useStyles();

  return (
    <div style={{display: 'flex',  justifyContent:'right', alignItems:'end', height: '80vh'}}>
      <Fab color="primary" aria-label="add" className={classes.fab}>
        <AddIcon />
      </Fab>
      <Fab color="secondary" aria-label="edit" className={classes.fab}>
        <EditIcon />
      </Fab>
      <Fab disabled aria-label="like" className={classes.fab}>
        <FavoriteIcon />
      </Fab>
    </div>
  );
}
