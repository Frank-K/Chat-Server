const socket = io();

$(function () {
  $('form').submit(function(e){
    e.preventDefault();
    socket.emit('chat message', $('#message').val());

    if ($('#message').val() == '/u') {
      // pass
    } else if ($('#message').val().length <= 255) {
      $('#user-messages').append($('<li class="outgoing-message message shadow-sm">').text($('#message').val()));
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
    $('#user-messages').append(`<li class="incomming-message message shadow-sm"><span class="username-span">${msg['username']}:</span><span class="user-message-span">${msg['message']}</span>`);
    $('#user-messages').scrollTop($('#user-messages')[0].scrollHeight);
  });

  // Handle a message from the server
  socket.on('server message', function(msg){
    $('#user-messages').append($('<li class="server-message message shadow-sm text-muted">').text(msg));
    $('#user-messages').scrollTop($('#user-messages')[0].scrollHeight);
  });
});