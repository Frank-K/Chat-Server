const socket = io();

$(function () {
  $('form').submit(function(e){
    e.preventDefault(); // prevents page reloading
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

  $('#submit-button').click(function() {
    $('form').submit();
  });

  socket.on('chat message', function(msg){
    $('#user-messages').append(`<li class="incomming-message message shadow-sm"><span class="username-span">${msg['username']}:</span><span class="user-message-span">${msg['message']}</span>`);
    $('#user-messages').scrollTop($('#user-messages')[0].scrollHeight);
  });

  socket.on('server message', function(msg){
    $('#user-messages').append($('<li class="server-message message shadow-sm text-muted">').text(msg));
    $('#user-messages').scrollTop($('#user-messages')[0].scrollHeight);
  });
});