$(function () {  
  
  // Update charater limit message
  $('#message').on('input', function(){
    let size = $('#message').val().length;
    $('#notice').text(`Character limit: ${size} / 280`);
  });

  // Popup when user first visits the site
  Swal.fire({
    title: 'Enter your username',
    input: 'text',
    customClass: 'shadow',
    confirmButtonClass: 'shadow-sm',
    showCancelButton: false,
    allowOutsideClick: false,
    confirmButtonText: 'start chatting',
    confirmButtonColor: '#53ccfb',
    backdrop: 'rgba(122, 199, 228, 0.50)',
    background: '#f0f7ff',
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