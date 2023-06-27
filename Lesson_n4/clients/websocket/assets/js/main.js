var username = "";
const username_input = document.getElementById("usernameInput");
const register_user_btn = document.getElementById("registerUsername");
var socket = undefined;
const chatbox = document.getElementById('chatbox');
const messageInput = document.getElementById("messageInput");

register_user_btn.addEventListener("click", () => {
  username = username_input.value;
  if (username == "") {
    alert("Please enter a valid username");
    return
  }
  console.log("Username registered: " + username);
  connectWebSocket();
});


function connectWebSocket() {
  socket = new WebSocket("ws://localhost:8080");
  // Event emitted on successful connection
  socket.addEventListener("open", () => {
    alert("Connected to websocket successfully")
    document.getElementById("chat_container").style.display = "block";
  });
  // Event emitted on message received
  socket.addEventListener("message", (event) => {
    console.log("Received:", event.data)
    const message = event.data;
    displayMessage(message);
  });
  // Event emitted both on close invokation and on not found error
  socket.addEventListener("close", (event) => {
    alert("Socket closed");
    chatbox.innerHTML = "";
    messageInput.value = "";
    document.getElementById("chat_container").style.display = "none";
  });
  // Send message on enter key press
  messageInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      if (messageInput.value == "") {
        alert("Please enter a valid message");
        return
      }
      const message = messageInput.value;
      if (message == "/quit") {
        socket.close();
        return
      }
      console.log("Sending:", message)
      socket.send(`${username}: ${message}`);
      messageInput.value = "";
    }
  });

  function displayMessage(message) {
    const messageElement = document.createElement("div");
    messageElement.innerHTML = message;
    chatbox.appendChild(messageElement);
  }
}