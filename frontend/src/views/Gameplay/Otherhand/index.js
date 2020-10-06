import React, { useState } from "react";
import {
  Grid,
  makeStyles,
  Typography,
  Avatar,
  Tooltip,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100%",
  },
  cardsection: {
    width: "100%",
    height: "100%",
    backgroundColor: "red",
  },
  cardcantainer: {
    width: "100%",
    height: "60%",
    display: "flex",
    justifyContent: "center",
  },
  card: {
    width: "10%",
    height: "60%",
    backgroundColor: "red",
    border: "1px solid black",
    marginRight: "2px",
  },
  finalcard: {
    width: "10%",
    height: "60%",
    backgroundColor: "red",
    border: "1px solid black",
  },
}));

function Otherhand() {
  const classes = useStyles();
  // const numberOfCards = cards.length;
  function gencard(numberofcards) {
    var tmp = "";
    for (let i = 0; i < numberofcards; i++) {
      tmp += <div className={classes.card}></div>;
    }
    return tmp;
  }
  function rendercard() {
    return <div className={classes.card}></div>;
  }

  return (
    <Grid container direction="row" className={classes.root}>
      <Grid item xs="12">
        <Avatar
          alt="dasdasd"
          src="/broken-image.jpg"
          style={{ marginLeft: "3px", marginTop: "3px" }}
        ></Avatar>
      </Grid>
      <div
        item
        container
        direction="column"
        xs="12"
        className={classes.cardcantainer}
      >
        <div style={{ width: "5%", visibility: "hidden" }}></div>
        {gencard(2)}
        <div style={{ width: "5%", visibility: "hidden" }}></div>
      </div>
    </Grid>
  );
}

export default Otherhand;
