import {Server} from "socket.io";

function initSocketServer(httpserver) {
  const io = new Server(httpserver, {});

  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  return io;
}

export default initSocketServer;