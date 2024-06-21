const WebSocket = require("ws");
const Message = require("../models/message");

const setupWebSocket = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", async (ws) => {
    console.log("Client connected");

    try {
      const messages = await Message.find().sort({ timestamp: 1 }).exec();
      ws.send(JSON.stringify(messages));
    } catch (error) {
      console.error("Error loading messages:", error);
    }

    ws.on("close", () => {
      console.log("Client disconnected");
    });
  });

  global.wss = wss;
};

const broadcastMessage = (message) => {
  const wss = global.wss;
  if (!wss) return;

  const broadcastMessage = JSON.stringify([message]);

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(broadcastMessage);
    }
  });
};

module.exports = { setupWebSocket, broadcastMessage };
