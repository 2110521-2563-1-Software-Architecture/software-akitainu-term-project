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
  }

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
    this.socket.emit("ranked-found", { players });
    console.log(this.rankedQueue);
    axios
      .post("http://localhost:10002/games/create", { mode: 'rank', usersId: players })
      .then(() => {
        console.log("Created a ranked room");
        this.socket.emit("ranked-found", { players });
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
    this.customRooms[inviteId] = { players: [userId] };
    this.socket.emit("update-custom-rooms", this.customRooms);
    // this.socket.to(socketId).emit("join-custom-room", { roomId: inviteId });
    console.log(this.customRooms);
  };

  joinCustomRoom = (userId, inviteId, socketId) => {
    let room = this.customRooms[inviteId];
    if (room == undefined) {
      this.socket.emit("error", { msg: "Invalid invite number" });
      return;
    }
    if (room.players.length >= 8) {
      this.socket.emit("error", { msg: "The room is already full" });
      return;
    }
    room.players.push(userId);
    // this.socket.to(socketId).emit("join-custom-room", { roomId: inviteId });
    console.log(this.customRooms);
  };

  leaveCustomRoom = (userId, inviteId, socketId) => {
    let room = this.customRooms[inviteId];
    if (!room) {
      this.socket.emit("error", { msg: "Invalid invite number" });
      return;
    }
    room.players = room.players.filter((user) => user !== userId);
    this.socket.to(socketId).emit("leave-custom-room", { roomId: inviteId });
    console.log(this.customRooms);
  };

  deleteCustomRoom = (inviteId) => {
    let room = this.customRooms[inviteId];
    if (!room) {
      this.socket.emit("error", { msg: "Invalid invite number" });
      return;
    }
    // this.socket.emit("delete-custom-rooms", { inviteId }); ??
    delete this.customRooms[inviteId];
    this.socket.emit("update-custom-rooms", this.customRooms);
    console.log(this.customRooms);
  };
  // more
}

module.exports = { Room };
