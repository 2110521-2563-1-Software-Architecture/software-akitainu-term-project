import React, { useState, useRef, useEffect, useCallback } from "react";
import { makeStyles } from "@material-ui/core";
import { Card, getCardImage } from "../../../components/type";
import card_back from "../../../image/card_back.png";
import PlayerHand from "../PlayerHand";
import SeeTheFutureDialog from "../SeeTheFutureDialog";
import CardSelectorDialog from "../CardSelectorDialog";
import ExplodingPuppyDialog from "../ExplodingPuppyDialog";
import Otherhand from "../Otherhand";
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
    position: "relative",
  },

  middlePlayerWrapper: {
    height: "40%",
    width: "100%",
    backgroundColor: "lightblue", //tmp
    position: "relative",
  },

  selectableTopPlayerWrapper: {
    height: "100%",
    width: "20%",
    backgroundColor: "lightblue", //tmp
    position: "relative",
    zIndex: "101",
    "&:hover": { boxShadow: "0px 0px 10px 4px rgba(255,255,255,0.75)" },
    cursor: "pointer",
  },

  selectableMiddlePlayerWrapper: {
    height: "40%",
    width: "100%",
    backgroundColor: "lightblue", //tmp
    position: "relative",
    zIndex: "101",
    "&:hover": { boxShadow: "0px 0px 10px 4px rgba(255,255,255,0.75)" },
    cursor: "pointer",
  },

  cardWrapper: {
    width: "25%",
    height: "100%",
    backgroundColor: "yellow", //tmp
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  logWrapper: {
    width: "50%",
    height: "100%",
    backgroundColor: "green", //tmp
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  log: {
    width: "75%",
    height: "50%",
    position: "relative",
    zIndex: "101",
    backgroundColor: "white",
    borderRadius: "24px",
    border: "16px double gray",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "500",
    fontSize: "24px",
    padding: "16px",
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
    position: "relative",
    zIndex: "101",
  },

  backdrop: {
    width: "100%",
    height: "calc(100% - 64px)",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    position: "absolute",
    top: "64px",
    zIndex: "100",
  },
}));

function Game(props) {
  const {
    socket,
    drawCard,
    createCustomRoom,
    joinCustomRoom,
    startGame,
    getPropsFromUserId,
    hasDefuse,
    isExplode,
    insertExplodingPuppy,
    useCard = (userId, cardIdx) =>
      alert(`user id ${userId} use card idx ${cardIdx}`),
    useCommon2 = (userId, cardsIdx) =>
      alert(`user id ${userId} use card idx(s) ${cardsIdx}`),
    useCommon3 = (userId, cardsIdx) =>
      alert(`user id ${userId} use card idx(s) ${cardsIdx}`),
    useCommon5 = (userId, cardsIdx) =>
      alert(`user id ${userId} use card idx(s) ${cardsIdx}`),
  } = props;
  const classes = useStyles();

  const userId = window.sessionStorage.getItem("userId"); // todo:
  const roomId = "100001"; // todo:

  // const [userCards, setUserCards] = useState([]);
  // const { userCards } = props;

  const [showSeeTheFutureDialog, setShowSeeTheFutureDialog] = useState(false);
  const [showCardSelectorDialog, setShowCardSelectorDialog] = useState(false);

  const {
    numberOfDeckCards,
    seeTheFutureCards,
    latestUsedCard,
    users,
    cardSelectorCards,
    isSelectingPlayer,
    userCards,
  } = gameTestData; //mock data

  const getUsersToRender = () => {
    switch (users.length) {
      case 1:
        return [
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
        ];
      case 2:
        return [
          undefined,
          undefined,
          undefined,
          users[1],
          undefined,
          undefined,
          undefined,
        ];
      case 3:
        return [
          undefined,
          undefined,
          users[1],
          undefined,
          users[2],
          undefined,
          undefined,
        ];
      case 4:
        return [
          undefined,
          users[1],
          undefined,
          users[2],
          undefined,
          users[3],
          undefined,
        ];
      case 5:
        return [
          undefined,
          users[1],
          users[2],
          undefined,
          users[3],
          users[4],
          undefined,
        ];
      case 6:
        return [
          undefined,
          users[1],
          users[2],
          users[3],
          users[4],
          users[5],
          undefined,
        ];
      case 7:
        return [
          users[1],
          users[2],
          users[3],
          undefined,
          users[4],
          users[5],
          users[6],
        ];
      case 8:
        return [
          users[1],
          users[2],
          users[3],
          users[4],
          users[5],
          users[6],
          users[7],
        ];
      default:
        return [
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
        ];
    }
  };

  const usersToRender = getUsersToRender();

  const _useCard = (cardIdx) => {
    useCard(userId, cardIdx);
  };

  const _useCommon2 = (cardsIdx) => {
    useCommon2(userId, cardsIdx);
  };

  const _useCommon3 = (cardsIdx) => {
    useCommon3(userId, cardsIdx);
  };

  const _useCommon5 = (cardsIdx) => {
    useCommon5(userId, cardsIdx);
  };

  const getTopPlayer = (user) => {
    return (
      <div
        className={
          isSelectingPlayer && user
            ? classes.selectableTopPlayerWrapper
            : classes.topPlayerWrapper
        }
        onClick={
          isSelectingPlayer
            ? () => {
                alert(`select user id ${user.userId}`);
              }
            : undefined
        }
      >
        {user && <Otherhand user={user} />}
      </div>
    );
  };

  const getMiddlePlayer = (user) => {
    return (
      <div
        className={
          isSelectingPlayer && user
            ? classes.selectableMiddlePlayerWrapper
            : classes.middlePlayerWrapper
        }
        onClick={
          isSelectingPlayer
            ? () => {
                alert(`select user id ${user.userId}`);
              }
            : undefined
        }
      >
        {user && <Otherhand user={user} />}
      </div>
    );
  };

  return (
    <>
      <div className={classes.root}>
        <div className={classes.topSection}>
          {getTopPlayer(usersToRender[0])}
          <div style={{ width: "5%" }} />
          {getTopPlayer(usersToRender[1])}
          <div style={{ width: "5%" }} />
          {getTopPlayer(usersToRender[2])}
        </div>
        <div className={classes.middleSection}>
          <div className={classes.middlePlayerSection}>
            {getMiddlePlayer(usersToRender[3])}
            <div style={{ height: "10%" }} />
            {getMiddlePlayer(usersToRender[4])}
          </div>
          <div className={classes.playArea}>
            <div className={classes.cardWrapper}>
              <img
                src={card_back}
                className={classes.deck}
                onClick={() => drawCard(userId, roomId)}
              />
            </div>
            <div className={classes.cardWrapper}>
              <img
                src={getCardImage(latestUsedCard)}
                className={classes.usedCard}
              />
            </div>
            <div className={classes.logWrapper}>
              <div onClick={() => setShowSeeTheFutureDialog(true)}>
                test stf
              </div>
              <div onClick={() => setShowCardSelectorDialog(true)}>
                test cardSelector
              </div>
              <div className={classes.log}>log</div>
            </div>
          </div>
          <div className={classes.middlePlayerSection}>
            {getMiddlePlayer(usersToRender[5])}
            <div style={{ height: "10%" }} />
            {getMiddlePlayer(usersToRender[6])}
          </div>
        </div>
        <div className={classes.bottomSection}>
          <PlayerHand
            cards={userCards}
            useCard={_useCard}
            userCommon2={_useCommon2}
            userCommon3={_useCommon3}
            userCommon5={_useCommon5}
          />
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
        showBackCard={false}
      />
      <ExplodingPuppyDialog
        open={isExplode}
        hasDefuse={hasDefuse}
        numberOfDeckCards={numberOfDeckCards}
        onClickSpectate={() => {
          alert("Spectate");
        }}
        onClickHideExplodingPuppy={(idx) => {
          insertExplodingPuppy(userId, idx)
        }}
      />
      {isSelectingPlayer && <div className={classes.backdrop} />}
      <div>
        <button onClick={() => createCustomRoom(userId)}>
          createCustomRoom
        </button>
        <button onClick={() => joinCustomRoom(userId, roomId)}>
          joinCustomRoom
        </button>
        <button onClick={() => startGame(roomId)}>startGame</button>
        <button onClick={() => console.log(getPropsFromUserId(userId))}>
          getProps
        </button>
      </div>
    </>
  );
}
export default Game;
