import React, { useState } from "react";
import { makeStyles } from "@material-ui/core";
import { Card, getCardImage } from "../../../components/type";
import TransitionsModal from "../../../components/TransitionsModal";
import Button from "@material-ui/core/Button";
import Slider from "@material-ui/core/Slider";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "fit-content",
    height: "fit-content",
    padding: "0 75px 25px",
    textAlign: "center",
  },

  body: {
    display: "flex",
  },

  title: {
    fontWeight: "1000",
    fontSize: "36px",
  },

  card: {
    height: "250px",
    borderRadius: "16px",
    boxShadow: theme.shadows[5],
  },

  label: {
    fontWeight: "bold",
    fontSize: "24px",
    marginTop: "0",
    marginBottom: "40px",
  },

  withDefuse: {
    width: "400px",
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
  },

  sliderLabel: {
    fontWeight: "500",
    fontSize: "16px",
    margin: "auto 16px",
  },

  withoutDefuse: {
    width: "300px",
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
  console.log('exploding',open,hasDefuse);

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
            style={{ margin: "16px" }}
          />
          {hasDefuse && (
            <img
              src={getCardImage(Card.defuse)}
              className={classes.card}
              style={{ margin: "16px" }}
            />
          )}
          {hasDefuse && (
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
                variant="contained"
                color="primary"
              >
                Hide Exploding Puppy!
              </Button>
            </div>
          )}
          {!hasDefuse && (
            <div className={classes.withoutDefuse}>
              <p className={classes.label}>
                Sadly, you don't have any Defuse card left!
              </p>
              <Button
                onClick={() => onClickSpectate()}
                variant="contained"
                color="primary"
              >
                Spectate
              </Button>
            </div>
          )}
        </div>
      </div>
    </TransitionsModal>
  );
}
