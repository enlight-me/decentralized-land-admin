import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Paper from '@material-ui/core/Paper';

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
  expansion :{
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

export default function MainDrawerContainer(props) {
  const classes = useStyles();

  return (
    <Grid container className={classes.root} spacing={2}>
      <ExpansionPanel className={classes.expansion}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header">
          <Typography className={classes.heading}>Claims</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          {/* <FeaturesUpdateButtons addFeature={props.addFeature} /> */}
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <Grid item xs={12}>
        <Paper className={classes.control}>
          <Grid container>
            <Grid item>
            <Typography>
            Hello
          </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}
