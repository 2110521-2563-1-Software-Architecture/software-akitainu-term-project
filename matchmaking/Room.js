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
    this.customRooms = [];
  }

  searchRanked = (userId) => {
    this.rankedQueue.push(userId);
    if (this.rankedQueue.length === 5) {
      this.createRankedGame();
    }
    console.log(this.rankedQueue);
  };

  quitSearchRanked = (userId) => {
    this.rankedQueue = this.rankedQueue.filter((user) => user !== userId);
    console.log(this.rankedQueue);
  };

  createRankedGame = () => {
    let players = [];
    for (let i = 0; i < 5; i++) {
      players.push(this.rankedQueue.shift());
    }
    this.socket.emit("ranked-found", { players });
    console.log(this.rankedQueue);
    // axios
    //   .post("https://localhost:1000/rooms", { type: 0, players })
    //   .then(() => {
    //     console.log("Created a ranked room");
    //     this.socket.emit("ranked-found", { players });
    //   });
  };

  // more
}

module.exports = { Room };
