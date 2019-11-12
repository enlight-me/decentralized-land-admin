import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import DelaContext from '../context/dela-context';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    
  },
  paper: {
    width: '100%',
    margin: theme.spacing(0),
    overflowX: 'auto',
    elevation: 1,
    backgroundColor: theme.palette.common.black,
  },
  expansionDetail: {
    width: '100%',
    margin: theme.spacing(1),
    backgroundColor: theme.palette.common.black,
  },
  table: {
    minWidth: 100, 
  },
  expansion: {
    width: '100%',
   backgroundColor: theme.palette.background.default,
   margin: theme.spacing(1),
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
      {context.parcels.map(parcel => (
        <Grid item xs={12} key={parcel.csc} >
          <ExpansionPanel className={classes.expansion}>

            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header">
              <Typography className={classes.heading}>{parcel.lbl}</Typography>
            </ExpansionPanelSummary>

            <ExpansionPanelDetails className={classes.expansionDetail}>

              <Paper className={classes.paper}>
                <Table size="small" className={classes.table} aria-label="simple table">
                  <TableBody>
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
              </Paper>

            </ExpansionPanelDetails>
            <ExpansionPanelActions>
              <Button size="small" variant="contained" color="primary">Update</Button>
              <Button size="small" variant="contained" color="secondary">Revoke</Button>
            </ExpansionPanelActions>

          </ExpansionPanel>
        </Grid>
      ))
      }
    </Grid >
  );
}
