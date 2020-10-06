import React, { useState } from "react";
import { makeStyles } from "@material-ui/core";
import { Card } from "../../../components/type";
import card_back from "../../../image/card_back.png";
import PlayerHand from "../PlayerHand";
import SeeTheFutureDialog from "../SeeTheFutureDialog";
import CustomRoom from "../../../components/CustomRoom";

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
    overflow: "hidden",
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
    borderRadius: "16px",
    "&:hover": {
      boxShadow: "0 0 4px 2px rgba(0, 0, 0, 0.5)",
    },
  },
}));

function Game(props) {
  const classes = useStyles();
  const customRoom = new CustomRoom({ userId: 1 });
  const [showSeeTheFutureDialog, setShowSeeTheFutureDialog] = useState(false);
  console.log(customRoom.getPropsFromUserId(1));

  const seeTheFutureCards = [Card.attack, Card.defuse, Card.nope]; //mock data
  return (
    <>
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
            <div className={classes.log}>
              <div onClick={() => setShowSeeTheFutureDialog(true)}>
                test stf
              </div>
            </div>
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
      <SeeTheFutureDialog
        open={showSeeTheFutureDialog}
        handleClose={() => setShowSeeTheFutureDialog(false)}
        seeTheFutureCards={seeTheFutureCards}
      />
    </>
  );
}
export default Game;
