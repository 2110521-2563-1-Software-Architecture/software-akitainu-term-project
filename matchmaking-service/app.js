var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http, { path: "/matchmaking" });

const { Room } = require("./Room");

var socketIdToUserId = {};
var userIdToCurrentSocket = {};

const room = new Room(io);

app.get("/", (req, res) => {
  res.send("Hello from matchmaking service");
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("search-ranked", (data) => {
    if (room.searchRanked(data.userId, socket.id)) {
      console.log("search-ranked", data);
      socketIdToUserId[socket.id] = data.userId;
      userIdToCurrentSocket[data.userId] = socket;
      room.setUserMapSocket(userIdToCurrentSocket);
    }
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
      room.quitSearchRanked(userId); // rank
      room.userDisconnected(userId); // custom
    }
  });

  socket.on("create-custom-room", (data) => {
    console.log("create custom room");
    console.log(data);
    room.createCustomRoom(data.userId, socket.id);
  });

  socket.on("join-custom-room", (data) => {
    console.log("join custom room");
    console.log(data);
    room.joinCustomRoom(data.userId, data.inviteId, socket.id);
  });

  socket.on("start-custom-room", (data) => {
    console.log("start custom room");
    console.log(data);
    room.startCustomRoom(data.inviteId);
  });

  socket.on("joined-custom-room", (data) => {
    console.log("joined custom room");
    console.log(data);
    socketIdToUserId[socket.id] = data.userId;
    userIdToCurrentSocket[data.userId] = socket;
    room.setUserMapSocket(userIdToCurrentSocket);
    room.getCustomRoomData(data.inviteId, data.userId);
  });

  socket.on("get-custom-game-rooms", () => {
    socket.emit("update-custom-rooms", room.getCustomRooms());
  });

  socket.on("set-visible", (data) => {
    console.log("set visible");
    console.log(data);
    room.setVisible(data.inviteId, data.visible);
  });

  socket.on("set-max-player", (data) => {
    console.log("set max player");
    console.log(data);
    room.setMaxPlayer(data.inviteId, data.maxPlayer);
  });

  socket.on("set-time-per-turn", (data) => {
    console.log("set time per turn");
    console.log(data);
    room.setTimePerTurn(data.inviteId, data.timePerTurn);
  });

  socket.on("set-cards", (data) => {
    console.log("set cards");
    console.log(data);
    room.setCards(data.inviteId, data.cards);
  });
});

http.listen(3030, () => {
  console.log("listening on *:3030");
});
