const Commands = require("./commands.js");

/**
 * Function executed when the join event is received
 * @param {Object} socket - socket.io socket object
 * @param {Object} logger - winston logger object
 * @param {string} username - the name of the user that is joining
 * @returns {Null}
 */
const onJoin = (socket, logger, username) => {
  logger.info(`connection ${socket.id} ${username}`);

  // Join the available rooms
  socket.join("0");
  socket.join("1");
  socket.join("2");

  const payloadExisting = {
    message: `${username} has joined the server.`
  };

  const payloadNew = {
    message: `Welcome to the server ${username}!`
  };

  // Send welcome message to existing connections
  socket.broadcast.emit("server message all", payloadExisting);
  // Send welcome message to new connection
  socket.emit("server message all", payloadNew);

  global.users[socket.id] = username;
};

/**
 * Function executed when the disconnecting event is received
 * @param {Object} socket - socket.io socket object
 * @param {Object} logger - winston logger object
 * @returns {Null}
 */
const onDisconnecting = (socket, logger) => {
  logger.info(`disconnection ${socket.id} ${global.users[socket.id]}`);

  // Leave the available rooms
  socket.leave("0");
  socket.leave("1");
  socket.leave("2");

  const payloadExisting = {
    message: `${global.users[socket.id]} has left the server.`
  };

  socket.broadcast.emit("server message all", payloadExisting);
  delete global.users[socket.id];
};

/**
 * Function executed when the chat message event is received
 * @param {Object} socket - socket.io socket object
 * @param {Object} logger - winston logger object
 * @param {Object} msgObject - message object from the front end
 * @param {String} msgObject.message - the message the user sent
 * @param {String} msgObject.index - the index of the channel on the front end
 * @param {String} msgObject.id - the id of the chat element on the front end
 * @returns {Null}
 */
const onChatMessage = (socket, logger, msgObject) => {
  const msg = msgObject.message;
  const roomName = msgObject.index;
  const roomId = msgObject.id;

  logger.info(`message ${global.users[socket.id]}: ${msg} `);

  const commands = new Commands();

  const payload = {
    roomIndex: roomName,
    roomId,
    username: global.users[socket.id]
  };

  if (msg.toString().length > 280) {
    payload.message = "Sorry, your message was too long to send.";
    socket.emit("server message", payload);
  } else if (commands.isCommand(msg.toString())) {
    payload.message = commands.doCommand(msg.toString(), global.users);
    socket.emit("server message", payload);
  } else {
    payload.message = msg;
    socket.to(payload.roomIndex).broadcast.emit("chat message", payload);
  }
};

module.exports = { onJoin, onDisconnecting, onChatMessage };
