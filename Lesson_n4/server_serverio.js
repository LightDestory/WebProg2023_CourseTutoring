const express = require("express");
const serverExpress = express();
const serverHttp = require('http').Server(serverExpress);
const serverIO = require('socket.io')(serverHttp);
// Connected clients
const clients = [];
// Provide static files from the 'client' folder
serverExpress.use(express.static("./clients/socketio"));
// Handle WebSocket connection event, when a client requests to connect
serverIO.on("connection", (socket) => {
  console.log("A new client has connected")
  clients.push(socket);
  socket.broadcast.emit("chat message", "A new client has connected");
  // Handle the client's WebSocket message event, when a client sends something to the server
  socket.on("chat message", (message) => {
    message = message.toString();
    console.log("Received:", message);
    // The server broadcasts the message to all connected clients
    serverIO.sockets.emit("chat message", message);
  });
  // Handle the client's WebSocket close event
  socket.on("disconnect", () => {
    const index = clients.indexOf(socket);
    if (index > -1) {
      clients.splice(index, 1);
    }
    serverIO.sockets.emit("chat message", "A client has disconnected");
    console.log("A client has disconnected");
  });
});


serverHttp.listen(8080, function () {
  console.info("Listening to", 8080);
});
