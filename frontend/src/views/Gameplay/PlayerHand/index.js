import React, { useState } from "react";
import { makeStyles } from "@material-ui/core";
import { Card, getCardImage } from "../../../components/type";
import ScrollContainer from "react-indiana-drag-scroll";
import Button from "../../../components/Button";

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
    width: "7vw",
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
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 5,
    paddingRight: "10px",
  },

  useCardButton: {
    width: "60%",
  },
}));

export default function PlayerHand(props) {
  const classes = useStyles();
  const {
    cards,
    handleUseCard,
    nextUserId,
    countDownComponent,
    canNope,
    cardSelectorId,
    topDiscardPile,
  } = props;
  const [selectedCards, setSelectedCards] = useState([]);
  const userId = window.sessionStorage.getItem("userId");

  const canUseSelectedCards = () => {
    if (nextUserId !== userId && !canNope) return false;
    if (cardSelectorId !== -1) return false;
    if (canNope) {
      if (selectedCards.length === 1 && cards[selectedCards[0]] === Card.nope)
        return true;
      return false;
    }
    if (selectedCards.length === 1) {
      const card = cards[selectedCards[0]];
      const cantUseCard = [
        Card.common1,
        Card.common2,
        Card.common3,
        Card.common4,
        Card.common5,
        Card.defuse,
        Card.explodingPuppy,
        Card.backCard,
        Card.nope,
      ];
      if (cantUseCard.indexOf(card) !== -1) return false;
      return true;
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
      if (!topDiscardPile) return false;
      const selectingCard = selectedCards.map((cardIdx) => cards[cardIdx]);
      selectingCard.sort();
      for (let i = 0; i < 4; i++) {
        if (selectingCard[i] === selectingCard[i + 1]) return false;
      }
      return true;
    } else {
      return false;
    }
  };

  const getNthCardStyle = (n) => ({
    position: "relative",
    zIndex: `${n + 1}`,
    marginTop: selectedCards.includes(n) ? "-40px" : "0px",
    width: "10vw",
    boxShadow:
      // equal to theme.shadows[5]
      "0px 3px 5px -1px rgba(0,0,0,0.2), 0px 5px 8px 0px rgba(0,0,0,0.14), 0px 1px 14px 0px rgba(0,0,0,0.12)",
    borderRadius: "16px",
    cursor: "pointer",
  });

  const selectCard = (n) => {
    let currentSelected;
    if (selectedCards.includes(n)) {
      currentSelected = selectedCards.filter((item) => item !== n);
    } else {
      currentSelected = [...selectedCards];
      currentSelected.push(n);
    }
    setSelectedCards(currentSelected);
  };

  const getCardsToRender = () =>
    cards.map((card, idx) => {
      return (
        <li key={`card-${idx}`} className={classes.listItem}>
          <img
            src={getCardImage(card)}
            style={getNthCardStyle(idx)}
            onClick={() => selectCard(idx)}
            className={selectedCards.includes(idx) ? undefined : classes.card}
          />
        </li>
      );
    });

  const _handleUseCard = (selectedCards) => {
    handleUseCard(selectedCards);
    setSelectedCards([]);
  };

  return (
    <div className={classes.wrapper}>
      <div className={classes.cardsWrapper}>
        <ScrollContainer
          className="scroll-container"
          style={{ paddingBottom: "16px" }}
        >
          <ul className={classes.list}>{getCardsToRender(cards)}</ul>
        </ScrollContainer>
      </div>
      <div className={classes.menuWrapper}>
        {countDownComponent}
        <Button
          disabled={!canUseSelectedCards()}
          text={selectedCards.length <= 1 ? "Use card" : "Use cards"}
          onClick={() => _handleUseCard(selectedCards)}
          className={classes.useCardButton}
        />
      </div>
    </div>
  );
}
