import React, { useState } from "react";
import { Grid, makeStyles, Typography } from "@material-ui/core";
import { Card } from "../../../components/type";
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
import { playerHandTestProps } from "./mock.js";
import ScrollContainer from "react-indiana-drag-scroll";

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
    width: "100%",
    height: "100%",
    display: "flex",
    padding: "0",
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
    backgroundColor: "wheat", //tmp
  },
  useCardButton: {
    height: "40px",
    width: "75%",
    position: "relative",
    background: "#00A2FF",
    cursor: "pointer",
    borderRadius: "18px",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    "&:hover": {
      background: "#20ADFF",
    },
  },
  useCardButtonDisabled: {
    height: "40px",
    width: "75%",
    position: "relative",
    background: "#8F8F8F",
    cursor: "not-allowed",
    borderRadius: "18px",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    "&:hover": {
      background: "#A7A7A7",
    },
  },
}));

export function getCardImage(card) {
  switch (card) {
    case Card.defuse:
      return defuse;
    case Card.attack:
      return attack;
    case Card.skip:
      return skip;
    case Card.shuffle:
      return shuffle;
    case Card.seeTheFuture:
      return see_the_future;
    case Card.nope:
      return nope;
    case Card.favor:
      return favor;
    case Card.common1:
      return common_1;
    case Card.common2:
      return common_2;
    case Card.common3:
      return common_3;
    case Card.common4:
      return common_4;
    case Card.common5:
      return common_5;
    default:
      return card_back;
  }
}

function getNthCardStyle(n, selectedCards) {
  return {
    position: "relative",
    zIndex: `${n + 1}`,
    marginLeft: n === 0 ? "0px" : `-50px`,
    marginTop: selectedCards.includes(n) ? "-40px" : "0px",
    height: "250px",
    boxShadow: "0 0 8px 2px rgba(0, 0, 0, 0.5)",
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
    console.log(getNthCardStyle(idx, selectedCards));
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
  const { cards } = playerHandTestProps;
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
        <div
          className={
            canUseSelectedCards()
              ? classes.useCardButton
              : classes.useCardButtonDisabled
          }
          onClick={() => alert("use crad")}
        >
          Use card(s)
        </div>
      </div>
    </div>
  );
}
export default PlayerHand;
