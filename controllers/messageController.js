const Message = require("../models/message");
const { broadcastMessage } = require("../utils/websocket");

const sendMessage = async (req, res) => {
  try {
    if (!req.file && !req.body.message) {
      return res.status(400).json({ message: "No content to upload" });
    }

    const fileLink = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
      : "";

    const newMessage = new Message({
      username: req.body.username,
      message: req.body.message || "",
      fileLink: fileLink,
      timestamp: new Date(),
    });

    await newMessage.save();

    // Broadcast to WebSocket clients
    broadcastMessage(newMessage);

    res.status(200).json({
      message: "Message sent successfully",
      chatMessage: newMessage,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getChatHistory = async () => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 }).exec();
    return messages;
  } catch (error) {
    console.error("Error loading messages:", error);
    throw error;
  }
};

module.exports = { sendMessage, getChatHistory };
