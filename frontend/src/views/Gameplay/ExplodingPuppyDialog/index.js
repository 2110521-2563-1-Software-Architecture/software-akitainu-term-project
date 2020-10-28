import React, { useState } from "react";
import { makeStyles } from "@material-ui/core";
import { Card, getCardImage } from "../../../components/type";
import TransitionsModal from "../../../components/TransitionsModal";
import Button from "../../../components/Button";
import Slider from "@material-ui/core/Slider";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "50vw",
    height: "fit-content",
    padding: "0 75px 25px",
    textAlign: "center",
  },

  body: {
    display: "flex",
    width: "100%",
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

  card: {
    width: "10vw",
    borderRadius: "16px",
    boxShadow: theme.shadows[5],
    alignSelf: "flex-start",
    margin: "auto 16px",
  },

  label: {
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
    marginTop: "0",
    marginBottom: "40px",
  },

  withDefuse: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },

  sliderWrapper: {
    width: "100%",
    padding: "0 16px",
    display: "flex",
    marginBottom: "40px",
    "& > span": {
      color: "#FF6D9F",
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
  },

  sliderLabel: {
    fontSize: "16px",
    margin: "auto 16px",
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

  withoutDefuse: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
}));

export default function ExplodingPuppyDialog(props) {
  const classes = useStyles();
  const {
    hasDefuse,
    numberOfDeckCards,
    onClickSpectate,
    onClickHideExplodingPuppy,
    open,
    handleClose,
  } = props;
  const [selectedIdx, setSelectedIdx] = useState(0);

  return (
    <TransitionsModal
      open={open}
      handleClose={handleClose}
      showCloseButton={false}
    >
      <div className={classes.root}>
        <p className={classes.title}>YOU GOT EXPLODING PUPPY!</p>
        <div className={classes.body}>
          <img
            src={getCardImage(Card.explodingPuppy)}
            className={classes.card}
          />
          {!!hasDefuse && (
            <img src={getCardImage(Card.defuse)} className={classes.card} />
          )}
          {!!hasDefuse && (
            <div className={classes.withDefuse}>
              <p className={classes.label}>
                Luckily, you have Defuse card! Choose where to put the
                "Exploding Puppy" in the deck...
              </p>
              <div className={classes.sliderWrapper}>
                <p className={classes.sliderLabel}>Top</p>
                <Slider
                  defaultValue={0}
                  valueLabelFormat={(n) => `${n + 1}`}
                  valueLabelDisplay="auto"
                  step={1}
                  min={0}
                  max={numberOfDeckCards}
                  onChangeCommitted={(e, idx) => setSelectedIdx(idx)}
                />
                <p className={classes.sliderLabel}>Bottom</p>
              </div>
              <Button
                onClick={() => onClickHideExplodingPuppy(selectedIdx)}
                text={"Hide Exploding Puppy!"}
              />
            </div>
          )}
          {!hasDefuse && (
            <div className={classes.withoutDefuse}>
              <p className={classes.label}>
                Sadly, you don't have any Defuse card left!
              </p>
              <Button onClick={() => onClickSpectate()} text={"Spectate"} />
            </div>
          )}
        </div>
      </div>
    </TransitionsModal>
  );
}
