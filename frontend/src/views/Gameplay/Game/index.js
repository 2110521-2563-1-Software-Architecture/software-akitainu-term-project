import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { getCardImage } from "../../../components/type";
import card_back from "../../../image/card_back.png";
import exit from "../../../image/exit.png";
import PlayerHand from "../PlayerHand";
import SeeTheFutureDialog from "../SeeTheFutureDialog";
import CardSelectorDialog from "../CardSelectorDialog";
import ExplodingPuppyDialog from "../ExplodingPuppyDialog";
import GameResultDialog from "../GameResultDialog";
import Button from "../../../components/Button";
import Otherhand from "../Otherhand";
import Countdown from "react-countdown";
import classNames from "classnames";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100%",
    backgroundColor: "#465A74",
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
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  middlePlayerWrapper: {
    height: "40%",
    width: "100%",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  cardWrapper: {
    width: "25%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  logWrapper: {
    width: "50%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  log: {
    width: "75%",
    height: "50%",
    position: "relative",
    zIndex: "101",
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: "500",
    fontSize: "24px",
    padding: "16px",
  },

  logsList: {
    width: "100%",
    height: "100%",
    overflow: "auto",
  },

  logItem: {
    width: "100%",
    fontSize: "20px",
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
    padding: "8px 0px",
    listStyle: "none",
    borderBottom: "solid 1px white",
  },

  deck: {
    width: "10vw",
    cursor: "pointer",
    borderRadius: "16px",
    boxShadow: theme.shadows[5],
  },

  usedCard: {
    width: "10vw",
    borderRadius: "16px",
    boxShadow: theme.shadows[5],
    position: "relative",
    zIndex: "101",
  },

  backdrop: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    position: "absolute",
    top: "0",
    zIndex: "100",
  },

  timeLeft: {
    fontFamily: "Roboto",
    color: "white",
    fontSize: "32px",
    marginBottom: "16px",
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

  timeLeftBelowFiveSeconds: {
    color: "red",
    fontWeight: "bold",
  },

  exitButton: {
    position: "absolute",
    top: "8px",
    left: "8px",
    padding: "8px 16px",
    "& > div": {
      "& > div": {
        fontSize: "16px",
      },
    },
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
    explodeId,
    insertExplodingPuppy,
    handleUseCard,
    seeTheFutureId,
    seeTheFutureCards,
    closeSeeTheFutureDialog,
    gameLose,
    topDiscardPile,
    isSelectingPlayerId,
    selectPlayer,
    cardSelectorId,
    setSelectedCardIdx,
    cardSelectorCards,
    usersData,
    numberOfDeckCards,
    nextUserId,
    showCardSelectorBackCard,
    userCards,
    canNope,
    handleUseNope,
    countDownTime,
    newCountDown,
    handleCompleteNopeCountdown,
    logs,
    result,
    handleExit,
  } = props;
  const classes = useStyles();
  

  const userId = window.sessionStorage.getItem("userId"); // todo:
  const roomId = "100001"; // todo:
  // console.log(props)
  // const roomId = this.props.match.params.roomId
  const timePerTurn = 30; // seconds
  const [isMyTurn, setIsMyTurn] = useState(false);
  const isSelectingPlayer = isSelectingPlayerId === userId;

  let users = usersData;

  for (let i = 0; i < users.length; i++) {
    const firstUser = users[0];
    if (firstUser.userId === userId) break;
    users.splice(0, 1);
    users.push(firstUser);
  }

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

  const _handleUseCard = (cardsIdx) => {
    handleUseCard(userId, cardsIdx);
  };

  const _handleCloseCardSelectorDialog = (selectedCardIdx) => {
    setSelectedCardIdx(userId, selectedCardIdx);
  };

  const getTopPlayer = (user) => {
    return (
      <div className={classes.topPlayerWrapper}>
        {user && (
          <Otherhand
            user={user}
            clickable={isSelectingPlayer}
            onClick={
              isSelectingPlayer
                ? () => {
                    selectPlayer(userId, user.userId);
                  }
                : undefined
            }
          />
        )}
      </div>
    );
  };

  const getMiddlePlayer = (user) => {
    return (
      <div className={classes.middlePlayerWrapper}>
        {user && (
          <Otherhand
            user={user}
            clickable={isSelectingPlayer}
            onClick={
              isSelectingPlayer
                ? () => {
                    selectPlayer(userId, user.userId);
                  }
                : undefined
            }
          />
        )}
      </div>
    );
  };

  const handleDrawCard = () => {
    if (nextUserId !== userId || cardSelectorId !== -1 || canNope) return;
    drawCard(userId, roomId);
    newCountDown(timePerTurn);
  };

  const normalRenderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      return <span></span>;
    } else {
      // Render a countdown
      return (
        <div
          className={classNames(classes.timeLeft, {
            [classes.timeLeftBelowFiveSeconds]: seconds <= 5,
          })}
        >
          {seconds}
        </div>
      );
    }
  };

  const nopeRenderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      return <span></span>;
    } else {
      // Render a countdown
      return (
        <div
          className={classNames(
            classes.timeLeft,
            classes.timeLeftBelowFiveSeconds
          )}
        >
          {seconds}
        </div>
      );
    }
  };

  const countDownComponent = canNope ? (
    <Countdown
      key={countDownTime}
      date={countDownTime}
      renderer={nopeRenderer}
      onComplete={handleCompleteNopeCountdown}
    />
  ) : userId === nextUserId ? (
    <Countdown
      key={countDownTime}
      date={countDownTime}
      renderer={normalRenderer}
      onComplete={handleDrawCard}
    />
  ) : (
    <div></div>
  );

  if (!isMyTurn && nextUserId === userId) {
    // my turn
    setIsMyTurn(true);
    newCountDown(timePerTurn);
  } else if (isMyTurn && nextUserId !== userId) {
    // other turn
    setIsMyTurn(false);
    newCountDown(0);
  }

  const _handleUseNope = () => {
    handleUseNope(userId);
  };

  const logItems = logs.map((item, idx) => (
    <li
      key={`log-${idx}`}
      className={classes.logItem}
      style={
        idx === 0
          ? { paddingTop: "0" }
          : idx === logs.length - 1
          ? { paddingButtom: "0", border: "none" }
          : undefined
      }
    >
      {item}
    </li>
  ));

  const updateLogsScroll = () => {
    const element = document.getElementById("logs");
    element.scrollTop = element.scrollHeight;
  };

  useEffect(() => {
    updateLogsScroll();
  });

  const history = useHistory();
  const _handleExit = () => {
    handleExit(userId);
    history.push("/home");
    history.go(0);
  };

  return (
    <>
      <div className={classes.root}>
        <div className={classes.topSection}>
          {getTopPlayer(usersToRender[2])}
          <div style={{ width: "5%" }} />
          {getTopPlayer(usersToRender[3])}
          <div style={{ width: "5%" }} />
          {getTopPlayer(usersToRender[4])}
        </div>
        <div className={classes.middleSection}>
          <div className={classes.middlePlayerSection}>
            {getMiddlePlayer(usersToRender[0])}
            <div style={{ height: "10%" }} />
            {getMiddlePlayer(usersToRender[1])}
          </div>
          <div className={classes.playArea}>
            <div className={classes.cardWrapper}>
              <img
                src={card_back}
                className={classes.deck}
                onClick={handleDrawCard}
              />
            </div>
            <div className={classes.cardWrapper}>
              <img
                src={topDiscardPile ? getCardImage(topDiscardPile) : undefined}
                className={classes.usedCard}
              />
            </div>
            <div className={classes.logWrapper}>
              <div className={classes.log}>
                <ui id="logs" className={classes.logsList}>
                  {logItems}
                </ui>
              </div>
            </div>
          </div>
          <div className={classes.middlePlayerSection}>
            {getMiddlePlayer(usersToRender[6])}
            <div style={{ height: "10%" }} />
            {getMiddlePlayer(usersToRender[5])}
          </div>
        </div>
        <div className={classes.bottomSection}>
          <PlayerHand
            cards={userCards}
            handleUseCard={_handleUseCard}
            nextUserId={nextUserId}
            countDownComponent={countDownComponent}
            canNope={canNope}
            cardSelectorId={cardSelectorId}
          />
        </div>
      </div>
      <SeeTheFutureDialog
        open={seeTheFutureId === userId}
        handleClose={() => closeSeeTheFutureDialog()}
        seeTheFutureCards={seeTheFutureCards}
      />
      <CardSelectorDialog
        open={cardSelectorId === userId}
        handleClose={(selelctedCardIdx) =>
          _handleCloseCardSelectorDialog(selelctedCardIdx)
        }
        cardSelectorCards={cardSelectorCards}
        showBackCard={showCardSelectorBackCard}
      />
      <ExplodingPuppyDialog
        open={explodeId === userId}
        hasDefuse={hasDefuse(userId)}
        numberOfDeckCards={numberOfDeckCards}
        onClickSpectate={() => {
          gameLose(userId);
        }}
        onClickHideExplodingPuppy={(idx) => {
          insertExplodingPuppy(userId, idx);
        }}
      />
      <GameResultDialog result={result} userId={userId} />
      {isSelectingPlayer && <div className={classes.backdrop} />}
      <Button
        text={"Exit"}
        icon={exit}
        iconPosition={"top"}
        style={"secondary"}
        onClick={_handleExit}
        className={classes.exitButton}
      />
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
        <button onClick={() => _handleUseNope()}>use nope</button>
      </div>
    </>
  );
}
export default Game;
