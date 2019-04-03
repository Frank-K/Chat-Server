const socket = io();

$(() => {
  // Get message commands from the server
  let commands;
  $.get("/commands", body => {
    commands = new Set(body.commands);
  });

  // Return the id and index of the current room the user is active in
  const getActiveRoom = () => {
    const rooms = $(".tab-content").children();

    for (let i = 0; i < rooms.length; i += 1) {
      const room = rooms[i];

      if ($(`#${room.id}`).hasClass("active")) {
        return { index: i.toString(), id: room.id };
      }
    }

    return { index: "0", id: rooms[0].id };
  };

  // Return an array ids of all rooms
  const getAllRooms = () => {
    const rooms = $(".tab-content").children();
    const arr = [];

    for (let i = 0; i < rooms.length; i += 1) {
      arr.push(rooms[i].id);
    }

    return arr;
  };

  // Show tooltip the first time the message container overflows
  let flag = 1;
  const newMessage = id => {
    if ($(`#${id}`).scrollTop() > 0 && flag) {
      flag = 0;
      $(".main").tooltip("show");

      setTimeout(() => {
        $(".main").tooltip("hide");
      }, 3000);
    }
  };

  $("form").submit(e => {
    e.preventDefault();

    const activeRoom = getActiveRoom();
    const message = $("#message").val();

    newMessage(activeRoom.id);

    socket.emit("chat message", {
      message,
      id: activeRoom.id,
      index: activeRoom.index
    });

    if (commands.has(message)) {
      // do nothing if the user sends a message command
    } else if (message.length <= 280) {
      $(`#${activeRoom.id}`)
        .append(`<li class="outgoing-message message shadow-sm">
                 <span class="username-span">You:</span>
                 <span class="user-message-span">${message}</span>
                 <span class="date-time-span">${new Date().toLocaleTimeString()}</span>
                 </li>`);
      $(`#${activeRoom.id}`).scrollTop($(`#${activeRoom.id}`)[0].scrollHeight);
    }

    $("#message").val("");
    $("#notice").text("Character limit: 0 / 280");
    return false;
  });

  // Submit the for when the send button is pressed
  $("#submit-button").click(() => {
    $("form").submit();
  });

  // Handle a chat message from another user
  socket.on("chat message", payload => {
    const id = payload.roomId;
    const { message, username } = payload;

    newMessage(id);

    $(`#${id}`).append(`<li class="incomming-message message shadow-sm">
                        <span class="username-span">${username}:</span>
                        <span class="user-message-span">${message}</span>
                        <span class="date-time-span">${new Date().toLocaleTimeString()}</span>
                        </li>`);
    $(`#${id}`).scrollTop($(`#${id}`)[0].scrollHeight);
  });

  // Handle a message from the server
  socket.on("server message", payload => {
    const { id, message } = payload;

    newMessage(id);

    $(`#${id}`).append(
      $('<li class="server-message message shadow-sm text-muted">').text(
        message
      )
    );
    $(`#${id}`).scrollTop($("#general")[0].scrollHeight);
  });

  // Handle a message from the server
  socket.on("server message all", payload => {
    const { message } = payload;
    const rooms = getAllRooms();

    for (let i = 0; i < rooms.length; i += 1) {
      newMessage(rooms[i]);
      $(`#${rooms[i]}`).append(
        $('<li class="server-message message shadow-sm text-muted">').text(
          message
        )
      );
      $(`#${rooms[i]}`).scrollTop($("#general")[0].scrollHeight);
    }
  });
});
