import React from "react";
import { makeStyles } from "@material-ui/core";
import { useParams, useHistory } from "react-router-dom";
import Chat from "./Chat";
import Game from "./Game";
import NavBar from "../../components/NavBar";
import { Palette } from "components";
import { Card } from "../../components/type";

const classNames = {
  root: {
    height: "100vh",
    width: "100vw",
    maxWidth: "100%",
    background: Palette.yellow100,
  },
};

class Gameplay extends React.Component {
  constructor(props) {
    super();
    this.state = {
      socket: props.socket,
      roomId: -1, // room Id
      usersData: [], // {userId, userName, userCards, isDead}
      createdTime: new Date(),
      leftCardNumber: -1, // left card number in the card pile
      nextUserId: -1,
      nextTurnLeft: 1,
      discardPile: [], // index 0 is the bottom,
      isExplode: 0,
      hasDefuse: 0,
      showSeeTheFutureDialog: 0,
      seeTheFutureCards: [],
      isSelectingPlayer: 0,
      showCardSelectorDialog: 0,
    };
  }

  componentDidMount() {
    this.state.socket.on("new-custom-room", (data) => {
      console.log("new-custom-room", data);

      const { userId, roomId } = data;
      const usersData = [
        {
          userId,
          userName: '', // todo:
          usersCard: [],
          isDead: 0,
        }
      ];

      this.setState({
        roomId,
        usersData,
        // todo: username
      });
    });
    this.state.socket.on("new-join-custom-other", (data) => {
      console.log("new-join-custom-other", data);
      if (!data) return;

      const { userId, userName, roomId } = data;
      if (this.findUserIdx(userId) !== -1) return;
      const { usersData } = this.state;
      const newUserData = {
        userId,
        userName,
        userCards: [],
        isDead: 0,
      }
      usersData.push(newUserData);
      this.setState({
        usersData,
        roomId,
      });
    });
    this.state.socket.on("new-join-custom-joiner", (data) => {
      console.log("new-join-custom-joiner", data);
      if (!data) return;
      const usersData = [];
      data.usersId.forEach((userId, idx) => {
        const newUserData = {
          userId,
          userName: data.usersName[idx],
          usersCard: [],
          isDead: 0,
        }
        usersData.push(newUserData);
      });

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
      if(card === Card.explodingPuppy) {
        this.drawExplodingPuppy(userId, roomId);
        this.setState({
          leftCardNumber,
          nextUserId,
          nextTurnLeft,
        })
        return;
      }

      const userIdx = this.findUserIdx(userId);
      const { usersData } = this.state;
      usersData[userIdx].userCards.push(card);

      this.setState({
        usersData,
        leftCardNumber,
        nextUserId,
        nextTurnLeft,
      });
    });
    this.state.socket.on("new-game", (data) => {
      console.log("new-game", data);

      const {
        roomId,
        leftCardNumber,
        usersId,
        usersCard,
        nextUserId,
        nextTurnLeft,
      } = data;
      if (this.state.roomId !== roomId) return;
      
      const usersData = [];
      usersId.forEach((userId, idx) => {
        const newUserData = {
          userId,
          userName: '', // todo:
          userCards : usersCard[idx],
          isDead: 0,
        }
        usersData.push(newUserData);
      });

      this.setState({
        leftCardNumber,
        usersData,
        nextUserId,
        nextTurnLeft,
      });
    });
    this.state.socket.on("new-card-use", (data) => {
      console.log(data);

      const { userId, roomId, card, cardIdx, nextUserId, nextTurnLeft } = data;
      if (this.state.roomId !== roomId) return;

      const userIdx = this.findUserIdx(userId);
      const { usersData, discardPile } = this.state;
      if (usersData[userIdx].userCards[cardIdx] !== card) return;
      discardPile.push(card);
      usersData[userIdx].userCards.splice(cardIdx, 1);

      this.setState({
        usersData,
        nextUserId,
        nextTurnLeft,
      });
      switch (card) {
        case Card.favor:
          this.setState({isSelectingPlayer:1});
          break;
        default:
          this.useEffect(userId, card);
      };
    });
    this.state.socket.on("new-favor", (data) => {
      console.log(data);

      const { userId, roomId, targetId } = data;
      if (this.state.roomId !== roomId) return;
      // todo: check if user use this card?

      const cardIdx = this.chooseFavorCard(targetId);
      const targetIdx = this.findUserIdx(targetId);
      const { usersData, discardPile } = this.state;
      const card = usersData[targetIdx].userCards[cardIdx];
      discardPile.push(Card.favor);
      this.selectFavorCard(userId, roomId, targetId, card);
    });
    this.state.socket.on("receive-favor-card", (data) => {
      console.log(data);

      const { userId, roomId, card } = data;
      if (this.state.roomId !== roomId) return;

      const userIdx = this.findUserIdx(userId);
      const { usersData } = this.state;
      usersData[userIdx].userCards.push(card);
      this.setState({ usersData });
    });
    this.state.socket.on("new-see-the-future", (data) => {
      console.log(data);

      const { userId, roomId, cards } = data;
      if (this.state.roomId !== roomId) return;
      // todo: check if user use this card?

      this.setState({showSeeTheFutureDialog: 1, seeTheFutreCard: cards});
    });
    this.state.socket.on("new-common-2", (data) => {
      console.log(data);

      const { userId, roomId, cards, cardsIdx } = data;
      if (this.state.roomId !== roomId) return;
      // todo: check if user use this card?

      const { usersData, discardPile } = this.state;
      const userIdx = this.findUserIdx(userId);
      const userCard = usersData[userIdx].userCards;
      const newUserCard = [];
      userCard.forEach((card, idx) => {
        if (cardsIdx.indexOf(idx) === -1) newUserCard.push(card);
        else discardPile.push(card);
      });
      usersData[userIdx].userCards = newUserCard;

      const targetId = this.chooseTarget(cards);
      const targetCardIdx = this.chooseTargetCard(targetId);

      this.setState({ usersData });
      this.selectCommon2(userId, roomId, targetId, targetCardIdx);
    });
    this.state.socket.on("receive-common-2", (data) => {
      console.log(data);

      const { userId, roomId, targetId, targetCard, targetCardIdx } = data;
      const { usersData } = this.state;
      if (this.state.roomId !== roomId) return;
      if (usersData[targetId].userCards[targetCardIdx] !== targetCard) return;
      // todo: check if user use this card?

      const userIdx = this.findUserIdx(userId);
      usersData[userIdx].userCards.push(targetCard);
      usersData[targetId].userCards.splice(targetCardIdx, 1);

      this.setState({ usersData });
    });
    this.state.socket.on("new-common-3", (data) => {
      console.log(data);

      const { userId, roomId, cards, cardsIdx } = data;
      if (this.state.roomId !== roomId) return;
      // todo: check if user use this card?

      const { usersData, discardPile } = this.state;
      const userIdx = this.findUserIdx(userId);
      const userCard = usersData[userIdx].userCards;
      const newUserCard = [];
      userCard.forEach((card, idx) => {
        if (cardsIdx.indexOf(idx) === -1) newUserCard.push(card);
        else discardPile.push(card);
      });
      usersData[userIdx].userCards = newUserCard;

      const targetId = this.chooseTarget(cards);
      const targetCardIdx = this.chooseAnyCard();

      this.setState({ usersData });
      this.selectCommon3(userId, roomId, targetId, targetCardIdx);
    });
    this.state.socket.on("receive-common-3", (data) => {
      console.log(data);

      const { userId, roomId, targetId, targetCardIdx } = data;
      const { usersData } = this.state;
      if (this.state.roomId !== roomId) return;
      if (targetCardIdx === -1) return;
      // todo: check if user use this card?

      const userIdx = this.findUserIdx(userId);
      const targetIdx = this.findUserIdx(targetId);
      const targetCard = usersData[targetIdx].userCards[targetCardIdx];
      usersData[userIdx].userCards.push(targetCard);
      usersData[targetIdx].userCards.splice(targetCardIdx, 1);

      this.setState({ usersData });
    });
    this.state.socket.on("new-common-5", (data) => {
      console.log(data);

      const { userId, roomId, cards, cardsIdx } = data;
      if (this.state.roomId !== roomId) return;
      // todo: check if user use this card?

      const { usersData, discardPile } = this.state;
      const userIdx = this.findUserIdx(userId);
      const userCard = usersData[userIdx].userCards;
      const newUserCard = [];
      userCard.forEach((card, idx) => {
        if (cardsIdx.indexOf(idx) === -1) newUserCard.push(card);
        discardPile.push(card);
      });
      usersData[userIdx].userCards = newUserCard;

      const selectCardIdx = this.chooseAnyCardFromDiscardPile();

      this.setState({ usersData });
      this.selectCommon5(userId, roomId, selectCardIdx);
    });
    this.state.socket.on("receive-common-5", (data) => {
      console.log(data);

      const { userId, roomId, selectCard, selectCardIdx } = data;
      const { usersData, discardPile } = this.state;
      if (this.state.roomId !== roomId) return;
      if (discardPile[selectCardIdx] !== selectCard) return;
      // todo: check if user use this card?

      const userIdx = this.findUserIdx(userId);
      usersData[userIdx].userCards.push(selectCard);
      discardPile.splice(selectCardIdx, 1);

      this.setState({ usersData, discardPile });
    });
    this.state.socket.on("new-exploding-puppy", (data) => {
      console.log("new-exploding-puppy", data);

      const { userId, roomId } = data;
      const { usersData } = this.state;
      if (this.state.roomId !== roomId) return;
      const userIdx = this.findUserIdx(userId);
      const defuseIdx = usersData[userIdx].userCards.indexOf(Card.defuse);
      if(defuseIdx !== -1) {
        usersData[userIdx].userCards.splice(defuseIdx,1); 
      }
      this.setState({usersData,isExplode: 1, hasDefuse: defuseIdx!==-1});
    });
    this.state.socket.on("finish-exploding-puppy", (data) => {
      console.log("finish-exploding-puppy", data);

      const { userId, roomId } = data;
      if (this.state.roomId !== roomId) return;
      this.setState({isExplode: 0, hasDefuse: 0});
    });
    this.state.socket.on("new-lose", (data) => {
      console.log("new-lose", data);

      const { userId, roomId } = data;
      if (this.state.roomId !== roomId) return;
      this.setState({isExplode: 0, hasDefuse: 0});
    });
    this.state.socket.on("new-effect", (data) => {
      console.log("new-effect", data);

      const { userId, roomId, card} = data;
      if (this.state.roomId !== roomId) return;
      
      switch (card) {
        case Card.seeTheFuture:
          const { seeTheFutureCards } = data;
          this.setState({seeTheFutureCards, showSeeTheFutureDialog: 1})
          break;
      };
    });
    this.state.socket.on("new-select", (data) => {
      console.log("new-select", data);

      const { userId, roomId, targetId} = data;
      if (this.state.roomId !== roomId) return;

      this.setState({showCardSelectorDialog:1});
    });
    this.state.socket.on("message-get-room", (data) => {
      console.log("message-get-room", data);
  
    });
    this.state.socket.emit("message-send-room",{fromRoomId:123});
    
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
      if(userData.userId === userId) idx = curIdx;
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
    const data = {
      userId,
      roomId : this.state.roomId,
    };
    this.state.socket.emit("join-custom-room", data);
  };

  drawCard = (userId) => {
    const data = {
      userId,
      roomId : this.state.roomId,
    };
    if(userId !== this.state.nextUserId) return;
    this.state.socket.emit("draw-card", data);
  };

  startGame = () => {
    const data = {
      roomId : this.state.roomId,
    };
    this.state.socket.emit("start-game", data);
  };

  useCard = (userId, cardIdx) => {
    const userCards = this.getUserCard(userId);
    const card = userCards[cardIdx];
    const data = {
      userId,
      roomId : this.state.roomId,
      card,
      cardIdx,
    };
    this.state.socket.emit("use-card", data);
  };

  chooseTarget = (targetId) => {
    alert(targetId + "Pls chosse target");
    return 2; // todo :
  };

  useFavor = (userId,targetId) => {
    const data = {
      userId,
      roomId: this.state.roomId,
      targetId,
    };
    this.state.socket.emit("use-favor", data);
  };

  chooseFavorCard = () => {
    alert("Choose Favor Card");
    return 0; // todo:
  };

  selectFavorCard = (userId,targetId, card) => {
    const data = {
      userId,
      roomId: this.state.roomId,
      targetId,
      card,
    };
    this.state.socket.emit("select-favor-card", data);
  };

  useSeeTheFuture = (userId) => {
    const data = {
      userId,
      roomId: this.state.roomId,
    };
    this.state.socket.emit("use-see-the-future", data);
  };

  showSeeTheFuture = (cards) => {
    console.log(cards); // todo :
  };

  useCommon2 = (userId, cardsIdx) => {
    const { usersData } = this.state;
    const cards = cardsIdx.map((cardIdx) => usersData[userId].userCards[cardIdx]);

    if (cardsIdx.length !== 2) return;
    if (cards[0] !== cards[1]) return;

    const data = {
      userId,
      roomId: this.state.roomId,
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
    const { usersData } = this.state;
    const targetCard = usersData[targetId].userCards[targetCardIdx];
    const data = {
      userId,
      roomId: this.state.roomId,
      targetId,
      targetCard,
      targetCardIdx,
    };
    this.state.socket.emit("select-common-2", data);
  };

  useCommon3 = (userId, cardsIdx) => {
    const { usersData } = this.state;
    const cards = cardsIdx.map((cardIdx) => usersData[userId].userCards[cardIdx]);

    if (cardsIdx.length !== 3) return;
    if (cards[0] !== cards[1] || cards[0] !== cards[2]) return;

    const data = {
      userId,
      roomId: this.state.roomId,
      cards,
      cardsIdx,
    };
    this.state.socket.emit("use-common-3", data);
  };

  chooseAnyCard = (targetId) => {
    alert("chosse any card from");
    return Card.defuse; // todo:
  };

  selectCommon3 = (userId, targetId, targetCardIdx) => {
    const { usersData } = this.state;
    const targetCard = usersData[targetId].userCards[targetCardIdx];
    const data = {
      userId,
      roomId: this.state.roomId,
      targetId,
      targetCard,
      targetCardIdx,
    };
    this.state.socket.emit("select-common-3", data);
  };

  useCommon5 = (userId, cardsIdx) => {
    const { usersData } = this.state;
    const cards = cardsIdx.map((cardIdx) => usersData[userId].userCards[cardIdx]);

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
      roomId: this.state.roomId,
      cards,
      cardsIdx,
    };
    this.state.socket.emit("use-common-5", data);
  };

  chooseAnyCardFromDiscardPile = () => {
    alert("chosse any card from");
    return 0; // todo:
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
  }

  gameLose = (userId) => {
    const data = {
      userId,
      roomId: this.state.roomId,
    };
    this.state.socket.emit("game-lose", data);
  }

  handleUseCard = (userId, cardsIdx) => {
    switch (cardsIdx.length) {
      case 1:
        this.useCard(userId, cardsIdx[0])
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
  }

  sendMessageRoom = (fromUserId,fromRoomId,fromUsername,message) => {
    let data = {
      fromUserId : fromUserId,
      fromRoomId : fromRoomId,
      fromUsername : fromUsername,
      message : message,
    }
    console.log("message-send-room")
    this.state.socket.emit("message-send-room", data);
  }

  useEffect = (userId, card) => {
    const data = {
      userId,
      roomId: this.state.roomId,
      card,
    }
    this.state.socket.emit("use-effect", data);
  }

  closeSeeTheFutureDialog = () => {
    this.setState({showSeeTheFutureDialog: 0, seeTheFutreCard: []});
  }

  selectPlayer = (userId, selectedPlayerId) => {
    const data = {
      userId,
      roomId: this.state.roomId,
      targetId: selectedPlayerId,
    }
    console.log('select-player',data);
    this.state.socket.emit("select-player", data);
  }

  setSelectedCardIdx = (userId, selectedCardIdx) => {
    this.useEffect(userId, this.state.roomId, Card.favor, selectedCardIdx);
  }



  render() {
    // const classes = useStyles();
    const roomId = "100001";
    
    const { socket, hasDefuse, isExplode, showSeeTheFutureDialog, seeTheFutureCards, discardPile, isSelectingPlayer, showCardSelectorDialog } = this.state;
    const userId = window.sessionStorage.getItem("userId"); // todo:
    const userIdx = this.findUserIdx(userId);
    let userCards = [];
    if(this.state.usersData.length > userIdx && userIdx !== -1 && this.state.usersData[userIdx].userCards) {
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
        <NavBar />
        <Chat roomId={roomId} socket={this.state.socket} sendMessageRoom={this.sendMessageRoom}/>
        <Game
          socket={socket}
          createCustomRoom={this.createCustomRoom}
          joinCustomRoom={this.joinCustomRoom}
          startGame={this.startGame}
          getPropsFromUserId={this.getPropsFromUserId}
          userCards={userCards}
          drawCard={this.drawCard}
          hasDefuse={hasDefuse}
          isExplode={isExplode}
          insertExplodingPuppy={this.insertExplodingPuppy}
          handleUseCard={this.handleUseCard}
          showSeeTheFutureDialog={showSeeTheFutureDialog}
          seeTheFutureCards={seeTheFutureCards}
          closeSeeTheFutureDialog={this.closeSeeTheFutureDialog}
          gameLose={this.gameLose}
          topDiscardPile={discardPile[discardPile.length-1]}
          isSelectingPlayer={isSelectingPlayer}
          selectPlayer={this.selectPlayer}
          showCardSelectorDialog={showCardSelectorDialog}
          setSelectedCardIdx={this.setSelectedCardIdx}
        />
      </div>
    );
  }
}

export default Gameplay;