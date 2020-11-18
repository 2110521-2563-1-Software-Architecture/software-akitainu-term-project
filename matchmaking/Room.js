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
    this.customRooms = {};
    this.userIdToCurrentSocket = {};
  }

  getCustomRooms = () => {
    return this.customRooms;
  };

  getSocketByUserId = (userId) => {
    return this.userIdToCurrentSocket[userId];
  };

  searchRanked = (userId) => {
    this.rankedQueue.push(userId);
    if (this.rankedQueue.length === 5) {
      this.startRankedGame();
    }
    console.log(this.rankedQueue);
  };

  quitSearchRanked = (userId) => {
    this.rankedQueue = this.rankedQueue.filter((user) => user !== userId);
    console.log(this.rankedQueue);
  };

  startRankedGame = () => {
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
  };

  createCustomRoom = (userId, socketId) => {
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
        deck: {
          explodingPuppy: 7,
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
        },
        maxPlayer: 8,
        isPublic: true,
        turn: 30,
      },
    };
    this.socket.emit("update-custom-rooms", this.customRooms);
    this.socket.to(socketId).emit("join-custom-room", { roomId: inviteId });
    console.log(this.customRooms);
  };

  joinCustomRoom = (userId, inviteId, socketId) => {
    let room = this.customRooms[inviteId];
    if (room == undefined) {
      this.socket
        .to(socketId)
        .emit("join-custom-error", { msg: "Invalid invite number" });
      return;
    }
    if (room.players.length >= 8) {
      // todo: not 8
      this.socket
        .to(socketId)
        .emit("join-custom-error", { msg: "The room is already full" });
      return;
    }
    room.players.push(userId);
    this.socket.to(socketId).emit("join-custom-room", { roomId: inviteId });
    this.socket.emit("update-custom-rooms", this.customRooms);
  };

  leaveCustomRoom = (userId, inviteId, socketId) => {
    let room = this.customRooms[inviteId];
    if (!room) {
      this.socket.emit("error", { msg: "Invalid invite number" });
      return;
    }
    if (room.leader === userId) {
      this.customRooms[inviteId];
      room.players.forEach((player) => {
        this.getSocketByUserId(player).emit("leave-custom-room", {
          roomId: inviteId,
        });
      });
      delete this.createCustomRoom[inviteId];
    } else {
      room.players = room.players.filter((user) => user !== userId);
      this.socket.to(socketId).emit("leave-custom-room", { roomId: inviteId });
      this.customRooms[inviteId].players.forEach((player) => {
        this.getCustomRoomData(inviteId, player);
      });
    }
    this.socket.emit("update-custom-rooms", this.customRooms);
  };

  startCustomRoom = (inviteId) => {
    axios
      .post("http://localhost:10002/games/create", {
        mode: "rank",
        usersId: players,
      })
      .then((res) => {
        console.log("Created a custom room");
        // console.log(res.data)
        // this.socket.emit("ranked-found", { players });
        // let data = {
        //   players: players,
        //   roomId: res.data.roomId,
        // };
        this.customRooms[inviteId].players.forEach((player) => {
          this.getSocketByUserId(player).emit("started-custom-room", {
            inviteId,
          });
        });
      });
  };

  getCustomRoomData = (inviteId, userId) => {
    this.getSocketByUserId(userId).emit(
      "custom-room-info",
      this.customRooms[inviteId]
    );
  };
  // more
  setUserMapSocket = (userIdToCurrentSocket) => {
    this.userIdToCurrentSocket = userIdToCurrentSocket;
  };
}

module.exports = { Room };
