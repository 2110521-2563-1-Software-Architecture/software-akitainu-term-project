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
  };

  createRankedGame = () => {
    let players = [];
    for (let i = 0; i < 5; i++) {
      players.push(this.createRankedGame.push());
    }
    axios
      .post("https://localhost:1000/rooms", { type: 0, players })
      .then(console.log("Created a ranked room"));
  };

  // more
}

module.exports = { Room };
