import React, { useState } from "react";
import { makeStyles } from "@material-ui/core";
import { Card, getCardImage } from "../../../components/type";
import ScrollContainer from "react-indiana-drag-scroll";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    width: "100%",
    height: "100%",
    display: "flex",
  },

  cardsWrapper: {
    width: "70%",
    height: "100%",
    paddingTop: "10px",
    overflow: "hidden",
    backgroundColor: "wheat", //tmp
  },

  list: {
    width: "fit-content",
    height: "100%",
    display: "flex",
    padding: "0 16px",
    margin: "50px 0 0 0",
  },

  listItem: {
    listStyle: "none",
  },

  card: {
    "&:hover": {
      marginTop: "-10px !important",
    },
  },

  menuWrapper: {
    width: "10%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  disabledButton: {
    color: "#494949 !important",
    backgroundColor: "#9E9E9E !important",
  },
}));

function getNthCardStyle(n, selectedCards) {
  return {
    position: "relative",
    zIndex: `${n + 1}`,
    marginLeft: n === 0 ? "0px" : `-50px`,
    marginTop: selectedCards.includes(n) ? "-40px" : "0px",
    height: "250px",
    boxShadow:
      // equal to theme.shadows[5]
      "0px 3px 5px -1px rgba(0,0,0,0.2), 0px 5px 8px 0px rgba(0,0,0,0.14), 0px 1px 14px 0px rgba(0,0,0,0.12)",
    borderRadius: "16px",
    cursor: "pointer",
  };
}

function selectCard(selectedCards, setSelectedCards, n) {
  let currentSelected;
  if (selectedCards.includes(n)) {
    currentSelected = selectedCards.filter((item) => item !== n);
  } else {
    currentSelected = [...selectedCards];
    currentSelected.push(n);
  }
  setSelectedCards(currentSelected);
}

function getCards(cards, selectedCards, setSelectedCards, classes) {
  const ret = cards.map((card, idx) => {
    return (
      <li key={`card-${idx}`} className={classes.listItem}>
        <img
          src={getCardImage(card)}
          style={getNthCardStyle(idx, selectedCards)}
          onClick={() => selectCard(selectedCards, setSelectedCards, idx)}
          className={selectedCards.includes(idx) ? undefined : classes.card}
        />
      </li>
    );
  });
  return ret;
}

function PlayerHand(props) {
  const classes = useStyles();
  const { cards } = props;
  const [selectedCards, setSelectedCards] = useState([]);
  const canUseSelectedCards = () => {
    if (selectedCards.length === 1) {
      const card = cards[selectedCards[0]];
      if (card === Card.common1) return false;
      else if (card === Card.common2) return false;
      else if (card === Card.common3) return false;
      else if (card === Card.common4) return false;
      else if (card === Card.common5) return false;
      else if (card === Card.defuse) return false;
      else return true;
    } else if (
      selectedCards.length === 2 &&
      cards[selectedCards[0]] === cards[selectedCards[1]]
    ) {
      return true;
    } else if (
      selectedCards.length === 3 &&
      cards[selectedCards[0]] === cards[selectedCards[1]] &&
      cards[selectedCards[1]] === cards[selectedCards[2]] &&
      cards[selectedCards[2]] === cards[selectedCards[0]]
    ) {
      return true;
    } else if (selectedCards.length === 5) {
      let hasC1, hasC2, hasC3, hasC4, hasC5;
      for (let i = 0; i < selectedCards.length; i++) {
        const card = cards[selectedCards[i]];
        if (card === Card.common1) hasC1 = true;
        if (card === Card.common2) hasC2 = true;
        if (card === Card.common3) hasC3 = true;
        if (card === Card.common4) hasC4 = true;
        if (card === Card.common5) hasC5 = true;
      }
      return hasC1 && hasC2 && hasC3 && hasC4 && hasC5;
    } else {
      return false;
    }
  };

  return (
    <div className={classes.wrapper}>
      <div className={classes.cardsWrapper}>
        <ScrollContainer className="scroll-container">
          <ul className={classes.list}>
            {getCards(cards, selectedCards, setSelectedCards, classes)}
          </ul>
        </ScrollContainer>
      </div>
      <div className={classes.menuWrapper}>
        {canUseSelectedCards() ? (
          <Button
            variant="contained"
            color="primary"
            onClick={() => alert("use crad")}
          >
            Use card(s)
          </Button>
        ) : (
          <Button
            variant="contained"
            disabled
            className={classes.disabledButton}
          >
            Use card(s)
          </Button>
        )}
      </div>
    </div>
  );
}
export default PlayerHand;
