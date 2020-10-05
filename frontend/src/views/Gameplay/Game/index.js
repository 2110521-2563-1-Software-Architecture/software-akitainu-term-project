import React, { useState } from "react";
import { Grid, makeStyles, Typography } from "@material-ui/core";
import card_back from "../../../image/card_back.png";
import PlayerHand from "../PlayerHand";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "calc(100% - 64px)",
    backgroundColor: "#522A00",
  },
  topSection: {
    width: "100%",
    height: "20%",
    display: "flex",
    justifyContent: "center",
  },
  middleSection: {
    width: "100%",
    height: "50%",
    display: "flex",
  },
  bottomSection: {
    width: "100%",
    height: "30%",
  },
  middlePlayerSection: {
    width: "20%",
    height: "100%",
    display: "flex",
    flexDirection: "column-reverse",
  },
  playArea: {
    width: "60%",
    height: "100%",
    display: "flex",
  },
  topPlayerWrapper: {
    height: "100%",
    width: "20%",
    backgroundColor: "lightblue", //tmp
  },
  middlePlayerWrapper: {
    height: "45%",
    width: "100%",
    backgroundColor: "lightblue", //tmp
  },
  card: {
    width: "25%",
    height: "100%",
    backgroundColor: "yellow", //tmp
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  log: {
    width: "50%",
    height: "100%",
    backgroundColor: "green", //tmp
  },

  cardImg: {
    height: "250px",
    cursor: "pointer",
    "&:hover": {
      boxShadow: "0 0 16px 2px rgba(0, 0, 0, 0.5)",
    },
  },
}));

function Game(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.topSection}>
        <div className={classes.topPlayerWrapper}>P4</div>
        <div style={{ width: "5%" }} />
        <div className={classes.topPlayerWrapper}>P5</div>
        <div style={{ width: "5%" }} />
        <div className={classes.topPlayerWrapper}>P6</div>
      </div>
      <div className={classes.middleSection}>
        <div className={classes.middlePlayerSection}>
          <div className={classes.middlePlayerWrapper}>P2</div>
          <div style={{ height: "5%" }} />
          <div className={classes.middlePlayerWrapper}>P3</div>
        </div>
        <div className={classes.playArea}>
          <div className={classes.card}>
            <img
              src={card_back}
              className={classes.cardImg}
              onClick={() => alert("draw card")}
            />
          </div>
          <div className={classes.card}>used card</div>
          <div className={classes.log}>log</div>
        </div>
        <div className={classes.middlePlayerSection}>
          <div className={classes.middlePlayerWrapper}>P8</div>
          <div style={{ height: "5%" }} />
          <div className={classes.middlePlayerWrapper}>P7</div>
        </div>
      </div>
      <div className={classes.bottomSection}>
        <PlayerHand />
      </div>
    </div>
  );
}
export default Game;
