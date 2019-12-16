import React, { Fragment } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AddLocationIcon from '@material-ui/icons/AddLocation';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import PowerIcon from '@material-ui/icons/Power';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';


import Logo from '../assets/parcels-icon.png';

import Footer from './Footer';

import {
  Link
} from "react-router-dom";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  title: {
    color: 'white',
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  appBar: {
    backgroundColor: '#3f3d4b',
},
}));

export default function About() {
  const classes = useStyles();

  return (
    <Fragment>
      <AppBar position="static"  className={classes.appBar}>
        <Toolbar>
          <Link to='/'>
            <img src={Logo} style={{ maxHeight: '100%', height: '60px' }} />
          </Link>
          <Link to='/'>
            <Typography className={classes.title} variant="h4" noWrap>
              DeLA
          </Typography>
          </Link>
          <div className={classes.grow} />
          
          <div>
            <Link to='/'><Button color="inherit">Map</Button></Link>
            <a href="https://github.com/allilou/onchain-land-administration"><Button color="inherit">Github</Button></a>
            <Link to='/dashboard'><Button color="inherit" color="primary" variant="contained">Dashboard</Button></Link>
          </div>
         
        </Toolbar>
      </AppBar>

      <div className="landingContainer">
        <div className={classes.root}>
          <Grid container spacing={3} >
            <Grid item xs={12} md={6} >
              <div className='opening-blurb'>
                <Typography variant='h3'> Claim your land parcel rights </Typography>
                <hr />
                <Typography variant='h5'>
                  DeLA is <br />
                  - a decentralized Crowd Sourcing Land Administration platform, <br />
                  - a framework for geospatially enabled blockchain applications, <br />
                  - an extensible platform for value added location based blochchain applications, <br />
                  - an open source project.
                                </Typography>
              </div>
            </Grid>
            <Grid item xs={12} md={6} style={{ textAlign: 'center' }}>
              <Link to='/'>
                <Button>
                  <AddLocationIcon
                    style={{ fontSize: 240, padding: '1rem', color: '#3F3D4B' }}
                  />
                </Button>
              </Link>
            </Grid>
          </Grid>
        </div>
      </div>

      <div className='blurb'>
        <Grid container spacing={3} >
          <Grid item xs={12} md={12} style={{ textAlign: 'center', padding: '5rem' }}>
            <Typography variant='h3' style={{ color: "white" }}>
              70% of the world's population has no access to formal land registration systems!
            </Typography>
          </Grid>
        </Grid>
      </div>

      <div className='howitworks'>
        <Grid container spacing={3} >
          <Grid item xs={12} md={12} style={{ textAlign: 'center', padding: '2rem' }}>
            <Typography variant='h2'>How it Works</Typography>
          </Grid>
          <Grid item xs={12} md={4} style={{ textAlign: 'center', padding: '2rem' }}>
            <Paper style={{ padding: '1rem' }}>
              <PowerIcon
                style={{ fontSize: 100, padding: '1rem', color: '#58C685' }}
              />
              <Typography variant='h3' style={{ color: "#58C685", textAlign: 'left', transform: 'translate(0, -40px)' }}>1.</Typography>
              <Typography variant='h6'>
                Install <a href='https://metamask.io/'> Metamask </a> (an Ethereum wallet manager) plugin on your browser to interact with the applications.
                Create an account and request ethers from the <a href='https://faucet.rinkeby.io/'> Rinkeby testnet faucet.</a> It's free of charge.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4} style={{ textAlign: 'center', padding: '2rem' }}>
            <Paper style={{ padding: '1rem' }}>
              <AddLocationIcon
                style={{ fontSize: 100, padding: '1rem', color: '#58C685' }}
              />
              <Typography variant='h3' style={{ color: "#58C685", textAlign: 'left', transform: 'translate(0, -40px)' }}>2.</Typography>
              <Typography variant='h6'>
                Claim a land parcel on the map directly by selecting an existing one or draw yours.
                The recorded informations are directly stored on the Ethereum blockchain and the geometry of your parcel is stored on an OrbitDB IPFS database.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4} style={{ textAlign: 'center', padding: '2rem' }}>
            <Paper style={{ padding: '1rem' }}>
              <MonetizationOnIcon
                style={{ fontSize: 100, padding: '1rem', color: '#58C685' }}
              />
              <Typography variant='h3' style={{ color: "#58C685", textAlign: 'left', transform: 'translate(0, -40px)' }}>3.</Typography>
              <Typography variant='h6'>
                Simply sit back, relax and receive contious bids for your rights.
                If other users think that they have rights on the parcel you claim, they have the right to dispute it to you.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </div>
      <Footer />

    </Fragment>
  );
}
