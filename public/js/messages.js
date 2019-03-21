$(function () {
  const socket = io();
  
  $('form').submit(function(e){
    e.preventDefault(); // prevents page reloading
    socket.emit('chat message', $('#message').val());

    if ($('#message').val().length <= 255) {
      $('#user-messages').append($('<li class="outgoing-message message shadow-sm">').text($('#message').val()));
    }
    $('#message').val('');
    return false;
  });

  $('#submit-button').click(function() {
    $('form').submit();
  });

  socket.on('chat message', function(msg){
    $('#user-messages').append($('<li class="incomming-message message shadow-sm">').text(msg));
    $('#user-messages').scrollTop($('#user-messages')[0].scrollHeight);
  });

  socket.on('server message', function(msg){
    $('#user-messages').append($('<li class="server-message message shadow-sm text-muted">').text(msg));
    $('#user-messages').scrollTop($('#user-messages')[0].scrollHeight);
  });

  $('#message').on('input', function(){
    let size = $('#message').val().length;
    $('#notice').text(`Character limit: ${size} / 280`);
  });
});