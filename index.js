const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const path = require("path");
const winston = require("winston");
const Helpers = require("./src/helpers.js");
const actions = require("./src/actions.js");

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.label({ label: "[my-label]" }),
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss"
    }),
    winston.format.printf(
      info => `${info.timestamp} ${info.level}: ${info.message}`
    )
  ),
  transports: [new winston.transports.File({ filename: "logs/combined.log" })]
});

// Register public folder for js and css
app.use(express.static(path.join(__dirname, "public")));

// Send the homepage of the chat app
app.get("/", (req, res) => {
  logger.info(`visitor ${req.ip}`);

  res.sendFile(`${__dirname}/home.html`);
});

// Check if a message is a command
app.get("/commands", (req, res) => {
  const helpers = new Helpers();

  res.status(200).json({ commands: Array.from(helpers.getCommands()) });
});

// Global users variable to keep track of current users
global.users = {};

io.on("connection", socket => {
  // Notify all users of the new connection
  socket.on("join", username => {
    actions.onJoin(socket, logger, username);
  });

  // Notify all users of the disconnection
  socket.on("disconnecting", () => {
    actions.onDisconnecting(socket, logger);
  });

  // Send the message to all users or send a message from the server to the user
  socket.on("chat message", msgObject => {
    actions.onChatMessage(socket, logger, msgObject);
  });
});

http.listen(3000, () => {
  console.log("listening on *:3000");
});
