$(() => {
  // Update charater limit message
  $("#message").on("input", () => {
    const size = $("#message").val().length;
    $("#notice").text(`Character limit: ${size} / 280`);
  });

  $(".help-button").on("click", () => {
    Swal.fire({
      type: "info",
      title: "Here are some helpful commands",
      html:
        "<b>/u</b> to see the number of online users<br/>" +
        "<b>/a</b> to see the usernames of online users<br/>" +
        "<b>/h</b> to see this message in the chat",
      customClass: "shadow",
      confirmButtonClass: "shadow-sm",
      confirmButtonColor: "#53ccfb",
      backdrop: "rgba(122, 199, 228, 0.50)",
      background: "#f0f7ff"
    });
  });

  // Popup when user first visits the site
  Swal.fire({
    title: "Enter your username",
    input: "text",
    customClass: "shadow",
    confirmButtonClass: "shadow-sm",
    showCancelButton: false,
    allowOutsideClick: false,
    confirmButtonText: "start chatting",
    confirmButtonColor: "#53ccfb",
    backdrop: "rgba(122, 199, 228, 0.50)",
    background: "#f0f7ff",
    inputValidator: value => {
      if (!value) {
        return "You need to choose a username!";
      }

      return "";
    }
  }).then(value => {
    // Emit the username to the server
    socket.emit("join", value.value);
  });

  $(".close").on("click", e => {
    const object = e.currentTarget;
    const room = $(object).attr("data-room-index");

    $(object)
      .parent()
      .append(
        `<a class="nav-link undo" data-room-index="${room}"><i class="fas fa-undo"></i></a>`
      );

    $(object).hide();
    $($(object).siblings()[0]).hide();

    socket.emit("leave room", room);
  });

  $(".nav-tabs").on("click", ".undo", e => {
    const object = e.currentTarget;
    const room = $(object).attr("data-room-index");

    $($(object).siblings()[0]).show();
    $($(object).siblings()[1]).show();

    $(object).remove();

    socket.emit("join room", room);
  });

  // Change icon on tab when the tab is clicked
  $(".nav-item").on("click", e => {
    const object = e.currentTarget;
    const icon = $(object).find(".far")[0];

    if ($(icon).hasClass("fa-comment-dots")) {
      $(icon).removeClass("fa-comment-dots");
      $(icon).addClass("fa-comment");
    }
  });

  $(".volume").on("click", e => {
    const object = e.currentTarget;
    const icon = $(object).find(".fas")[0];

    if ($(icon).hasClass("fa-volume-up")) {
      $(icon).removeClass("fa-volume-up")
      $(icon).addClass("fa-volume-mute")
    } else if ($(icon).hasClass("fa-volume-mute")) {
      $(icon).removeClass("fa-volume-mute")
      $(icon).addClass("fa-volume-up")
    }
  })
});
