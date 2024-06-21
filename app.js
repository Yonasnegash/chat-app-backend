const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const messageRoutes = require("./routes/messageRoutes");

const app = express();

app.use(bodyParser.json());
app.use(cors());

// Serve static files from uploads directory
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/", messageRoutes);

module.exports = app;
