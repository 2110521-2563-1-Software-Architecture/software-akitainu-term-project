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
} from "@material-ui/core";
import Button from "components/Button";
import CloseIcon from "@material-ui/icons/Close";

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

function CustomDialog({ open, onClose }) {
  const classes = usestyle();
  // console.log("open",openDialog)

  const handleClose = () => {
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
        <Grid item container style={{ justifyContent: "center" }}>
          <Typography
            className={classes.text}
            style={{
              fontSize: "48px",
            }}
          >
            Custom Mode
          </Typography>
        </Grid>
        <Grid
          item
          container
          direction="row"
          style={{ justifyContent: "center" }}
        >
          <Grid item xs="2">
            <Button
              text="Create Room"
              className={classes.Button}
              style="primary"
            ></Button>
          </Grid>
          <Grid item xs="2" style={{ marginLeft: "100px" }}>
            <Button
              text="Join Room"
              className={classes.Button}
              style="secondary"
            ></Button>
          </Grid>
        </Grid>
      </Grid>
    </Dialog>
  );
}

export default CustomDialog;
