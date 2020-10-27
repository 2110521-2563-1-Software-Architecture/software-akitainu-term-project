import React from "react";
import { Hidden, makeStyles } from "@material-ui/core";
import { getCardImage } from "../../../components/type";
import TransitionsModal from "../../../components/TransitionsModal";
import Button from "@material-ui/core/Button";
import { Card } from "../../../components/type";
import { X } from "react-feather";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "fit-content",
    height: "fit-content",
    padding: "0 25px 0px",
    textAlign: "center",
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

  list: {
    display: "grid",
    padding: "0",
    overflow: "auto",
    overflowX: "hidden",
    maxWidth: "85vw",
    height: "70vh",
    gridTemplateColumns: "repeat(auto-fill, 12vw)",
    gridGap: "10px",
    gridAutoColumns: "auto",
    gridAutoRows: "17vw",
  },

  listItem: {
    listStyle: "none",
    cursor: "pointer",
  },

  card: {
    width: "10vw",
    borderRadius: "16px",
    boxShadow: theme.shadows[5],
  },

  labelAndCard: {
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
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
  },
}));

export default function CardSelectorDialog(props) {
  const classes = useStyles();
  const { cardSelectorCards, open, handleClose, showBackCard = false } = props;
  return (
    <TransitionsModal open={open} showCloseButton={false}>
      <div className={classes.root}>
        <p className={classes.title}>CARD SELECTOR</p>
        <ul className={classes.list}>
          {cardSelectorCards.map((card, idx) => {
            return (
              <li
                key={`sfc-card-${idx}`}
                className={classes.listItem}
                onClick={() => {
                  handleClose(idx);
                }}
              >
                <div className={classes.labelAndCard}>
                  {"Card " + (idx + 1).toString()}
                  <img
                    src={getCardImage(showBackCard ? Card.backCard : card)}
                    className={classes.card}
                    style={{ margin: "16px auto" }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </TransitionsModal>
  );
}
