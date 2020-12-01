import React from "react";
import Chat from "./Chat";
import Game from "./Game";
import { Palette } from "components";
import { Card, GameMode } from "../../components/type";
import axios from "axios";

const allSelectableCards = Object.values(Card);
allSelectableCards.splice(allSelectableCards.indexOf(Card.explodingPuppy), 1);
allSelectableCards.splice(allSelectableCards.indexOf(Card.backCard), 1);

// const timePerTurn = 30; // seconds
const timeForNope = 5; // seconds

const ENDPOINT =
  process.env.REACT_APP_BACKEND_API || "http://18.141.138.13:10000";

class Gameplay extends React.Component {
  constructor(props) {
    super(props);

    const roomId = props.match.params.roomId;
    const userId = window.sessionStorage.getItem("userId");
    props.socket.emit("set-socket", { userId, roomId });
    this.state = {
      socket: props.socket,
      roomId, // room Id
      usersData: [], // {userId, userName, userCards, isDead, profileImgUrl}
      createdTime: new Date(),
      leftCardNumber: -1, // left card number in the card pile
      nextUserId: -1,
      nextTurnLeft: 1,
      discardPile: [], // index 0 is the bottom,
      explodeId: -1,
      seeTheFutureId: -1,
      seeTheFutureCards: [],
      isSelectingPlayerId: -1,
      cardSelectorId: -1,
      targetId: -1,
      cardSelectorCards: [],
      userId,
      usingEffectCard: Card.backCard, // Card.common2 for 2 of a kind, Card.common3 for 3 of a kind, Card.common5 for 5 diffrent kind of cards
      showCardSelectorBackCard: false,
      time: new Date(),
      newNextUserId: -1,
      newNextTurnLeft: 0,
      canNope: false,
      cardUserId: -1,
      countDownTime: 0,
      newCardSelectorId: -1,
      isNoped: false, // false mean 0/2/4/... nope, true mean 1/3/5/... nope
      logs: [],
      result: [],
      hasDefuse: false,
      userProgress: {
        rank: 0,
        exp: -1,
        level: 0,
      },
      timePerTurn: 30,
      mode: GameMode.custom,
    };
    this.setUserProgress();
  }

  componentDidMount() {
    this.state.socket.on("new-custom-room", (data) => {
      console.log("new-custom-room", data);

      const { userId, roomId } = data;
      if (userId !== this.state.userId) return; // Should not possible?
      const userName =
        sessionStorage.getItem("userName") ||
        window.sessionStorage.getItem("userName") ||
        userId;
      const profileImgUrl =
        sessionStorage.getItem("profileImgUrl") || "/broken-image.jpg";
      const usersData = [
        {
          userId,
          userName,
          userCards: [],
          numberOfCards: 0,
          isDead: false,
          profileImgUrl: profileImgUrl,
        },
      ];

      this.addLogs(userName + " created room number " + roomId);
      this.setState({
        roomId,
        usersData,
      });
    });
    this.state.socket.on("new-join-custom-other", (data) => {
      console.log("new-join-custom-other", data);
      if (!data) return;

      const { userId, roomId, userName, profileImgUrl } = data;
      const { usersData } = this.state;
      if (userId === this.state.userId) return;
      if (this.findUserIdx(userId) !== -1) return;
      const newUserData = {
        userId,
        userName,
        userCards: [],
        numberOfCards: 0,
        isDead: false,
        profileImgUrl,
      };
      usersData.push(newUserData);
      this.addLogs(userName + " joined this room");
      this.setState({
        usersData,
        roomId,
      });
    });
    this.state.socket.on("new-join-custom-joiner", (data) => {
      console.log("new-join-custom-joiner", data);
      if (!data) return;
      const usersData = [];
      const { usersId, usersName, profileImgUrls } = data;
      let alreadyJoin = false;
      usersId.forEach((userId, idx) => {
        if (userId === this.state.userId && idx !== usersId.length - 1)
          alreadyJoin = true;
        const newUserData = {
          userId,
          userName: usersName[idx],
          userCards: 0,
          numberOfCards: 0,
          isDead: false,
          // profileImgUrl: profileImgUrls[idx], todo:
        };
        usersData.push(newUserData);
      });
      if (alreadyJoin) {
        console.log("Error: You already joined this room.");
        return;
      }

      if (this.state.userId !== usersId[usersId.length - 1]) return;
      this.addLogs("You joined room number " + data.roomId);
      this.setState({
        usersData,
        roomId: data.roomId,
      });
    });
    this.state.socket.on("new-card", (data) => {
      console.log("new-card", data);

      const {
        userId,
        roomId,
        card,
        leftCardNumber,
        nextUserId,
        nextTurnLeft,
      } = data;
      if (this.state.roomId !== roomId) return;
      if (card === Card.explodingPuppy) {
        this.setState({
          leftCardNumber,
        });
        this.drawExplodingPuppy(userId, roomId);
        return;
      }

      const userIdx = this.findUserIdx(userId);
      const { usersData } = this.state;
      usersData[userIdx].userCards.push(card);
      usersData[userIdx].numberOfCards = usersData[userIdx].userCards.length;

      const userName = this.getUserNameByUserId(userId);
      this.addLogs(userName + " draw new card");
      if (nextUserId !== this.state.nextUserId) {
        const nextUserName = this.getUserNameByUserId(nextUserId);
        this.addLogs("Start " + nextUserName + " turn");
      }
      this.setState({
        usersData,
        leftCardNumber,
        nextUserId,
        nextTurnLeft,
      });
    });

    this.state.socket.on("new-game", (data) => {
      console.log("new-game", data);

      // join socket's room
      this.state.socket.emit("join-room", {
        userId: this.state.userId,
        roomId: this.state.roomId,
      });

      const {
        roomId,
        leftCardNumber,
        usersId,
        usersCard,
        nextUserId,
        nextTurnLeft,
        timePerTurn,
        mode,
      } = data;
      if (this.state.roomId !== roomId) return;

      const usersData = [];
      usersId.forEach((userId, idx) => {
        const newUserData = {
          userId,
          userName: "",
          userCards: usersCard[idx],
          numberOfCards: usersCard[idx].length,
          isDead: false,
        };
        usersData.push(newUserData);
      });

      this.addLogs("Game started");
      this.setState({
        leftCardNumber,
        usersData,
        nextUserId,
        nextTurnLeft,
        timePerTurn,
        mode,
      });

      usersData.map(async (userData) => {
        const userNameResp = await axios.get(
          `${process.env.REACT_APP_BACKEND_API}/users/username/${userData.userId}`
        );
        userData.userName = userNameResp.data;
      });
      this.setState({ usersData });
    });
    this.state.socket.on("new-card-use", (data) => {
      console.log("new-card-use", data);

      const { userId, roomId, card, cardIdx, nextUserId, nextTurnLeft } = data;
      const { usersData, discardPile } = this.state;

      if (this.state.roomId !== roomId) return;
      const userIdx = this.findUserIdx(userId);
      if (usersData[userIdx].userCards[cardIdx] !== card) return;
      discardPile.push(card);
      usersData[userIdx].userCards.splice(cardIdx, 1);
      usersData[userIdx].numberOfCards = usersData[userIdx].userCards.length;

      this.setState({
        usersData,
        newNextUserId: nextUserId,
        newNextTurnLeft: nextTurnLeft,
        cardUserId: userId,
        usingEffectCard: card,
      });

      switch (card) {
        case Card.favor:
          this.setState({ isSelectingPlayerId: userId });
          break;
        default:
          this.setState({ canNope: true, isNoped: false });
          this.newCountDown(timeForNope);
      }
      const userName = this.getUserNameByUserId(userId);
      this.addLogs(userName + " use " + card);
    });
    this.state.socket.on("new-common-2", (data) => {
      console.log("new-common-2", data);

      const { userId, roomId, cardsIdx } = data;
      if (this.state.roomId !== roomId) return;

      const { usersData, discardPile, nextUserId, nextTurnLeft } = this.state;
      const userIdx = this.findUserIdx(userId);
      const userCards = usersData[userIdx].userCards;
      const usingCard = userCards[cardsIdx[0]];
      const newUserCards = [];
      userCards.forEach((card, idx) => {
        if (cardsIdx.indexOf(idx) === -1) newUserCards.push(card);
        else discardPile.push(card);
      });
      usersData[userIdx].userCards = newUserCards;
      usersData[userIdx].numberOfCards = usersData[userIdx].userCards.length;

      this.setState({
        usersData,
        isSelectingPlayerId: userId,
        cardUserId: userId,
        usingEffectCard: Card.common2,
        newNextUserId: nextUserId,
        newNextTurnLeft: nextTurnLeft,
      });
      const userName = this.getUserNameByUserId(userId);
      this.addLogs(userName + " use 2 of " + usingCard);
    });
    this.state.socket.on("receive-common-2", (data) => {
      console.log("receive-common-2", data);

      const { userId, roomId, targetId, targetCard } = data;
      const { usersData } = this.state;
      if (this.state.roomId !== roomId) return;

      const userIdx = this.findUserIdx(userId);
      const targetIdx = this.findUserIdx(targetId);
      // todo?: find another way that better than random
      /*
      const randomCardIdx = Math.floor(
        Math.random() * usersData[targetIdx].userCards.length
      );
      const targetCard = usersData[targetIdx].userCards[randomCardIdx];
      */
      usersData[userIdx].userCards.push(targetCard);
      usersData[userIdx].numberOfCards = usersData[userIdx].userCards.length;
      usersData[targetIdx].userCards.splice(randomCardIdx, 1);
      usersData[targetIdx].numberOfCards =
        usersData[targetIdx].userCards.length;

      this.setState({
        usersData,
        usingEffectCard: Card.backCard,
        cardSelectorId: -1,
      });
    });
    this.state.socket.on("new-common-3", (data) => {
      console.log("new-common-3", data);

      const { userId, roomId, cards, cardsIdx } = data;
      if (this.state.roomId !== roomId) return;

      const { usersData, discardPile, nextUserId, nextTurnLeft } = this.state;
      const userIdx = this.findUserIdx(userId);
      const userCard = usersData[userIdx].userCards;
      const usingCard = userCard[cardsIdx[0]];
      const newUserCard = [];
      userCard.forEach((card, idx) => {
        if (cardsIdx.indexOf(idx) === -1) newUserCard.push(card);
        else discardPile.push(card);
      });
      usersData[userIdx].userCards = newUserCard;
      usersData[userIdx].numberOfCards = usersData[userIdx].userCards.length;

      const userName = this.getUserNameByUserId(userId);
      this.addLogs(userName + " use 3 of " + usingCard);
      this.setState({
        usersData,
        isSelectingPlayerId: userId,
        cardUserId: userId,
        usingEffectCard: Card.common3,
        newNextUserId: nextUserId,
        newNextTurnLeft: nextTurnLeft,
      });
    });
    this.state.socket.on("receive-common-3", (data) => {
      console.log("receive-common-3", data);

      const { userId, roomId, targetId, selectCard } = data;
      const { usersData } = this.state;
      if (this.state.roomId !== roomId) return;

      const userIdx = this.findUserIdx(userId);
      const targetIdx = this.findUserIdx(targetId);

      const targetCardIdx = usersData[targetIdx].userCards.indexOf(selectCard);
      const userName = this.getUserNameByUserId(userId);
      this.addLogs(userName + " want " + selectCard);
      if (targetCardIdx === -1) return; // target doesnot have wanting card

      const targetCard = usersData[targetIdx].userCards[targetCardIdx];
      usersData[userIdx].userCards.push(targetCard);
      usersData[userIdx].numberOfCards = usersData[userIdx].userCards.length;
      usersData[targetIdx].userCards.splice(targetCardIdx, 1);
      usersData[targetIdx].numberOfCards =
        usersData[targetIdx].userCards.length;

      this.setState({
        usersData,
        usingEffectCard: Card.backCard,
        cardSelectorId: -1,
      });
    });
    this.state.socket.on("new-common-5", (data) => {
      console.log("new-common-5", data);

      const { userId, roomId, cards, cardsIdx } = data;
      if (this.state.roomId !== roomId) return;

      const { usersData, discardPile, nextUserId, nextTurnLeft } = this.state;

      const cardSelectorId = userId;
      const cardSelectorCards = [...discardPile];
      const showCardSelectorBackCard = false;

      const userIdx = this.findUserIdx(userId);
      const userCard = usersData[userIdx].userCards;
      const newUserCard = [];
      userCard.forEach((card, idx) => {
        if (cardsIdx.indexOf(idx) === -1) newUserCard.push(card);
        else discardPile.push(card);
      });
      usersData[userIdx].userCards = newUserCard;
      usersData[userIdx].numberOfCards = usersData[userIdx].userCards.length;

      const userName = this.getUserNameByUserId(userId);
      this.addLogs(userName + " use 5 different cards");
      this.setState({
        usersData,
        newCardSelectorId: cardSelectorId,
        cardSelectorCards,
        showCardSelectorBackCard,
        cardUserId: userId,
        usingEffectCard: Card.common5,
        newNextUserId: nextUserId,
        newNextTurnLeft: nextTurnLeft,
        canNope: true,
        isNoped: false,
      });
      this.newCountDown(timeForNope);
    });
    this.state.socket.on("receive-common-5", (data) => {
      console.log("receive-common-5", data);

      const { userId, roomId, selectCardIdx } = data;
      const { usersData, discardPile } = this.state;
      if (this.state.roomId !== roomId) return;
      const selectCard = discardPile[selectCardIdx];

      const userIdx = this.findUserIdx(userId);
      usersData[userIdx].userCards.push(selectCard);
      usersData[userIdx].numberOfCards = usersData[userIdx].userCards.length;
      discardPile.splice(selectCardIdx, 1);

      this.setState({
        usersData,
        discardPile,
        usingEffectCard: Card.backCard,
        cardSelectorId: -1,
      });
    });
    this.state.socket.on("new-exploding-puppy", (data) => {
      console.log("new-exploding-puppy", data);
      const { userId, roomId } = data;
      const { usersData } = this.state;
      if (this.state.roomId !== roomId) return;

      const userName = this.getUserNameByUserId(userId);
      this.addLogs(userName + " draw Exploding puppy");
      this.setState({ usersData, explodeId: userId });
    });
    this.state.socket.on("finish-exploding-puppy", (data) => {
      console.log("finish-exploding-puppy", data);

      const { userId, roomId, nextUserId, leftCardNumber } = data;
      if (this.state.roomId !== roomId) return;

      const userIdx = this.findUserIdx(userId);
      const { usersData, discardPile } = this.state;
      const defuseIdx = usersData[userIdx].userCards.indexOf(Card.defuse);
      if (defuseIdx === -1) return;
      usersData[userIdx].userCards.splice(defuseIdx, 1);
      usersData[userIdx].numberOfCards = usersData[userIdx].userCards.length;
      discardPile.push(Card.defuse);

      const userName = this.getUserNameByUserId(userId);
      this.addLogs(userName + " use Defuse");
      this.setState({
        explodeId: -1,
        hasDefuse: false,
        nextUserId,
        discardPile,
        leftCardNumber,
      });
    });
    this.state.socket.on("new-lose", (data) => {
      console.log("new-lose", data);

      const { userId, roomId, nextUserId } = data;
      const { usersData } = this.state;
      const userIdx = this.findUserIdx(userId);
      if (this.state.roomId !== roomId) return;
      if (usersData[userIdx].isDead) return;
      const userName = this.getUserNameByUserId(userId);
      this.addLogs(userName + " lose the game");
      usersData[userIdx].isDead = true;
      this.setState({
        explodeId: -1,
        hasDefuse: false,
        nextUserId,
        nextTurnLeft: 1,
        usersData,
      });
    });
    this.state.socket.on("new-effect", (data) => {
      console.log("new-effect", data);

      const { userId, roomId, card } = data;
      if (this.state.roomId !== roomId) return;
      this.setState({ usingEffectCard: Card.backCard, cardSelectorId: -1 });
      switch (card) {
        case Card.seeTheFuture:
          const { seeTheFutureCards } = data;
          this.setState({ seeTheFutureCards, seeTheFutureId: userId });
          break;
        case Card.favor:
          const { targetId, favorCardIdx } = data;
          const { usersData, timePerTurn } = this.state;
          const userIdx = this.findUserIdx(userId);
          const targetIdx = this.findUserIdx(targetId);
          const favorCard = usersData[targetIdx].userCards[favorCardIdx];
          usersData[userIdx].userCards.push(favorCard);
          usersData[userIdx].numberOfCards =
            usersData[userIdx].userCards.length;
          usersData[targetIdx].userCards.splice(favorCardIdx, 1);
          usersData[targetIdx].numberOfCards =
            usersData[targetIdx].userCards.length;
          this.setState({ usersData });
          this.newCountDown(timePerTurn);
          break;
        case Card.attack:
          if (data.attackCard.nextUserId !== this.state.nextUserId) {
            const nextUserName = this.getUserNameByUserId(
              data.attackCard.nextUserId
            );
            this.addLogs("Start " + nextUserName + " turn");
          }
          this.setState({
            nextTurnLeft: data.attackCard.nextTurnLeft,
            nextUserId: data.attackCard.nextUserId,
          });
          break;
        case Card.skip:
          if (data.skipCard.nextUserId !== this.state.nextUserId) {
            const nextUserName = this.getUserNameByUserId(
              data.skipCard.nextUserId
            );
            this.addLogs("Start " + nextUserName + " turn");
          }
          this.setState({
            nextTurnLeft: data.skipCard.nextTurnLeft,
            nextUserId: data.skipCard.nextUserId,
          });
          this.newCountDown(this.state.timePerTurn);
          break;
      }
    });
    this.state.socket.on("new-select", (data) => {
      console.log("new-select", data);

      const { userId, roomId, targetId } = data;
      if (this.state.roomId !== roomId) return;

      let cardSelectorId,
        cardSelectorCards,
        showCardSelectorBackCard,
        newTargetId = targetId;
      const { usingEffectCard } = this.state;
      switch (usingEffectCard) {
        case Card.favor:
          cardSelectorId = targetId;
          cardSelectorCards = this.getUserCard(targetId);
          showCardSelectorBackCard = false;
          newTargetId = userId;
          break;
        case Card.common2:
          cardSelectorId = userId;
          cardSelectorCards = this.getUserCard(targetId);
          showCardSelectorBackCard = true;
          break;
        case Card.common3:
          cardSelectorId = userId;
          cardSelectorCards = allSelectableCards;
          showCardSelectorBackCard = false;
          break;
      }
      const userName = this.getUserNameByUserId(userId);
      const targetUserName = this.getUserNameByUserId(targetId);
      this.addLogs(userName + " choose " + targetUserName);
      this.setState({
        newCardSelectorId: cardSelectorId,
        cardSelectorCards,
        showCardSelectorBackCard,
        targetId: newTargetId,
        canNope: true,
        isNoped: false,
      });
      this.newCountDown(timeForNope);
    });
    this.state.socket.on("new-nope", (data) => {
      console.log("new-nope", data);
      const { userId, roomId, card, cardIdx } = data;
      const { usersData, discardPile } = this.state;
      if (this.state.roomId !== roomId) return;

      const userIdx = this.findUserIdx(userId);
      if (usersData[userIdx].userCards[cardIdx] !== card) return;
      discardPile.push(card);
      usersData[userIdx].userCards.splice(cardIdx, 1);
      usersData[userIdx].numberOfCards = usersData[userIdx].userCards.length;

      const userName = this.getUserNameByUserId(userId);
      this.addLogs(userName + " use Nope");
      this.setState({ usersData, canNope: true, isNoped: !this.state.isNoped });
      this.newCountDown(timeForNope);
    });
    this.state.socket.on("no-new-nope", (data) => {
      console.log("no-new-nope", data);
      const {
        newNextUserId,
        newNextTurnLeft,
        cardUserId,
        userId,
        usingEffectCard,
        newCardSelectorId,
        isNoped,
        timePerTurn,
      } = this.state;
      if (usingEffectCard !== Card.favor) this.newCountDown(timePerTurn);
      this.setState({
        nextUserId: newNextUserId,
        nextTurnLeft: newNextTurnLeft,
        newNextUserId: -1,
        newNextTurnLeft: 0,
        cardUserId: -1,
        canNope: false,
        isNoped: false,
      });
      if (!isNoped) {
        switch (usingEffectCard) {
          case Card.favor:
            this.setState({
              cardSelectorId: newCardSelectorId,
              newCardSelectorId: -1,
            });
            break;
          case Card.common2:
            this.setState({
              cardSelectorId: newCardSelectorId,
              newCardSelectorId: -1,
            });
            break;
          case Card.common3:
            this.setState({
              cardSelectorId: newCardSelectorId,
              newCardSelectorId: -1,
            });
            break;
          case Card.common5:
            this.setState({
              cardSelectorId: newCardSelectorId,
              newCardSelectorId: -1,
            });
            break;
          default:
            if (cardUserId === userId) this.useEffect(userId, usingEffectCard);
        }
      } else if (usingEffectCard === Card.favor) {
        this.newCountDown(timePerTurn);
      }
    });
    this.state.socket.on("new-exit", (data) => {
      console.log("new-exit", data);

      if (data.roomId != this.state.roomId) return;
      const { userId, roomId, nextUserId, leftCardNumber } = data;
      const { usersData } = this.state;
      const userIdx = this.findUserIdx(userId);
      if (roomId != this.state.roomId) return;
      if (usersData[userIdx].isDead) return;
      const userName = this.getUserNameByUserId(userId);
      this.addLogs(
        userName + " exited from this room; Removed 1 exploding puppy"
      );
      usersData[userIdx].isDead = true;
      this.setState({ usersData, nextUserId, nextTurnLeft: 1, leftCardNumber });
    });
    this.state.socket.on("new-win", (data) => {
      console.log("new-win", data);
      const { result } = data;
      this.addLogs("Game end");
      this.setState({
        result: result.reverse().map((userId) => ({
          userId,
          userName: this.getUserNameByUserId(userId),
          profileImgUrl: this.state.usersData[this.findUserIdx(userId)]
            .profileImgUrl,
        })),
      });

      const { userProgress, userId } = this.state;
      this.updateUserProgress(userId, result, userProgress);
    });
  }

  // --------- end componentDidMount() ---------

  getPropsFromUserId = (userId) => {
    const userIdx = this.findUserIdx(userId);
    const data = {
      roomId: this.state.roomId,
      createdTime: this.state.createdTime,
      leftCardNumber: this.state.leftCardNumber,
      nextUserId: this.state.nextUserId,
      nextTurnLeft: this.state.nextTurnLeft,
      discardPile: this.state.discardPile,
      usersData: this.state.usersData,
      canNope: this.state.canNope,
      isNoped: this.state.isNoped,
      countDownTime: this.state.countDownTime,
      cardSelectorId: this.state.cardSelectorId,
      userId: this.state.userId,
      userProgress: this.state.userProgress,
    };
    if (this.state.usersData[userIdx]?.userCards && userIdx >= 0)
      data.userCards = this.state.usersData[userIdx].userCards[userIdx];
    return data;
  };

  getUserCard = (userId) => {
    const userIdx = this.findUserIdx(userId);
    if (this.state.usersData[userIdx]?.userCards && userIdx >= 0)
      return this.state.usersData[userIdx].userCards;
    return [];
  };

  findUserIdx = (userId) => {
    const { usersData } = this.state;
    let idx = -1;
    usersData.forEach((userData, curIdx) => {
      if (userData.userId === userId) idx = curIdx;
    });
    return idx;
  };

  createCustomRoom = (userId) => {
    const data = {
      userId, // Room creator's ID
    };
    this.state.socket.emit("create-custom-room", data);
  };

  joinCustomRoom = (userId) => {
    const userIdx = this.findUserIdx(userId);
    if (userIdx !== -1) return;
    if (this.state.leftCardNumber !== -1) return; // cant join after game started
    const data = {
      userId,
      roomId: this.state.roomId,
    };
    this.state.socket.emit("join-custom-room", data);
  };

  drawCard = (userId) => {
    const data = {
      userId,
      roomId: this.state.roomId,
    };
    if (
      userId !== this.state.nextUserId ||
      this.state.canNope ||
      this.state.cardSelectorId !== -1
    )
      return;
    this.state.socket.emit("draw-card", data);
  };

  startGame = () => {
    const data = {
      roomId: this.state.roomId,
    };
    this.state.socket.emit("start-game", data);
  };

  useCard = (userId, cardIdx) => {
    const userCards = this.getUserCard(userId);
    const card = userCards[cardIdx];
    const data = {
      userId,
      roomId: this.state.roomId,
      card,
      cardIdx,
    };
    if (card === Card.nope) {
      this.state.socket.emit("use-nope", data);
    } else this.state.socket.emit("use-card", data);
  };

  selectFavorCard = (userId, targetId, card) => {
    const data = {
      userId,
      roomId: this.state.roomId,
      targetId,
      card,
    };
    this.state.socket.emit("select-favor-card", data);
  };

  useCommon2 = (userId, cardsIdx) => {
    const { usersData, roomId } = this.state;
    const userIdx = this.findUserIdx(userId);
    const cards = cardsIdx.map(
      (cardIdx) => usersData[userIdx].userCards[cardIdx]
    );

    // two of a kind, can be any cards e.g. two of a common cat, two of skip
    if (cardsIdx.length !== 2) return;
    if (cards[0] !== cards[1]) return;

    const data = {
      userId,
      roomId,
      cards,
      cardsIdx,
    };
    this.state.socket.emit("use-common-2", data);
  };

  chooseTargetCard = (targetId) => {
    alert("chosse card from " + targetId);
    return 0; // todo:
  };

  selectCommon2 = (userId, targetId, targetCardIdx) => {
    const { usersData, roomId } = this.state;
    const targetCard = usersData[targetId].userCards[targetCardIdx];
    const data = {
      userId,
      roomId,
      targetId,
      targetCard,
      targetCardIdx,
    };
    this.state.socket.emit("select-common-2", data);
  };

  useCommon3 = (userId, cardsIdx) => {
    const { usersData, roomId } = this.state;

    const userIdx = this.findUserIdx(userId);
    const cards = cardsIdx.map(
      (cardIdx) => usersData[userIdx].userCards[cardIdx]
    );

    if (cardsIdx.length !== 3) return;
    if (cards[0] !== cards[1] || cards[0] !== cards[2]) return;

    const data = {
      userId,
      roomId,
      cards,
      cardsIdx,
    };
    this.state.socket.emit("use-common-3", data);
  };

  selectCommon3 = (userId, targetId, targetCardIdx) => {
    const { usersData, roomId } = this.state;
    const targetCard = usersData[targetId].userCards[targetCardIdx];
    const data = {
      userId,
      roomId,
      targetId,
      targetCardIdx,
    };
    this.state.socket.emit("select-common-3", data);
  };

  useCommon5 = (userId, cardsIdx) => {
    const { usersData, roomId } = this.state;
    const userIdx = this.findUserIdx(userId);
    const cards = cardsIdx.map(
      (cardIdx) => usersData[userIdx].userCards[cardIdx]
    );

    if (cardsIdx.length !== 5) return;
    cards.sort();
    for (let i = 0; i < 4; i++) {
      if (cards[i] === cards[i + 1]) return;
    }

    const data = {
      userId,
      roomId,
      cards,
      cardsIdx,
    };
    this.state.socket.emit("use-common-5", data);
  };

  selectCommon5 = (userId, selectCardIdx) => {
    const { discardPile } = this.state;
    const selectCard = discardPile[selectCardIdx];
    const data = {
      userId,
      roomId: this.state.roomId,
      selectCard,
      selectCardIdx,
    };
    this.state.socket.emit("select-common-5", data);
  };

  drawExplodingPuppy = (userId) => {
    if (userId !== this.state.userId) return;
    const data = {
      userId,
      roomId: this.state.roomId,
    };
    this.state.socket.emit("draw-exploding-puppy", data);
  };

  insertExplodingPuppy = (userId, idx) => {
    const data = {
      userId,
      roomId: this.state.roomId,
      idx,
    };
    this.state.socket.emit("insert-exploding-puppy", data);
  };

  gameLose = (userId) => {
    const data = {
      userId,
      roomId: this.state.roomId,
    };
    this.state.socket.emit("game-lose", data);
  };

  handleUseCard = (userId, cardsIdx) => {
    switch (cardsIdx.length) {
      case 1:
        this.useCard(userId, cardsIdx[0]);
        break;
      case 2:
        this.useCommon2(userId, cardsIdx);
        break;
      case 3:
        this.useCommon3(userId, cardsIdx);
        break;
      case 5:
        this.useCommon5(userId, cardsIdx);
        break;
      default:
        return;
    }
  };

  sendMessageRoom = (fromUserId, fromRoomId, fromUsername, message) => {
    let data = {
      fromUserId: fromUserId,
      fromRoomId: fromRoomId,
      fromUsername: fromUsername,
      message: message,
    };
    this.state.socket.emit("message-send-room", data);
  };

  useEffect = (userId, card) => {
    const data = {
      userId,
      roomId: this.state.roomId,
      card,
    };
    this.newCountDown(this.state.timePerTurn);
    this.state.socket.emit("use-effect", data);
  };

  closeSeeTheFutureDialog = () => {
    this.setState({ seeTheFutureId: -1, seeTheFutreCard: [] });
  };

  selectPlayer = (userId, targetId) => {
    const { roomId, usingEffectCard } = this.state;
    const data = {
      userId,
      roomId: roomId,
      targetId,
      card: usingEffectCard,
    };
    this.setState({ isSelectingPlayerId: -1 });
    this.state.socket.emit("select-player", data);
  };

  setSelectedCardIdx = (userId, selectedCardIdx) => {
    const { usingEffectCard, targetId, roomId } = this.state;
    const data = {
      userId,
      roomId,
      card: usingEffectCard,
      targetId,
    };
    this.setState({ cardSelectorId: -1, usingEffectCard: Card.backCard });
    switch (usingEffectCard) {
      case Card.favor:
        data.favorCardIdx = selectedCardIdx;
        data.userId = targetId;
        data.targetId = userId;
        this.state.socket.emit("use-effect", data);
        break;
      case Card.common2:
        data.targetCardIdx = selectedCardIdx;
        this.state.socket.emit("select-common-2", data);
        break;
      case Card.common3:
        data.selectCard = allSelectableCards[selectedCardIdx];
        this.state.socket.emit("select-common-3", data);
        break;
      case Card.common5:
        data.selectCardIdx = selectedCardIdx;
        this.state.socket.emit("select-common-5", data);
        break;
    }
  };

  hasDefuse = (userId) => {
    const userIdx = this.findUserIdx(userId);
    const { usersData } = this.state;
    if (userIdx === -1) return false;
    if (!usersData[userIdx].userCards) return false;
    const defuseIdx = usersData[userIdx].userCards.indexOf(Card.defuse);
    if (defuseIdx !== -1) return true;
    return false;
  };

  handleUseNope = (userId) => {
    // now use only for test (click on use nope button below)
    const data = {
      userId,
      roomId: this.state.roomId,
    };
    this.state.socket.emit("use-nope", data);
  };

  newCountDown = (second) => {
    this.setState({ countDownTime: Date.now() + second * 1000 });
  };

  handleCompleteNopeCountdown = () => {
    const { roomId, cardUserId, userId } = this.state;
    const data = {
      roomId: roomId,
    };
    if (cardUserId === userId) this.state.socket.emit("no-one-nope", data);
  };

  addLogs = (log) => {
    const { logs } = this.state;
    logs.push(log);
    this.setState(logs);
  };

  getUserNameByUserId = (userId) => {
    const { usersData } = this.state;
    const userIdx = this.findUserIdx(userId);
    if (userIdx !== -1) return usersData[userIdx].userName;
    return userId;
  };

  handleExit = (userId) => {
    const data = {
      userId,
      roomId: this.state.roomId,
    };
    this.state.socket.emit("player-exit", data);

    const { mode, userProgress } = this.state;
    if (mode === GameMode.custom) return;
    const { rank, rankGameMatches, rankGameWinMatches } = userProgress;
    const newRank = Math.max(1, rank - 2);
    const newUserProgress = {
      ...userProgress,
      userRank: newRank,
      rankGameMatches: rankGameMatches + 1,
    };
    sessionStorage.setItem("userRank", newRank);
    sessionStorage.setItem(
      "winRate",
      (rankGameWinMatches / (rankGameMatches + 1)) * 100
    );
    axios.patch(`${ENDPOINT}/users/progress/${userId}`, newUserProgress);
  };

  getUser = (userId) => {
    return new Promise((resolve, reject) => {
      try {
        axios
          .get(`${ENDPOINT}/users/${userId}`)
          .then((res) => {
            resolve(res.data);
          })
          .catch((err) => {
            console.error(err);
          });
      } catch (err) {}
    });
  };

  setUserProgress = async () => {
    const resp = await this.getUser(this.state.userId);
    const userProgress = {
      exp: resp.userExp,
      rank: resp.userRank,
      level: resp.userLevel,
      rankGameMatches: resp.rankGameMatches,
      rankGameWinMatches: resp.rankGameWinMatches,
    };
    this.setState({ userProgress });
  };

  getMaxExp = (level) => 100 + level * level * 5;

  updateRank = (currentUserId, result) => {
    const { mode, userProgress } = this.state;
    if (mode === GameMode.custom) return userProgress.rank;
    let myRank = result.findIndex((e) => e === currentUserId);
    //first = 0, second 1
    return Math.max(1, (myRank - 2) * -1 + userProgress.rank);
  };

  updateUserProgress = (userId, result, userProgress) => {
    const { mode } = this.state;
    const plusExp = mode === GameMode.rank ? 500 : 250;
    let level = userProgress.level;
    let maxExp = this.getMaxExp(level);
    let exp = userProgress.exp + plusExp;
    const { rankGameMatches, rankGameWinMatches } = userProgress;
    let newRank = this.updateRank(userId, result);

    while (exp >= maxExp) {
      exp -= maxExp;
      level += 1;
      maxExp = this.getMaxExp(level);
    }

    const newRankGameMatches =
      mode === GameMode.rank ? rankGameMatches + 1 : rankGameMatches;
    const newRankGameWinMatches =
      mode === GameMode.rank
        ? result[0] === userId
          ? rankGameWinMatches + 1
          : rankGameWinMatches
        : rankGameWinMatches;

    const newUserProgress = {
      userExp: exp,
      userLevel: level,
      userRank: newRank,
      rankGameMatches: newRankGameMatches,
      rankGameWinMatches: newRankGameWinMatches,
    };
    sessionStorage.setItem("userExp", exp);
    sessionStorage.setItem("userLevel", level);
    sessionStorage.setItem("userRank", newRank);
    sessionStorage.setItem(
      "winRate",
      (newRankGameWinMatches / newRankGameMatches) * 100
    );
    axios.patch(`${ENDPOINT}/users/progress/${userId}`, newUserProgress);
  };

  render() {
    // const classes = useStyles();
    const roomId = "100001";

    const {
      socket,
      explodeId,
      seeTheFutureId,
      seeTheFutureCards,
      discardPile,
      isSelectingPlayerId,
      cardSelectorId,
      cardSelectorCards,
      usersData,
      leftCardNumber,
      nextUserId,
      showCardSelectorBackCard,
      canNope,
      countDownTime,
      logs,
      result,
      userProgress,
      timePerTurn,
      mode,
      nextTurnLeft,
    } = this.state;
    const userId = window.sessionStorage.getItem("userId"); // todo:
    const userIdx = this.findUserIdx(userId);
    let userCards = [];
    if (
      this.state.usersData.length > userIdx &&
      userIdx !== -1 &&
      this.state.usersData[userIdx].userCards
    ) {
      userCards = this.state.usersData[userIdx].userCards;
    }
    return (
      <div
        style={{
          height: "100vh",
          width: "100vw",
          maxWidth: "100%",
          background: Palette.yellow100,
        }}
      >
        <Chat
          roomId={this.state.roomId}
          socket={this.state.socket}
          sendMessageRoom={this.sendMessageRoom}
          usersData={usersData}
        />
        <Game
          socket={socket}
          createCustomRoom={this.createCustomRoom}
          joinCustomRoom={this.joinCustomRoom}
          startGame={this.startGame}
          getPropsFromUserId={this.getPropsFromUserId}
          userCards={userCards}
          drawCard={this.drawCard}
          hasDefuse={this.hasDefuse}
          explodeId={explodeId}
          insertExplodingPuppy={this.insertExplodingPuppy}
          handleUseCard={this.handleUseCard}
          seeTheFutureId={seeTheFutureId}
          seeTheFutureCards={seeTheFutureCards}
          closeSeeTheFutureDialog={this.closeSeeTheFutureDialog}
          gameLose={this.gameLose}
          topDiscardPile={discardPile[discardPile.length - 1]}
          isSelectingPlayerId={isSelectingPlayerId}
          selectPlayer={this.selectPlayer}
          cardSelectorId={cardSelectorId}
          setSelectedCardIdx={this.setSelectedCardIdx}
          cardSelectorCards={cardSelectorCards}
          usersData={usersData}
          numberOfDeckCards={leftCardNumber}
          nextUserId={nextUserId}
          showCardSelectorBackCard={showCardSelectorBackCard}
          canNope={canNope}
          handleUseNope={this.handleUseNope}
          countDownTime={countDownTime}
          newCountDown={this.newCountDown}
          handleCompleteNopeCountdown={this.handleCompleteNopeCountdown}
          logs={logs}
          result={result}
          handleExit={this.handleExit}
          userProgress={userProgress}
          timePerTurn={timePerTurn}
          mode={mode}
          nextTurnLeft={nextTurnLeft}
        />
      </div>
    );
  }
}

export default Gameplay;
