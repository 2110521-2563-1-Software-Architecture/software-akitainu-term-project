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
    position: "center",
  },
}));

function ModeDialog({ open, onClose }) {
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
          }}
          onClick={handleClose}
        ></CloseIcon>
        <Grid item container style={{ justifyContent: "center" }}>
          <Typography
            style={{
              color: "#fff",
              fontSize: "48px",
              textShadow: "4px 4px 4px rgba(0, 0, 0, 0.5)",
            }}
          >
            Mode
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
              text="Rank"
              className={classes.Button}
              style="primary"
            ></Button>
          </Grid>
          <Grid item xs="2" style={{ marginLeft: "100px" }}>
            <Button
              text="Custom"
              className={classes.Button}
              style="secondary"
            ></Button>
          </Grid>
        </Grid>
      </Grid>
    </Dialog>
  );
}

export default ModeDialog;
