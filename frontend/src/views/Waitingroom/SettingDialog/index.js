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
  Dialog,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import CloseIcon from "@material-ui/icons/Close";
import { Card, getCardImage } from "../../../components/type";
import { Cards } from "./mock";

const useStyles = makeStyles((theme) => ({
  root: {
    // height: "100vh",
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
}));

function SettingDialog({ open, handleClose, NumberofCard }) {
  const classes = useStyles();
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
      <Grid item className={classes.root}>
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
        <Typography className={classes.title} style={{ textAlign: "center" }}>
          Game Settings
        </Typography>
        <Grid container item>
          {Cards.map((card, index) => (
            <Grid container item xs="3" justify="center">
              <img
                src={getCardImage(card)}
                style={{ width: "50%", height: "auto" }}
              />
              <Slider
                defaultValue={NumberofCard[index].Numbercard}
                valueLabelFormat={(n) => `${n}`}
                valueLabelDisplay="auto"
                step={1}
                min={3}
                max={8}
                style={{ marginBottom: "10px", width: "60%", color: "#B6C5E0" }}
                onChangeCommitted={(e, idx) => NumberofCard[index].setcard(idx)}
              />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Dialog>
  );
}

export default SettingDialog;
