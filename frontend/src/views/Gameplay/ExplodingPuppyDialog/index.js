import React from "react";
import { makeStyles } from "@material-ui/core";
import { Card, getCardImage } from "../../../components/type";
import TransitionsModal from "../../../components/TransitionsModal";
import Button from "@material-ui/core/Button";

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
  },

  withDefuse: {
    width: "400px",
  },

  withoutDefuse: {},
}));

export default function ExplodingPuppyDialog(props) {
  const classes = useStyles();
  const { hasDefuse, open, handleClose } = props;
  return (
    <TransitionsModal open={open} handleClose={handleClose}>
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
            </div>
          )}
          {!hasDefuse && (
            <div className={classes.withoutDefuse}>
              <p className={classes.label}></p>
            </div>
          )}
        </div>
        <Button onClick={handleClose} variant="contained" color="primary">
          Okay
        </Button>
      </div>
    </TransitionsModal>
  );
}
