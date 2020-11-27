var axios = require("axios");

/*
    rankedRoom:
    {
        playees: []
    }
*/

/*
    customRoom: 
    {
        players: []
        options: {

        }
    }
*/

class Room {
  constructor(socket) {
    this.socket = socket;
    this.rankedQueue = [];
    this.onlinePlayers = [];
    this.customRooms = {};
    this.userIdToCurrentSocket = {};
  }

  addOnlinePlayers(userId, socketId) {
    if (this.onlinePlayers.findIndex((id) => userId === id) !== -1) {
      console.log("duplicate user");
      this.socket.to(socketId).emit("duplicate-user", {});
      return false;
    }
    this.onlinePlayers.push(userId);
    console.log("online: ", this.onlinePlayers);
    return true;
  }

  removeOnlinePlayers(userId) {
    this.onlinePlayers = this.onlinePlayers.filter((user) => user != userId);
    console.log("online: ", this.onlinePlayers);
  }

  getCustomRooms() {
    return this.customRooms;
  }

  getSocketByUserId(userId) {
    return this.userIdToCurrentSocket[userId];
  }

  searchRanked(userId) {
    this.rankedQueue.push(userId);
    if (this.rankedQueue.length === 5) {
      this.startRankedGame();
    }
    console.log("updated rank queue:", this.rankedQueue);
  }

  quitSearchRanked(userId) {
    this.rankedQueue = this.rankedQueue.filter((user) => user !== userId);
    console.log("updated rank queue:", this.rankedQueue);
  }

  startRankedGame() {
    let players = [];
    for (let i = 0; i < 5; i++) {
      players.push(this.rankedQueue.shift());
    }
    // this.socket.emit("ranked-found", { players });
    // players.forEach((player)=>{
    //   this.getSocketByUserId(player).emit("ranked-found", { players })
    // })
    // console.log(this.rankedQueue);
    axios
      .post("http://localhost:10002/games/create", {
        mode: "rank",
        usersId: players,
      })
      .then((res) => {
        console.log("Created a ranked room");
        // console.log(res.data)
        // this.socket.emit("ranked-found", { players });
        let data = {
          players: players,
          roomId: res.data.roomId,
        };
        players.forEach((player) => {
          this.getSocketByUserId(player).emit("ranked-found", data);
        });
      });
  }

  userDisconnected(userId) {
    let targetInviteId, found;
    const customRoomIds = Object.keys(this.customRooms);
    for (let i = 0; i < customRoomIds.length; i++) {
      found = false;
      const room = this.customRooms[customRoomIds[i]];
      if (room.leader === userId) {
        targetInviteId = customRoomIds[i];
        break;
      } else {
        for (let j = 0; j < room.players.length; j++) {
          if (room.players[j] === userId) {
            found = true;
            targetInviteId = customRoomIds[i];
            break;
          }
        }
        if (found) {
          break;
        }
      }
    }
    if (targetInviteId) {
      this.leaveCustomRoom(userId, targetInviteId);
    }
    console.log("updated custom rooms:", this.customRooms);
  }

  createCustomRoom(userId, socketId) {
    let inviteId;
    while (true) {
      inviteId = Math.floor(100000 + Math.random() * 900000);
      if (this.customRooms[inviteId] == undefined) {
        break;
      }
    }
    this.customRooms[inviteId] = {
      players: [userId],
      leader: userId,
      options: {
        defuse: 4,
        nope: 8,
        attack: 7,
        skip: 7,
        favor: 7,
        shuffle: 7,
        seeTheFuture: 8,
        common1: 7,
        common2: 7,
        common3: 7,
        common4: 7,
        common5: 7,
        maxPlayer: 8,
        isPublic: true,
        timePerTurn: 30,
      },
    };
    this.socket.emit("update-custom-rooms", this.customRooms);
    this.socket.to(socketId).emit("custom-room-id", { roomId: inviteId });
    console.log("updated custom rooms:", this.customRooms);
  }

  joinCustomRoom(userId, inviteId, socketId) {
    let room = this.customRooms[inviteId];
    if (room == undefined) {
      this.socket
        .to(socketId)
        .emit("join-custom-error", { msg: "Invalid invite number" });
      return;
    }
    if (room.players.length >= room.options.maxPlayer) {
      this.socket
        .to(socketId)
        .emit("join-custom-error", { msg: "The room is already full" });
      return;
    }
    room.players.push(userId);
    this.socket.to(socketId).emit("custom-room-id", { roomId: inviteId });
    this.socket.emit("update-custom-rooms", this.customRooms);
    console.log("updated custom rooms:", this.customRooms);
  }

  leaveCustomRoom(userId, inviteId, socketId) {
    let room = this.customRooms[inviteId];
    if (!room) {
      this.socket.emit("error", { msg: "Invalid invite number" });
      return;
    }
    if (room.leader === userId) {
      // this.customRooms[inviteId];
      room.players.forEach((player) => {
        this.getSocketByUserId(player).emit("leave-custom-room", {
          roomId: inviteId,
        });
      });
      room.players = [];
      delete this.customRooms[inviteId];
    } else {
      room.players = room.players.filter((user) => user !== userId);
      /*
      if (socketId) {
        this.socket
          .to(socketId)
          .emit("leave-custom-room", { roomId: inviteId });
      }
      */
      this.customRooms[inviteId].players.forEach((player) => {
        this.getCustomRoomData(inviteId);
      });
    }
    this.socket.emit("update-custom-rooms", this.customRooms);
    console.log("updated custom rooms:", this.customRooms);
  }

  startCustomRoom(inviteId) {
    const players = this.customRooms[inviteId].players;
    const options = this.customRooms[inviteId].options;
    delete this.customRooms[inviteId];
    axios
      .post("http://localhost:10002/games/create", {
        mode: "custom",
        usersId: players,
        options,
      })
      .then((res) => {
        console.log("Created a custom room");
        const data = {
          players: players,
          roomId: res.data.roomId,
        };
        console.log(data, res.data);
        players.forEach((player) => {
          this.getSocketByUserId(player).emit("started-custom-room", data);
        });
      });
  }

  getCustomRoomData(inviteId, userId) {
    const usersId = this.customRooms[inviteId]
      ? this.customRooms[inviteId].players
      : [];
    usersId.map((userId) => {
      this.getSocketByUserId(userId).emit(
        "custom-room-info",
        this.customRooms[inviteId]
      );
    });
    if (userId && usersId.indexOf(userId) === -1) {
      this.getSocketByUserId(userId).emit("custom-room-info-error");
    }
  }
  // more
  setUserMapSocket(userIdToCurrentSocket) {
    this.userIdToCurrentSocket = userIdToCurrentSocket;
  }

  setVisible(inviteId, visible) {
    const room = this.customRooms[inviteId];
    if (!room) return;
    room.options.isPublic = visible;
    this.getCustomRoomData(inviteId);
    this.socket.emit("update-custom-rooms", this.customRooms);
  }

  setMaxPlayer(inviteId, maxPlayer) {
    const room = this.customRooms[inviteId];
    if (!room) return;
    room.options.maxPlayer = maxPlayer;
    this.getCustomRoomData(inviteId);
    this.socket.emit("update-custom-rooms", this.customRooms);
  }

  setTimePerTurn(inviteId, timePerTurn) {
    const room = this.customRooms[inviteId];
    if (!room) return;
    room.options.timePerTurn = timePerTurn;
    this.getCustomRoomData(inviteId);
  }

  setCards(inviteId, cards) {
    const room = this.customRooms[inviteId];
    if (!room) return;
    const {
      defuse,
      nope,
      attack,
      skip,
      favor,
      shuffle,
      seeTheFuture,
      common1,
      common2,
      common3,
      common4,
      common5,
    } = cards;
    room.options.defuse = defuse;
    room.options.nope = nope;
    room.options.attack = attack;
    room.options.skip = skip;
    room.options.favor = favor;
    room.options.shuffle = shuffle;
    room.options.seeTheFuture = seeTheFuture;
    room.options.common1 = common1;
    room.options.common2 = common2;
    room.options.common3 = common3;
    room.options.common4 = common4;
    room.options.common5 = common5;
    this.getCustomRoomData(inviteId);
  }
}

module.exports = { Room };
