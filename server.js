const http = require("http");
const connectDB = require("./config/db");
const app = require("./app");
const { setupWebSocket } = require("./utils/websocket");

const PORT = process.env.PORT || 5000;

connectDB();

const server = http.createServer(app);

// Setup WebSocket
setupWebSocket(server);

server.listen(PORT, () => {
  console.log(`Server is up and listening on port ${PORT}`);
});
