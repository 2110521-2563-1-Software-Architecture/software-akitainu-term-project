import React, { useState } from "react";
import { makeStyles } from "@material-ui/core";
import { Card, getCardImage } from "../../../components/type";
import ScrollContainer from "react-indiana-drag-scroll";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    width: "100%",
    height: "100%",
    backgroundColor: "wheat", //tmp
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
  const numberOfCards = cards.length;
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

  return <div className={classes.wrapper}>player hand</div>;
}
export default PlayerHand;
