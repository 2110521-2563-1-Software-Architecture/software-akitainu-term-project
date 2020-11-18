var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

const { Room } = require("./Room");

var socketIdToUserId = {};

// {
//   123546 : socket
// }
var userIdToCurrentSocket = {};

const room = new Room(io);

app.get("/", (req, res) => {
  res.send("Hello from matchmaking service");
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.emit("update-custom-rooms", room.getCustomRooms());

  socket.on("search-ranked", (data) => {
    console.log("search-ranked");
    console.log(data);
    socketIdToUserId[socket.id] = data.userId;
    userIdToCurrentSocket[data.userId] = socket;
    room.searchRanked(data.userId);
    room.setUserMapSocket(userIdToCurrentSocket);
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
      room.userDisconnected(userId);
    }
  });

  socket.on("create-custom-room", (data) => {
    console.log("create custom room");
    console.log(data);
    socketIdToUserId[socket.id] = data.userId;
    userIdToCurrentSocket[data.userId] = socket;
    room.setUserMapSocket(userIdToCurrentSocket);
    room.createCustomRoom(data.userId, socket.id);
    // let userId = socketIdToUserId[socket.id];
    // if (userId) {
    //   room.quitSearchRanked(userId);
    // }
  });

  socket.on("join-custom-room", (data) => {
    console.log("join custom room");
    console.log(data);
    socketIdToUserId[socket.id] = data.userId;
    userIdToCurrentSocket[data.userId] = socket;
    room.setUserMapSocket(userIdToCurrentSocket);
    room.joinCustomRoom(data.userId, data.inviteId, socket.id);
  });

  socket.on("start-custom-room", (data) => {
    // socketIdToUserId[socket.id] = data.userId;
    // userIdToCurrentSocket[data.userId] = socket;
    // room.setUserMapSocket(userIdToCurrentSocket);
    // room.getCustomRoomData(data.inviteId, data.userId);
    room.startCustomRoom({ inviteId: data.inviteId });
  });

  socket.on("joined-custom-room", (data) => {
    socketIdToUserId[socket.id] = data.userId;
    userIdToCurrentSocket[data.userId] = socket;
    room.setUserMapSocket(userIdToCurrentSocket);
    room.getCustomRoomData(data.inviteId, data.userId);
  });
});

http.listen(3030, () => {
  console.log("listening on *:3030");
});
