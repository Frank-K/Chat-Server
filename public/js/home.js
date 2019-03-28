$(function () {  
  
  // Update charater limit message
  $('#message').on('input', function(){
    let size = $('#message').val().length;
    $('#notice').text(`Character limit: ${size} / 280`);
  });

  // Popup when user first visits the site
  Swal.fire({
    title: 'Enter your name',
    input: 'text',
    showCancelButton: false,
    allowOutsideClick: false,
    inputValidator: (value) => {
      if (!value) {
        return 'You need to choose a username!'
      }
    }
  }).then((value) => {
    // Emit the username to the server
    socket.emit('join', value.value);
  })

});