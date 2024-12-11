(function () {
  const socket = new WebSocket("ws://localhost:3000/live-reload");
  socket.onmessage = function (msg) {
    if (msg.data === 'live-reload') {
      location.reload()
    }
  };
})();
