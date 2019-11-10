import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import DelaContext from '../context/dela-context';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    width: 100,
  },
  control: {
    padding: theme.spacing(2),
  },
  expansion: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

export default function MainDrawerContainer(props) {
  const classes = useStyles();
  const context = useContext(DelaContext);

  return (
    <Grid container className={classes.root} spacing={1}>
      {context.features.map(value => (
        <Grid item xs={12} key={value.properties.csc}>
          <ExpansionPanel className={classes.expansion}>

            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header">
              <Typography className={classes.heading}>{value.properties.dggsIndex}</Typography>
            </ExpansionPanelSummary>

            <ExpansionPanelDetails>
              <Typography>{value.properties.regName}</Typography>
            </ExpansionPanelDetails>

          </ExpansionPanel>
        </Grid>
      ))
      }
    </Grid >
  );
}
