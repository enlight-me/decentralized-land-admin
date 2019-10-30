import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import FormLabel from '@material-ui/core/FormLabel';
import Paper from '@material-ui/core/Paper';

import FeaturesUpdateButtons from './FeaturesUpdateButtons'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    height: 140,
    width: 100,
  },
  control: {
    padding: theme.spacing(3),
  },
}));

export default function MainDrawerContainer(props) {
  const classes = useStyles();

  return (
    <Grid container className={classes.root} spacing={2}>
       <Grid item xs={12}>
        <Paper className={classes.control}>
          <Grid container>
            <Grid item>
              <FeaturesUpdateButtons addFeature={props.addFeature}/>
            </Grid>
          </Grid>
        </Paper>
        <Paper className={classes.control}>
          <Grid container>
            <Grid item>
              <FormLabel>spacing</FormLabel>              
              
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}
