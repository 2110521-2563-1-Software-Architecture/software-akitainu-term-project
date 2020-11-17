var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

app.get("/", (req, res) => {
  res.send("Hello from matchmaking service");
});

io.on("connection", (socket) => {
  console.log("a user connected");
});

io.on("search-ranked", (data) => {
  console.log("search-ranked");
  console.log(data);
});

http.listen(3030, () => {
  console.log("listening on *:3030");
});
