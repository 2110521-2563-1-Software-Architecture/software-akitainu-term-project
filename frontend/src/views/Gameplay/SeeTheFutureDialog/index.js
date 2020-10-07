import React from "react";
import { makeStyles } from "@material-ui/core";
import { getCardImage } from "../../../components/type";
import TransitionsModal from "../../../components/TransitionsModal";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "fit-content",
    height: "fit-content",
    padding: "0 75px 25px",
    textAlign: "center",
  },

  title: {
    fontWeight: "1000",
    fontSize: "36px",
  },

  list: {
    display: "flex",
    padding: "0",
  },

  listItem: {
    listStyle: "none",
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

export default function SeeTheFutureDialog(props) {
  const classes = useStyles();
  const { seeTheFutureCards, open, handleClose } = props;
  console.log(seeTheFutureCards);
  return (
    <TransitionsModal open={open} handleClose={handleClose}>
      <div className={classes.root}>
        <p className={classes.title}>SEE THE FUTURE</p>
        <ul className={classes.list}>
          {seeTheFutureCards.map((card, idx) => {
            // console.log(idx, card);
            if (idx === 0)
              return (
                <li key={`sfc-card-${idx}`} className={classes.listItem}>
                  <div className={classes.labelAndCard}>
                    {"Top card"}
                    <img
                      src={getCardImage(card)}
                      className={classes.card}
                      style={{ margin: "16px" }}
                    />
                  </div>
                </li>
              );
            else if (idx === 1)
              return (
                <li key={`sfc-card-${idx}`} className={classes.listItem}>
                  <div className={classes.labelAndCard}>
                    {"2nd-top card"}
                    <img
                      src={getCardImage(card)}
                      className={classes.card}
                      style={{ margin: "16px" }}
                    />
                  </div>
                </li>
              );
            else if (idx === 2)
              return (
                <li key={`sfc-card-${idx}`} className={classes.listItem}>
                  <div className={classes.labelAndCard}>
                    {"3rd-top card"}
                    <img
                      src={getCardImage(card)}
                      className={classes.card}
                      style={{ margin: "16px" }}
                    />
                  </div>
                </li>
              );
          })}
        </ul>
        <Button onClick={handleClose} variant="contained" color="primary">
          Okay
        </Button>
      </div>
    </TransitionsModal>
  );
}
