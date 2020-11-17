var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

const { Room } = require("./Room");

let socketIdToUserId = {};

const room = new Room(io);

app.get("/", (req, res) => {
  res.send("Hello from matchmaking service");
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("search-ranked", (data) => {
    console.log("search-ranked");
    console.log(data);
    socketIdToUserId[socket.id] = data.userId;
    room.searchRanked(data.userId);
  });

  socket.on("quit-search-ranked", (data) => {
    console.log("quit-search-ranked");
    console.log(data);
    room.quitSearchRanked(data.userId);
  });

  socket.on("disconnect", () => {
    console.log("a user disconnected");
    let userId = socketIdToUserId[socket.id];
    if (userId) {
      room.quitSearchRanked(userId);
    }
  });
});

http.listen(3030, () => {
  console.log("listening on *:3030");
});
