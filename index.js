const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');

// Register public folder for js and css
app.use(express.static(path.join(__dirname, 'public')));

// Send the homepage of the chat app
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/home.html');
});

// Global users variable to keep track of current users
global.users = {};

io.on('connection', function(socket){
  
  // Notify all users of the new connection
  socket.on('join', function(username) {
    socket.broadcast.emit('server message', `${username} has joined the server.`);
    socket.emit('server message', `Welcome to the server ${username}!`);
    global.users[socket.id] = username;
  });

  // Notify all users of the disconnection
  socket.on('disconnecting', function() {
    socket.broadcast.emit('server message', `${global.users[socket.id]} has left the server.`);
    delete global.users[socket.id];
  });

  // Send the message to all users or send a message from the server to the user
  socket.on('chat message', function(msg){
    if (msg.toString().length > 280) {
      socket.emit('server message', 'Sorry, your message was too long to send.');
    } else if (msg.toString() === '/u') {
      socket.emit('server message', `There are ${Object.keys(global.users).length} user(s) online.`);
    } else {
      let payload = {'username': global.users[socket.id], 'message': msg}
      socket.broadcast.emit('chat message', payload);
    }
  });
  
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});