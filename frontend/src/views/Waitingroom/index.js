import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  withStyles,
  makeStyles,
  Grid,
  Typography,
  Avatar,
  Tooltip,
  Grow,
  TextField,
  IconButton,
  InputAdornment,
  Box,
  Switch,
  FormControlLabel,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    backgroundColor: "#465A74",
    padding: "20px 50px 20px 50px",
  },
  settingcontainer: {
    height: "100%",
    // backgroundColor: "green",
    // padding: "20px 100px 20px 50px",
    marginRight: "50px",
  },
  settingsection: {
    height: "80%",
    backgroundColor: "#B6C5E0",
    padding: "20px 50px 20px 50px",
    marginTop: "20%",
    border: "1px solid black",
    borderRadius: "20px",
  },
  playercontainer: {
    height: "100%",
    // backgroundColor: "blue",
  },
  blanksection: {
    height: "10%",
    // backgroundColor: "green",
    padding: "20px 50px 20px 50px",
  },
  codesection: {
    height: "20%",
    backgroundColor: "#FF6D9F",
    padding: "20px 50px 20px 50px",
    border: "1px solid black",
    borderRadius: "20px",
  },
  playersection: {
    height: "70%",
    backgroundColor: "#B6C5E0",
    padding: "20px 50px 20px 50px",
    marginTop: "5%",
    border: "1px solid black",
    borderRadius: "20px",
  },
  title: {
    fontWeight: "bold",
    fontSize: "36px",
    color: "white",
    fontFamily: "Roboto",
    textShadow:
      "2px 0 0 black, \
      -2px 0 0 black, \
      0 2px 0 black, \
      0 -2px 0 black, \
      1px 1px 0 black, \
      -1px -1px 0 black, \
      1px -1px 0 black, \
      -1px 1px 0 black, \
      1px 1px 5px black;",
  },
  profilePic: {
    height: "10%",
    width: "10%",
    border: "1px solid black",
    borderRadius: "100%",
    marginRight: "20%",
  },
  playnametext: {
    fontWeight: "bold",
    fontSize: "36px",
    color: "black",
    fontFamily: "Roboto",
    // textShadow:
    //   "2px 0 0 white, \
    //   -2px 0 0 white, \
    //   0 2px 0 white, \
    //   0 -2px 0 white, \
    //   1px 1px 0 white, \
    //   -1px -1px 0 white, \
    //   1px -1px 0 white, \
    //   -1px 1px 0 white, \
    //   1px 1px 5px white;",
  },
  textheader: {
    fontWeight: "bold",
    color: "white",
    fontFamily: "Roboto",
    fontSize: "24px",
    textShadow:
      "2px 0 0 black, \
      -2px 0 0 black, \
      0 2px 0 black, \
      0 -2px 0 black, \
      1px 1px 0 black, \
      -1px -1px 0 black, \
      1px -1px 0 black, \
      -1px 1px 0 black, \
      1px 1px 5px black;",
  },
}));

function Waitingroom() {
  const classes = useStyles();
  return (
    <Grid container className={classes.root}>
      <Grid container item xs={3} className={classes.settingcontainer}>
        <Grid item xs={12} className={classes.settingsection}>
          <Typography className={classes.title} style={{ textAlign: "center" }}>
            Custom Setting
          </Typography>
          <FormControlLabel
            control={
              <Switch
                // checked={state.checkedB}
                // onChange={handleChange}
                name="checkedB"
                color="primary"
              />
            }
            label={<Typography className={classes.title}>Public</Typography>}
          />
          <Typography className={classes.title} style={{ textAlign: "left" }}>
            Max Player
          </Typography>
          <Typography className={classes.title} style={{ textAlign: "left" }}>
            เวลาต่อ turn:
          </Typography>
          <Typography className={classes.title} style={{ textAlign: "left" }}>
            Card Setting
          </Typography>
        </Grid>
      </Grid>
      <Grid item xs={8} className={classes.playercontainer}>
        <Grid
          container
          item
          xs={12}
          className={classes.codesection}
          alignContent="center"
          justify="center"
        >
          <Grid item xs={6}>
            <Typography className={classes.title}>Code :</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography className={classes.title}>888 566</Typography>
          </Grid>
        </Grid>
        <Grid container item xs={12} className={classes.playersection}>
          <Grid container item xs={6}>
            <img className={classes.profilePic}></img>
            <Typography className={classes.playnametext}>Owen</Typography>
          </Grid>
          <Grid container item xs={6}>
            <img className={classes.profilePic}></img>
            <Typography className={classes.playnametext}>Miw</Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
export default Waitingroom;
