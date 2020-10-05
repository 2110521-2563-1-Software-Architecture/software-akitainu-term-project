import React from "react";
import socketIOClient from "socket.io-client";
import { Card } from "./type";
const ENDPOINT = "localhost:10001";

class CustomRoom extends React.Component {
  constructor(props) {
    super();
    this.state = {
      socket: socketIOClient(ENDPOINT),
      roomId: -1, // room Id
      creatorId: props.userId, // creator user Id
      usersId: [props.userId], // all user in the room user ID
      usersName: [props.userId],
      createdTime: new Date(),
      leftCardNumber: -1, // left card number in the card pile
      userscards: [], // all user cards which same order as usersId
      nextUserId: -1,
      nextTurnLeft: 1,
      discardPile: [], // index 0 is the bottom
    };
  }

  componentDidMount() {
    this.state.socket.on("new-custom-room", (data) => {
      console.log(data);

      this.setState({
        roomId: data.roomId,
      });
    });
    this.state.socket.on("new-join-custom-other", (data) => {
      console.log(data);

      const { usersId, usersName } = this.state;
      usersId.push(data.userId);
      usersName.push(data.userName);
      this.setState({
        usersId,
        usersName,
      });
    });
    this.state.socket.on("new-join-custom-joiner ", (data) => {
      console.log(data);

      this.setState({
        usersId: data.usersId,
        usersName: data.usersName,
      });
    });
    this.state.socket.on("new-card", (data) => {
      console.log(data);

      const {
        userId,
        roomId,
        card,
        leftCardNumber,
        nextUserId,
        nextTurnLeft,
      } = data;
      if (this.state.roomId !== roomId) return;

      const idx = this.findUserIdx(userId);
      const { userscards } = this.state;
      userscards[idx].push(card);

      this.setState({
        userscards,
        leftCardNumber,
        nextUserId,
        nextTurnLeft,
      });
    });
    this.state.socket.on("new-game", (data) => {
      console.log(data);

      const { roomId, leftCardNumber, usersId, userscards } = data;
      if (this.state.roomId !== roomId) return;

      this.setState({
        leftCardNumber,
        usersId,
        userscards,
      });
    });
    this.state.socket.on("new-card-use", (data) => {
      console.log(data);

      const { userId, roomId, card, cardIdx, nextUserId, nextTurnLeft } = data;
      if (this.state.roomId !== roomId) return;

      const idx = this.findUserIdx(userId);
      const { userscards, discardPile } = this.state;
      if (userscards[idx][cardIdx] !== card) return;
      discardPile.push(card);
      userscards[idx].splice(cardIdx, 1);

      this.setState({
        userscards,
        nextUserId,
        nextTurnLeft,
      });
      switch (card) {
        case Card.favor:
          const targetId = this.chooseTarget();
          this.useFavor(userId, roomId, targetId);
          break;
        case Card.seeTheFuture:
          this.useSeeTheFuture(userId, roomId);
          break;
      }
    });
    this.state.socket.on("new-favor", (data) => {
      console.log(data);

      const { userId, roomId, targetId } = data;
      if (this.state.roomId !== roomId) return;
      // todo: check if user use this card?

      const cardIdx = this.chooseFavorCard(targetId);
      const targetIdx = this.findUserIdx(targetId);
      const { userscards, discardPile } = this.state;
      const card = userscards[targetIdx][cardIdx];
      discardPile.push(Card.favor);
      this.selectFavorCard(userId, roomId, targetId, card);
    });
    this.state.socket.on("receive-favor-card", (data) => {
      console.log(data);

      const { userId, roomId, card } = data;
      if (this.state.roomId !== roomId) return;

      const userIdx = this.findUserIdx(userId);
      const { userscards } = this.state;
      userscards[userIdx].push(card);
      this.setState({ userscards });
    });
    this.state.socket.on("new-see-the-future", (data) => {
      console.log(data);

      const { userId, roomId, cards } = data;
      if (this.state.roomId !== roomId) return;
      // todo: check if user use this card?

      this.showSeeTheFuture(cards);
    });
    this.state.socket.on("new-common-2", (data) => {
      console.log(data);

      const { userId, roomId, cards, cardsIdx } = data;
      if (this.state.roomId !== roomId) return;
      // todo: check if user use this card?

      const { userscards, discardPile } = this.state;
      const userIdx = this.findUserIdx(userId);
      const userCard = userscards[userIdx];
      const newUserCard = [];
      userCard.forEach((card, idx) => {
        if (cardsIdx.indexOf(idx) === -1) newUserCard.push(card);
        else discardPile.push(card);
      });
      userscards[userIdx] = newUserCard;

      const targetId = this.chooseTarget(cards);
      const targetCardIdx = this.chooseTargetCard(targetId);

      this.setState({ userscards });
      this.selectCommon2(userId, roomId, targetId, targetCardIdx);
    });
    this.state.socket.on("receive-common-2", (data) => {
      console.log(data);

      const { userId, roomId, targetId, targetCard, targetCardIdx } = data;
      const { userscards } = this.state;
      if (this.state.roomId !== roomId) return;
      if (userscards[targetId][targetCardIdx] !== targetCard) return;
      // todo: check if user use this card?

      const userIdx = this.findUserIdx(userId);
      userscards[userIdx].push(targetCard);
      userscards[targetId].splice(targetCardIdx, 1);

      this.setState({ userscards });
    });
    this.state.socket.on("new-common-3", (data) => {
      console.log(data);

      const { userId, roomId, cards, cardsIdx } = data;
      if (this.state.roomId !== roomId) return;
      // todo: check if user use this card?

      const { userscards, discardPile } = this.state;
      const userIdx = this.findUserIdx(userId);
      const userCard = userscards[userIdx];
      const newUserCard = [];
      userCard.forEach((card, idx) => {
        if (cardsIdx.indexOf(idx) === -1) newUserCard.push(card);
        else discardPile.push(card);
      });
      userscards[userIdx] = newUserCard;

      const targetId = this.chooseTarget(cards);
      const targetCardIdx = this.chooseAnyCard();

      this.setState({ userscards });
      this.selectCommon3(userId, roomId, targetId, targetCardIdx);
    });
    this.state.socket.on("receive-common-3", (data) => {
      console.log(data);

      const { userId, roomId, targetId, targetCardIdx } = data;
      const { userscards } = this.state;
      if (this.state.roomId !== roomId) return;
      if (targetCardIdx === -1) return;
      // todo: check if user use this card?

      const userIdx = this.findUserIdx(userId);
      const targetIdx = this.findUserIdx(targetId);
      const targetCard = userscards[targetIdx][targetCardIdx];
      userscards[userIdx].push(targetCard);
      userscards[targetIdx].splice(targetCardIdx, 1);

      this.setState({ userscards });
    });
    this.state.socket.on("new-common-5", (data) => {
      console.log(data);

      const { userId, roomId, cards, cardsIdx } = data;
      if (this.state.roomId !== roomId) return;
      // todo: check if user use this card?

      const { userscards, discardPile } = this.state;
      const userIdx = this.findUserIdx(userId);
      const userCard = userscards[userIdx];
      const newUserCard = [];
      userCard.forEach((card, idx) => {
        if (cardsIdx.indexOf(idx) === -1) newUserCard.push(card);
        discardPile.push(card);
      });
      userscards[userIdx] = newUserCard;

      const selectCardIdx = this.chooseAnyCardFromDiscardPile();

      this.setState({ userscards });
      this.selectCommon5(userId, roomId, selectCardIdx);
    });
    this.state.socket.on("receive-common-5", (data) => {
      console.log(data);

      const { userId, roomId, selectCard, selectCardIdx } = data;
      const { userscards, discardPile } = this.state;
      if (this.state.roomId !== roomId) return;
      if (discardPile[selectCardIdx] !== selectCard) return;
      // todo: check if user use this card?

      const userIdx = this.findUserIdx(userId);
      userscards[userIdx].push(selectCard);
      discardPile.splice(selectCardIdx, 1);

      this.setState({ userscards, discardPile });
    });
  }

  getPropsFromUserId = (userId) => {
      const userIdx = this.findUserIdx(userId);
      const data = {
        creatorId: this.state.creatorId,
        usersId: this.state.usersId,
        usersName: this.state.usersName,
        createdTime: this.state.createdTime,
        leftCardNumber: this.state.leftCardNumber,
        nextUserId: this.state.nextUserId,
        nextTurnLeft: this.state.nextTurnLeft,
        discardPile: this.state.discardPile,
        userCards: this.state.userscards[userIdx],
      }
      return data;
  }

  findUserIdx = (userId) => {
    const { usersId } = this.state;
    return usersId.indexOf(userId);
  };

  createCustomRoom = (userId) => {
    const data = {
      userId, // Room creator's ID
    };
    this.state.socket.emit("create-custom-room", data);
  };

  joinCustomRoom = (roomId, userId) => {
    const data = {
      roomId,
      userId,
    };
    this.state.socket.emit("join-custom-room", data);
  };

  drawCard = (userId, roomId) => {
    const data = {
      userId,
      roomId,
    };
    this.state.socket.emit("draw-card", data);
  };

  startGame = (roomId) => {
    const data = {
      roomId,
    };
    this.state.socket.emit("start-game", data);
  };

  useCard = (userId, roomId, cardIdx) => {
    const { userscards } = this.state;
    const card = userscards[userId][cardIdx];
    const data = {
      userId,
      roomId,
      card,
      cardIdx,
    };
    this.state.socket.emit("use-card", data);
  };

  chooseTarget = (targetId) => {
    alert(targetId + "Pls chosse target");
    return 2; // todo :
  };

  useFavor = (userId, roomId, targetId) => {
    const data = {
      userId,
      roomId,
      targetId,
    };
    this.state.socket.emit("use-favor", data);
  };

  chooseFavorCard = () => {
    alert("Choose Favor Card");
    return 0; // todo:
  };

  selectFavorCard = (userId, roomId, targetId, card) => {
    const data = {
      userId,
      roomId,
      card,
    };
    this.state.socket.emit("select-favor-card", data);
  };

  useSeeTheFuture = (userId, roomId) => {
    const data = {
      userId,
      roomId,
    };
    this.state.socket.emit("use-see-the-future", data);
  };

  showSeeTheFuture = (cards) => {
    console.log(cards); // todo :
  };

  useCommon2 = (userId, roomId, cardsIdx) => {
    const { userscards } = this.state;
    const cards = cardsIdx.map((cardIdx) => userscards[userId][cardIdx]);

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

  selectCommon2 = (userId, roomId, targetId, targetCardIdx) => {
    const { userscards } = this.state;
    const targetCard = userscards[targetId][targetCardIdx];
    const data = {
      userId,
      roomId,
      targetId,
      targetCard,
      targetCardIdx,
    };
    this.state.socket.emit("select-common-2", data);
  };

  useCommon3 = (userId, roomId, cardsIdx) => {
    const { userscards } = this.state;
    const cards = cardsIdx.map((cardIdx) => userscards[userId][cardIdx]);

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

  chooseAnyCard = (targetId) => {
    alert("chosse any card from");
    return Card.defuse; // todo:
  };

  selectCommon3 = (userId, roomId, targetId, targetCardIdx) => {
    const { userscards } = this.state;
    const targetCard = userscards[targetId][targetCardIdx];
    const data = {
      userId,
      roomId,
      targetId,
      targetCard,
      targetCardIdx,
    };
    this.state.socket.emit("select-common-3", data);
  };

  useCommon5 = (userId, roomId, cardsIdx) => {
    const { userscards } = this.state;
    const cards = cardsIdx.map((cardIdx) => userscards[userId][cardIdx]);

    if (cardsIdx.length !== 5) return;
    const commonCards = [
      Card.common1,
      Card.common2,
      Card.common3,
      Card.common4,
      Card.Common5,
    ];
    cards.sort();
    for (let i = 0; i < 5; i++) {
      if (cards[i] !== commonCards[i]) return;
    }

    const data = {
      userId,
      roomId,
      cards,
      cardsIdx,
    };
    this.state.socket.emit("use-common-5", data);
  };

  chooseAnyCardFromDiscardPile = () => {
    alert("chosse any card from");
    return 0; // todo:
  };

  selectCommon5 = (userId, roomId, selectCardIdx) => {
    const { discardPile } = this.state;
    const selectCard = discardPile[selectCardIdx];
    const data = {
      userId,
      roomId,
      selectCard,
      selectCardIdx,
    };
    this.state.socket.emit("select-common-5", data);
  };

  render() {
    const exampleCard = Card.common1;
    return (
      <div>
        <button onClick={() => this.createCustomRoom(1)}>
          createCustomRoom
        </button>
        <button onClick={() => this.joinCustomRoom(1, 1)}>
          joinCustomRoom
        </button>
        <button onClick={() => this.drawCard(1, 1)}>drawCard</button>
        <button onClick={() => this.startGame(1)}>startGame</button>
        <button onClick={() => this.useCard(1, 1, exampleCard)}>useCard</button>
      </div>
    );
  }
}

export default CustomRoom;
