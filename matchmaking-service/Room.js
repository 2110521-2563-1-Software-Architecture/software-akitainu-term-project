var axios = require("axios");
require("dotenv").config();
var ENDPOINT = process.env.GAME_API_ENDPOINT;

class Room {
  constructor(socket) {
    this.socket = socket;
    this.rankedQueue = [];
    this.customRooms = {};
    this.userIdToCurrentSocket = {};
  }

  getCustomRooms() {
    return this.customRooms;
  }

  getSocketByUserId(userId) {
    return this.userIdToCurrentSocket[userId];
  }

  searchRanked(userId, socketId) {
    if (this.rankedQueue.indexOf(userId) !== -1) {
      this.socket.to(socketId).emit("duplicate-user", { isRanked: true });
      return false;
    }
    this.rankedQueue.push(userId);
    if (this.rankedQueue.length === 5) {
      this.startRankedGame();
      return true;
    }
    console.log("updated rank queue:", this.rankedQueue);
    return true;
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
    axios
      .post(ENDPOINT + "/games/create", {
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
          const socket = this.getSocketByUserId(player);
          if(socket) socket.emit("ranked-found", data);
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
        defuse: 1,
        nope: 6,
        attack: 5,
        skip: 5,
        favor: 5,
        shuffle: 5,
        seeTheFuture: 6,
        common1: 5,
        common2: 5,
        common3: 5,
        common4: 5,
        common5: 5,
        maxPlayer: 5,
        isPublic: false,
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
    if (room.players.indexOf(userId) !== -1) {
      this.socket.to(socketId).emit("join-custom-error", {
        msg: "This user already joined this room",
      });
      this.socket.to(socketId).emit("duplicate-user", { isRanked: false });
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
        const socket = this.getSocketByUserId(player);
        if(socket) socket.emit("leave-custom-room", {
          roomId: inviteId,
        });
      });
      room.players = [];
      delete this.customRooms[inviteId];
    } else {
      room.players = room.players.filter((user) => user !== userId);
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
      .post(ENDPOINT + "/games/create", {
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
          const socket = this.getSocketByUserId(player);
          if(socket) socket.emit("started-custom-room", data);
        });
        delete this.customRooms[inviteId];
        this.socket.emit("update-custom-rooms", this.customRooms);
      });
  }

  getCustomRoomData(inviteId, userId) {
    const usersId = this.customRooms[inviteId]
      ? this.customRooms[inviteId].players
      : [];
    usersId.map((userId) => {
      const socket = this.getSocketByUserId(userId);
      if(socket) socket.emit(
        "custom-room-info",
        this.customRooms[inviteId]
      );
    });
    if (userId && usersId.indexOf(userId) === -1) {
      const socket = this.getSocketByUserId(userId);
      if(socket) socket.emit("custom-room-info-error");
    }
  }

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
    if (room.players.length > maxPlayer) {
      room.options.maxPlayer = room.players.length;
    } else {
      room.options.maxPlayer = maxPlayer;
    }
    // this.updateDefaultCards(room.options.maxPlayer, inviteId);
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

  // updateDefaultCards(maxPlayer, inviteId) {
  //   const room = this.customRooms[inviteId];
  //   room.options.defuse = maxPlayer <= 5 ? 1 : 2;
  //   room.options.nope = maxPlayer + 1;
  //   room.options.attack = maxPlayer;
  //   room.options.skip = maxPlayer;
  //   room.options.favor = maxPlayer;
  //   room.options.shuffle = maxPlayer;
  //   room.options.seeTheFuture = maxPlayer + 1;
  //   room.options.common1 = maxPlayer;
  //   room.options.common2 = maxPlayer;
  //   room.options.common3 = maxPlayer;
  //   room.options.common4 = maxPlayer;
  //   room.options.common5 = maxPlayer;
  // }
}

module.exports = { Room };
