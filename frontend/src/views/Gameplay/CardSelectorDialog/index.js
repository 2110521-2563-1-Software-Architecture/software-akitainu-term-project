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
    fontWeight: "1000",
    fontSize: "36px",
  },

  list: {
    display: "grid",
    padding: "0",
    overflow: "scroll",
    overflowX: "hidden",
    maxWidth: "85vw",
    height: "70vh",
    gridTemplateColumns: "repeat(auto-fill, 232px)",
    gridGap: "10px",
    gridAutoColumns: "250px",
    gridAutoRows: "auto",
  },

  listItem: {
    listStyle: "none",
    cursor: "pointer",
  },

  card: {
    height: "250px",
    borderRadius: "16px",
    boxShadow: theme.shadows[5],
  },

  labelAndCard: {
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
  },
}));

export default function CardSelectorDialog(props) {
  const classes = useStyles();
  const { cardSelectorCards, open, handleClose, showBackCard = false} = props;
  return (
    <TransitionsModal open={open} showCloseButton={false}>
      <div className={classes.root}>
        <p className={classes.title}>CARD SELECTOR</p>
        <ul className={classes.list}>
          {cardSelectorCards.map((card, idx) => {
            // console.log(idx, card);
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
                    style={{ margin: "16px" }}
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
