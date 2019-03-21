$(function () {  
    $('#message').on('input', function(){
      let size = $('#message').val().length;
      $('#notice').text(`Character limit: ${size} / 280`);
    });

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
      socket.emit('join', value.value);
    })

  });