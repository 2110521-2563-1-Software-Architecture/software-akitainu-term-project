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
  Slider,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import axios from "axios";

const ENDPOINT =
  process.env.REACT_APP_BACKEND_API || "http://18.141.138.13:10000";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    backgroundColor: "#465A74",
    padding: "20px 50px 20px 50px",
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
  header: {
    height: "15%",
    // backgroundColor: "#FF9AC5",
    padding: "20px 50px 20px 50px",
  },
  board: {
    height: "80%",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    padding: "20px 50px 20px 50px",
    overflow: "auto",
  },
  bodytext: {
    fontWeight: "bold",
    fontSize: "24px",
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
}));

function Leadership() {
  const classes = useStyles();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get(`${ENDPOINT}/users/leaderboard`).then((response) => {
      setUsers(response.data);
      console.log(response.data);
    });
  }, []);

  return (
    <Grid container className={classes.root}>
      <Grid
        container
        item
        className={classes.header}
        xs={12}
        justify="center"
        alignContent="center"
      >
        <Typography className={classes.title}>Leader board</Typography>
      </Grid>
      <Grid container item className={classes.board} xs={12}>
        <Grid item xs={4}>
          <Typography className={classes.title} style={{ textAlign: "center" }}>
            Username
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography className={classes.title} style={{ textAlign: "center" }}>
            Win Rate
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography className={classes.title} style={{ textAlign: "center" }}>
            Rank
          </Typography>
        </Grid>
        {users.map((user) => (
          <>
            <Grid item xs={4}>
              <Typography
                className={classes.bodytext}
                style={{ textAlign: "center" }}
              >
                {user.userName}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography
                className={classes.bodytext}
                style={{ textAlign: "center" }}
              >
                {user.winRate} %
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography
                className={classes.bodytext}
                style={{ textAlign: "center" }}
              >
                {user.userRank}
              </Typography>
            </Grid>
          </>
        ))}
      </Grid>
    </Grid>
  );
}
export default Leadership;
