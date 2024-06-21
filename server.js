const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

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

const server = http.createServer(app);

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

    res.status(200).json({
      message: "Message sent successfully",
      chatMessage: newMessage,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is up and listening on port ${PORT}`);
});
