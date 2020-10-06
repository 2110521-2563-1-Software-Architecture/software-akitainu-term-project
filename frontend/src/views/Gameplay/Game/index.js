import React, { useState, useRef, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { Card, getCardImage } from "../../../components/type";
import card_back from "../../../image/card_back.png";
import PlayerHand from "../PlayerHand";
import SeeTheFutureDialog from "../SeeTheFutureDialog";
import CardSelectorDialog from "../CardSelectorDialog";
import ExplodingPuppyDialog from "../ExplodingPuppyDialog";
import Otherhand from "../Otherhand";
import CustomRoom from "../../../components/CustomRoom";
import { gameTestData } from "./mock";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "calc(100% - 64px)",
    backgroundColor: "#522A00",
  },

  topSection: {
    width: "100%",
    height: "20%",
    display: "flex",
    justifyContent: "center",
  },

  middleSection: {
    width: "100%",
    height: "50%",
    display: "flex",
  },

  bottomSection: {
    width: "100%",
    height: "30%",
    overflow: "hidden",
  },

  middlePlayerSection: {
    width: "20%",
    height: "100%",
    display: "flex",
    flexDirection: "column-reverse",
    justifyContent: "center",
  },

  playArea: {
    width: "60%",
    height: "100%",
    display: "flex",
  },

  topPlayerWrapper: {
    height: "100%",
    width: "20%",
    backgroundColor: "lightblue", //tmp
  },

  middlePlayerWrapper: {
    height: "45%",
    width: "100%",
    backgroundColor: "lightblue", //tmp
  },

  cardWrapper: {
    width: "25%",
    height: "100%",
    backgroundColor: "yellow", //tmp
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  log: {
    width: "50%",
    height: "100%",
    backgroundColor: "green", //tmp
  },

  deck: {
    height: "250px",
    cursor: "pointer",
    borderRadius: "16px",
    boxShadow: theme.shadows[5],
  },

  usedCard: {
    height: "250px",
    borderRadius: "16px",
    boxShadow: theme.shadows[5],
  },
}));

function Game(props) {
  const { socket } = props;
  const classes = useStyles();

  const userId = window.sessionStorage.getItem("userId") // todo:
  const roomId = "100001"; // todo:

  const [userCards,setUserCards] = useState([]);
  const customRoomRef = useRef();
  const customRoom = (<CustomRoom socket={socket} ref={customRoomRef} />);

  useEffect(() => {
    const data = customRoomRef.current.getPropsFromUserId(userId);
    setUserCards(data.userCards);
  }, [customRoomRef?.current?.getPropsFromUserId(userId).userCards]);
  

  const _drawCard = () => {
    customRoomRef.current.drawCard(userId, roomId);
  }

  const [showSeeTheFutureDialog, setShowSeeTheFutureDialog] = useState(false);
  const [showCardSelectorDialog, setShowCardSelectorDialog] = useState(false);
  const [showExplodingPuppyDialog, setShowExplodingPuppyDialog] = useState(
    false
  );

  const hasDefuse = () => {
    for (let i = 0; i < userCards.length; i++) {
      if (userCards[i] === Card.defuse) return true;
    }
    return false;
  };

  const {
    numberOfDeckCards,
    seeTheFutureCards,
    latestUsedCard,
    users,
    cardSelectorCards,
  } = gameTestData; //mock data

  return (
    <>
      {customRoom}
      <div className={classes.root}>
        <div className={classes.topSection}>
          <div className={classes.topPlayerWrapper}>
            <Otherhand user={gameTestData.users[0]} />
          </div>
          <div style={{ width: "5%" }} />
          <div className={classes.topPlayerWrapper}>
            <Otherhand user={gameTestData.users[1]} />
          </div>
          <div style={{ width: "5%" }} />
          <div className={classes.topPlayerWrapper}>
            <Otherhand user={gameTestData.users[2]} />
          </div>
        </div>
        <div className={classes.middleSection}>
          <div className={classes.middlePlayerSection}>
            <div className={classes.middlePlayerWrapper}>
              <Otherhand user={gameTestData.users[3]} />
            </div>
            <div style={{ height: "5%" }} />
            <div className={classes.middlePlayerWrapper}>
              <Otherhand user={gameTestData.users[0]} />
            </div>
          </div>
          <div className={classes.playArea}>
            <div className={classes.cardWrapper}>
              <img
                src={card_back}
                className={classes.deck}
                onClick={() => alert("draw card")}
              />
            </div>
            <div className={classes.cardWrapper}>
              <img
                src={getCardImage(latestUsedCard)}
                className={classes.usedCard}
              />
            </div>
            <div className={classes.log}>
              <div onClick={() => setShowSeeTheFutureDialog(true)}>
                test stf
              </div>
              <div onClick={() => setShowCardSelectorDialog(true)}>
                test cardSelector
              </div>
              <div onClick={() => setShowExplodingPuppyDialog(true)}>
                test exploding
              </div>
            </div>
          </div>
          <div className={classes.middlePlayerSection}>
            <div className={classes.middlePlayerWrapper}>
              <Otherhand user={gameTestData.users[0]} />
            </div>
            <div style={{ height: "5%" }} />
            <div className={classes.middlePlayerWrapper}>
              <Otherhand user={gameTestData.users[0]} />
            </div>
          </div>
        </div>
        <div className={classes.bottomSection}>
          <PlayerHand cards={userCards}/>
        </div>
      </div>
      <SeeTheFutureDialog
        open={showSeeTheFutureDialog}
        handleClose={() => setShowSeeTheFutureDialog(false)}
        seeTheFutureCards={seeTheFutureCards}
      />
      <CardSelectorDialog
        open={showCardSelectorDialog}
        handleClose={() => setShowCardSelectorDialog(false)}
        cardSelectorCards={cardSelectorCards}
      />
      <ExplodingPuppyDialog
        open={showExplodingPuppyDialog}
        handleClose={() => setShowExplodingPuppyDialog(false)}
        hasDefuse={hasDefuse()}
        numberOfDeckCards={numberOfDeckCards}
        onClickSpectate={() => {
          setShowExplodingPuppyDialog(false);
          alert("Spectate");
        }}
        onClickHideExplodingPuppy={(idx) => {
          setShowExplodingPuppyDialog(false);
          alert(`Hide at idx ${idx}`);
        }}
      />
      <div>
        <button onClick={() => customRoomRef.current.createCustomRoom(userId)}>
          createCustomRoom
        </button>
        <button onClick={() => customRoomRef.current.joinCustomRoom(userId, roomId)}>
          joinCustomRoom
        </button>
        <button onClick={() => customRoomRef.current.drawCard(userId, roomId)}>drawCard</button>
        <button onClick={() => customRoomRef.current.startGame(roomId)}>startGame</button>
        <button onClick={() => customRoomRef.current.useCard(1, 1, Card.common2)}>useCard</button>
        <button onClick={() => console.log(customRoomRef.current.getPropsFromUserId(userId))}>getProps</button>
      </div>
    </>
  );
}
export default Game;
