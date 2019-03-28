const socket = io();

$(function () {
  let commands;
  
  $.get('/commands', (body) => {
    commands = new Set(body.commands);
  })

  $('form').submit(function(e){
    e.preventDefault();

    let message = $('#message').val()

    socket.emit('chat message', message);

    if (commands.has(message)) {
      // pass
    } else if (message.length <= 255) {
      
      $('#user-messages').append(`<li class="outgoing-message message shadow-sm">
                                  <span class="username-span">You:</span>
                                  <span class="user-message-span">${message}</span>
                                  <span class="date-time-span">${new Date().toLocaleTimeString()}</span>
                                  </li>`);
      $('#user-messages').scrollTop($('#user-messages')[0].scrollHeight);
    }
    $('#message').val('');
    $('#notice').text('Character limit: 0 / 280');
    return false;
  });

  // Submit the for when the send button is pressed
  $('#submit-button').click(function() {
    $('form').submit();
  });

  // Handle a chat message from another user
  socket.on('chat message', function(msg){
    $('#user-messages').append(`<li class="incomming-message message shadow-sm">
                                <span class="username-span">${msg['username']}:</span>
                                <span class="user-message-span">${msg['message']}</span>
                                <span class="date-time-span">${new Date().toLocaleTimeString()}</span>
                                </li>`);
    $('#user-messages').scrollTop($('#user-messages')[0].scrollHeight);
  });

  // Handle a message from the server
  socket.on('server message', function(msg){
    $('#user-messages').append($('<li class="server-message message shadow-sm text-muted">').text(msg));
    $('#user-messages').scrollTop($('#user-messages')[0].scrollHeight);
  });
});