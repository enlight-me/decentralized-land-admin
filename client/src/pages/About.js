import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import AddLocationIcon from "@material-ui/icons/AddLocation";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import PowerIcon from "@material-ui/icons/Power";
import YouTube from "react-youtube";
import RoomIcon from "@material-ui/icons/Room";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

import Logo from "../assets/parcels-icon.png";

import Footer from "./Footer";

import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  title: {
    color: "white",
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  appBar: {
    minHeight: "5rem",
    backgroundColor: "#3f3d4b",
  },

  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  ul: {
    height: "16rem",
    color: "black",
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
    justifyContent: "space-around",
    fontSize: "1.3rem",
    listStyleType: "none",
  },
}));

export default function About() {
  const classes = useStyles();

  const opts = {
    height: "600px",
    width: "100%",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };

  return (
    <Fragment>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <Link to="/">
            <img
              src={Logo}
              style={{ maxHeight: "100%", height: "60px" }}
              alt={""}
            />
          </Link>
          <Link to="/">
            <Typography className={classes.title} variant="h4" noWrap>
              DeLA
            </Typography>
          </Link>
          <div className={classes.grow} />

          <div>
            <a href="https://github.com/allilou/onchain-land-administration">
              <Button color="secondary">Github</Button>
            </a>
            <Link to="/dashboard">
              <Button color="secondary">Dashboard</Button>
            </Link>
            <Link to="/">
              <Button color="secondary" variant="outlined">
                Map
              </Button>
            </Link>
          </div>
        </Toolbar>
      </AppBar>

      <div className="landingContainer">
        <div className={classes.root}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <div className="opening-blurb">
                <Typography variant="h3">
                  {" "}
                  Claim your land parcel rights{" "}
                </Typography>
                <hr />
                <Typography variant="h5">DeLA is</Typography>
                <ul className={classes.ul}>
                  <li>
                    <RoomIcon /> a decentralized Crowd Sourcing Land
                    Administration platform,
                  </li>
                  <li>
                    <RoomIcon /> a framework for geospatially enabled blockchain
                    applications,
                  </li>
                  <li>
                    <RoomIcon /> an extensible platform for value added location
                    based blochchain applications,
                  </li>
                  <li>
                    <RoomIcon /> an open source project.
                  </li>
                </ul>
              </div>
            </Grid>
          </Grid>
        </div>
      </div>

      <div className="blurb">
        <Grid container spacing={3}>
          <Grid
            item
            xs={12}
            md={12}
            style={{ textAlign: "center", padding: "5rem" }}
          >
            <Typography variant="h3" style={{ color: "white" }}>
              70% of the world's population has no access to formal land
              registration systems!
            </Typography>
          </Grid>
        </Grid>
      </div>

      <div className="howitworks">
        <Grid container spacing={3}>
          <Grid
            item
            xs={12}
            md={12}
            style={{ textAlign: "center", padding: "2rem" }}
          >
            <Typography variant="h2">How it Works</Typography>
          </Grid>
          <Grid
            item
            xs={12}
            md={4}
            style={{ textAlign: "center", padding: "2rem" }}
          >
            <Paper style={{ padding: "1rem" }}>
              <PowerIcon
                style={{ fontSize: 100, padding: "1rem", color: "#58C685" }}
              />
              <Typography
                variant="h3"
                style={{
                  color: "#58C685",
                  textAlign: "left",
                  transform: "translate(0, -40px)",
                }}
              ></Typography>
              <Typography variant="h6">
                Install <a href="https://metamask.io/"> Metamask </a> (an
                Ethereum wallet manager) plugin on your browser to interact with
                the applications. Create an account and request ethers from the{" "}
                <a href="https://faucet.rinkeby.io/">
                  {" "}
                  Rinkeby testnet faucet.
                </a>{" "}
                It's free of charge.
              </Typography>
            </Paper>
          </Grid>
          <Grid
            item
            xs={12}
            md={4}
            style={{ textAlign: "center", padding: "2rem" }}
          >
            <Paper style={{ padding: "1rem" }}>
              <AddLocationIcon
                style={{ fontSize: 100, padding: "1rem", color: "#58C685" }}
              />
              <Typography
                variant="h3"
                style={{
                  color: "#58C685",
                  textAlign: "left",
                  transform: "translate(0, -40px)",
                }}
              ></Typography>
              <Typography variant="h6">
                Claim a land parcel on the map directly by selecting an existing
                one or draw yours. The recorded informations are directly stored
                on the Ethereum blockchain and the geometry of your parcel is
                stored on an OrbitDB IPFS database.
              </Typography>
            </Paper>
          </Grid>
          <Grid
            item
            xs={12}
            md={4}
            style={{ textAlign: "center", padding: "2rem" }}
          >
            <Paper style={{ padding: "1rem" }}>
              <MonetizationOnIcon
                style={{ fontSize: 100, padding: "1rem", color: "#58C685" }}
              />
              <Typography
                variant="h3"
                style={{
                  color: "#58C685",
                  textAlign: "left",
                  transform: "translate(0, -40px)",
                }}
              ></Typography>
              <Typography variant="h6">
                Simply sit back, relax and receive contious bids for your
                rights. If other users think that they have rights on the parcel
                you claim, they have the right to dispute it to you.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </div>
      <div className="blurb">
        <Grid container spacing={3}>
          <Grid
            item
            xs={12}
            md={12}
            style={{ textAlign: "center", padding: "5rem" }}
          >
            <YouTube videoId="zqujtNPP8rU" opts={opts} />
          </Grid>
        </Grid>
      </div>

      <Footer />
    </Fragment>
  );
}
