import React, { useEffect, useState, useMemo, useRef } from "react";
import { useHistory } from "react-router-dom";
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
  Dialog,
  Box,
} from "@material-ui/core";
import Button from "components/Button";
import CloseIcon from "@material-ui/icons/Close";
import PetsIcon from "@material-ui/icons/Pets";
import Pet from "../../../pets.jpg";

const usestyle = makeStyles((theme) => ({
  root: {
    height: "600px",
    backgroundColor: "#465A74",
    padding: "30px",
  },
  Button: {
    // height: "128px",
    // maxHeight: "128px",
    padding: "50px 0px 50px 0px",
    position: "center",
  },
  text: {
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

function RankDialog({ open, onClose, time, settime, isFound }) {
  const classes = usestyle();

  React.useEffect(() => {
    if (open && !isFound) {
      setTimeout(() => settime(time + 1), 1000);
    }
    console.log("open", open);
  }, [time, open]);

  const handleClose = () => {
    settime(0);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth={"lg"}>
      <Grid container className={classes.root}>
        <CloseIcon
          style={{
            position: "absolute",
            top: "16px",
            right: "24px",
            width: "30px",
            height: "30px",
            color: "#FFF",
            cursor: "pointer",
          }}
          onClick={handleClose}
        ></CloseIcon>
        {/* <PetsIcon
                    style={{
                        position: "absolute",
                        top: "28%",
                        right: "38%",
                        width: "300px",
                        height: "300px",
                        color: "#DADADA",
                    }}
                ></PetsIcon> */}
        <Grid item container style={{ justifyContent: "center" }}>
          <Typography
            className={classes.text}
            style={{
              fontSize: "48px",
            }}
          >
            Waiting Time
          </Typography>
        </Grid>
        <Grid
          container
          style={{
            width: "100%",
            justifyContent: "center",
            // backgroundImage:`url(${Pet})`
          }}
        >
          {/* <img src={Pet}></img> */}
          <Typography
            className={classes.text}
            style={{
              fontSize: "48px",
            }}
          >
            {isFound ? "welcome" : time}
          </Typography>
        </Grid>
      </Grid>
    </Dialog>
  );
}

export default RankDialog;
