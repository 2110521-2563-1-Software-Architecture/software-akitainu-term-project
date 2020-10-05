import React, { useState } from "react";
import { Grid, makeStyles, Typography } from "@material-ui/core";
import card_back from "../../../image/card_back.png";
import common_1 from "../../../image/common_1.png";
import common_2 from "../../../image/common_2.png";
import common_3 from "../../../image/common_3.png";
import common_4 from "../../../image/common_4.png";
import common_5 from "../../../image/common_5.png";
import attack from "../../../image/attack.png";
import skip from "../../../image/skip.png";
import see_the_future from "../../../image/see_the_future.png";
import favor from "../../../image/favor.png";
import defuse from "../../../image/defuse.png";
import nope from "../../../image/nope.png";
import shuffle from "../../../image/shuffle.png";
import bomb from "../../../image/bomb.png";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    width: "100%",
    height: "100%",
    backgroundColor: "wheat", //tmp
  },
}));

function PlayerHand(props) {
  const classes = useStyles();
  //   const { cards } = props;
  //   const cardList = cards.map((card, idx) => <li>tmp</li>);

  return <div className={classes.wrapper}>player hand</div>;
}
export default PlayerHand;
