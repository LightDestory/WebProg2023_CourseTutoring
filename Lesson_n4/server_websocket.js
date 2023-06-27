const express = require("express");
const serverExpress = express();
const ws = require("ws");

// Provide static files from the 'client' folder
serverExpress.use(express.static("./clients/websocket"));

// Connected clients
const clients = [];
// Initialize a new WebSocket server instance without its own HTTP server
const wsServer = new ws.Server({ noServer: true });

// Handle WebSocket connection event, when a client requests to connect
wsServer.on("connection", (socket) => {
  console.log("A new client has connected")
  clients.push(socket);
  for (const client of clients) {
    if (client.readyState == ws.OPEN && client != socket)
      client.send("A new client has connected");
  }
  // Handle the client's WebSocket message event, when a client sends something to the server
  socket.on("message", (message) => {
    message = message.toString();
    console.log("Received:", message);
    // The server broadcasts the message to all connected clients
    for (const client of clients) {
      if (client.readyState == ws.OPEN)
        client.send(message);
    }
  });
  // Handle the client's WebSocket close event
  socket.on("close", (event) => {
    let code = event.code;
    let reason = event.reason;
    let message = "";
    const index = clients.indexOf(socket);
    if (index > -1) {
      clients.splice(index, 1);
    }
    for (const client of clients) {
      if (client.readyState == ws.OPEN)
        if (code) {
          message = ` with ${code}`;
          if (reason) {
            message += ` and reason ${reason}`;
          }
        }
      client.send("A client has disconnected" + message);
    }
    console.log("A client has disconnected" + message);
  });
});
// Start the express web server listening on 8080
const httpServer = serverExpress.listen(8080, () => {
  console.info("Listening to", 8080);
});
// Handle HTTP server upgrade events on the Express server
httpServer.on("upgrade", (request, socket, head) => {
  // Pass the upgrade event to the WebSocket server
  wsServer.handleUpgrade(request, socket, head, (socket) => {
    // Emit the connection event for the WebSocket server
    wsServer.emit("connection", socket, request);
  });
});
