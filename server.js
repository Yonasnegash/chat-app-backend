const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const WebSocket = require("ws");
const cors = require("cors");

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/chat");

// Define a message schema
const messageSchema = new mongoose.Schema({
  username: String,
  message: String,
  fileLink: String,
  timestamp: { type: Date, default: Date.now },
});

// Create a message model
const Message = mongoose.model("Message", messageSchema);

const app = express();
app.use(bodyParser.json());
app.use(cors());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Send message API
app.post("/send", async (req, res) => {
  try {
    if (!req.body.message) {
      return res.status(400).json({ message: "No content to upload" });
    }

    const newMessage = new Message({
      username: req.body.username,
      message: req.body.message || "",
      timestamp: new Date(),
    });

    await newMessage.save();

    // Send the message to WebSocket clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify([newMessage]));
      }
    });

    res.status(200).json({
      message: "Message sent successfully",
      chatMessage: newMessage,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// WebSocket connection
wss.on("connection", async (ws) => {
  console.log("Client connected");

  try {
    // Load chat history
    const messages = await Message.find().sort({ timestamp: 1 }).exec();
    ws.send(JSON.stringify(messages));
  } catch (error) {
    console.error("Error loading messages:", error);
  }

  ws.on("message", async (data) => {
    try {
      const parsedData = JSON.parse(data);

      const newMessage = new Message({
        username: parsedData.username,
        message: parsedData.message,
        timestamp: new Date(),
      });

      await newMessage.save();

      const broadcastMessage = JSON.stringify([newMessage]);

      // Broadcast to all clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(broadcastMessage);
        }
      });
    } catch (error) {
      console.error("Error processing the message: ", error);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is up and listening on port ${PORT}`);
});
