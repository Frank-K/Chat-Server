const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const winston = require('winston');
const Helpers = require("./helpers.js");

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.label({ label: '[my-label]' }),
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

// Register public folder for js and css
app.use(express.static(path.join(__dirname, 'public')));

// Send the homepage of the chat app
app.get('/', (req, res) => {
  logger.info(`visitor ${req.ip}`);

  res.sendFile(__dirname + '/home.html');
});

// Check if a message is a command
app.get('/commands', (req, res) => {
  let helpers = new Helpers();

  res.status(200).json({ commands: Array.from(helpers.getCommands()) });
})

// Global users variable to keep track of current users
global.users = {};

io.on('connection', (socket) => {
  
  // Notify all users of the new connection
  socket.on('join', (username) => {
    logger.info(`connection ${socket.id} ${username}`);

    // Join the available rooms
    socket.join('0');
    socket.join('1');
    socket.join('2');

    let payloadExisting = {
      "message": `${username} has joined the server.`
    };

    let payloadNew = {
      "message": `Welcome to the server ${username}!`
    };

    // Send welcome message to existing connections
    socket.broadcast.emit('server message all', payloadExisting);
    // Send welcome message to new connection
    socket.emit('server message all', payloadNew);

    global.users[socket.id] = username;
  });

  // Notify all users of the disconnection
  socket.on('disconnecting', () => {
    logger.info(`disconnection ${socket.id} ${global.users[socket.id]}`);

    // Leave the available rooms
    socket.leave('0');
    socket.leave('1');
    socket.leave('2');

    let payloadExisting = {
      "message": `${global.users[socket.id]} has left the server.`
    };

    socket.broadcast.emit('server message all', payloadExisting);
    delete global.users[socket.id];
  });

  // Send the message to all users or send a message from the server to the user
  socket.on('chat message', (msgObject) => {
    let msg = msgObject.message;
    let roomName = msgObject.index;
    let roomId = msgObject.id;

    logger.info(`message ${global.users[socket.id]}: ${msg} `);

    let helpers = new Helpers();

    let payload = {
      "roomIndex": roomName,
      "roomId": roomId,
      "username": global.users[socket.id]
    };

    if (msg.toString().length > 280) {
      payload.message = 'Sorry, your message was too long to send.';
      socket.emit('server message', payload);

    } else if (helpers.isCommand(msg.toString())) {
      payload.message = helpers.doCommand(msg.toString(), global.users);
      socket.emit('server message', payload);

    } else {
      payload.message = msg;
      socket.to(payload.roomIndex).broadcast.emit('chat message', payload);
    }

  });

});

http.listen(3000, () => {
  console.log('listening on *:3000');
});