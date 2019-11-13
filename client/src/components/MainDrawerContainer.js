import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import DelaContext from '../context/dela-context';
import ParcelDetails from './ParcelDetails';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,    
    backgroundColor: theme.palette.background.default,
  },  
}));

export default function MainDrawerContainer(props) {
  const classes = useStyles();
  const context = useContext(DelaContext);

  return (
    <Grid container className={classes.root} spacing={1}>
      {context.parcels.map(parcel => {
        return parcel.owner === context.accounts[0] ?
          <Grid item xs={12} key={parcel.csc}>
            <ParcelDetails parcel={parcel} owner={true}/>
          </Grid>
          :
          null
      }
      )}
    </Grid >
  );
}
