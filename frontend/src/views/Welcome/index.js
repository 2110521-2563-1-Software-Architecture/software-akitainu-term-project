import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  makeStyles,
  Grid,
  Typography,
  Avatar,
  Tooltip,
  Grow,
  TextField,
  IconButton,
  InputAdornment,
} from "@material-ui/core";
import logo from "../../shiba-inu.svg";
import { useHistory } from "react-router-dom";
import Button from "components/Button";
// import logo from '../logo.svg'

const usestyle = makeStyles((theme) => ({
  root: {
    height: "100vh",
    backgroundColor: "#465A74",
    padding: "20px 50px 20px 50px",
  },
  profileSection: {
    height: "20vh",
    backgroundColor: "#B6C5E0",
  },
  roomSection: {
    height: "60vh",
    backgroundColor: "#B6C5E0",
    marginTop: "50px",
  },
  mainSection: {
    height: "calc(100vh-40px)",
    // backgroundColor: "#B6C5E0",
    marginLeft: "50px",
  },
  playButton: {
    width: "128px",
  },
}));

function Welcome() {
  const classes = usestyle();
  const history = useHistory();

  const joinRoom100001 = () => {
    // todo:
    // var userIdPlaceholder = Math.floor(100000 + Math.random() * 900000);
    // const userId = prompt("Please enter your user Id", userIdPlaceholder);
    // window.sessionStorage.setItem("userId", userId);
  };
  const onLogout = () => {
    sessionStorage.setItem("userId", null);
    history.push("/home");
    history.go(0);
  };
  return (
    <Grid container direction="row" className={classes.root}>
      <Grid item container direction="row" xs="3">
        <Grid item xs="12" className={classes.profileSection}>
          <Typography style={{ textAlign: "center" }}>Profile</Typography>
        </Grid>
        <Grid item xs="12" className={classes.roomSection}>
          <Typography style={{ textAlign: "center" }}>Room</Typography>
        </Grid>
      </Grid>
      <Grid item xs="5" className={classes.mainSection}>
        <Grid
          item
          container
          style={{ justifyContent: "center", paddingTop: "15vh" }}
        >
          <img src={logo} className="App-logo" alt="logo" />
        </Grid>
        <Typography
          style={{
            textAlign: "center",
            color: "#ffffff",
            textShadow: "4px 4px 4px rgba(0, 0, 0, 0.5)",
            fontSize: "72px",
            marginTop: "5px",
          }}
        >
          Exploding puppy
        </Typography>
        <Grid container style={{ justifyContent: "center", marginTop: "50px" }}>
          <Button text="Play" className={classes.playButton}></Button>
        </Grid>
      </Grid>
      <Grid item xs="3" className={classes.mainSection}>
        <Typography style={{ textAlign: "center" }}>Leader Board</Typography>
      </Grid>
    </Grid>
  );
}
export default Welcome;
