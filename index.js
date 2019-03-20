const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');

// Register public folder for js and css
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/home.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    if (msg.toString().length > 280) {
      socket.emit('server message', "Sorry, your message was too long to send.")
    } else {
      socket.broadcast.emit('chat message', msg);
    }
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});