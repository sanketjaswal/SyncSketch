import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { addUser } from "./utils/users.js";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"],
  },
});
app.get("/", (req, res) => {
  res.send("This is a real-time application using Socket.IO");
});

let roomData = {}; // Store elements data for each room

io.on("connection", (socket) => {
  console.log("User Connected");

  socket.on("userJoined", (data) => {
    const { roomId, name, userId, host, presenter } = data;
    socket.join(roomId);
    const users = addUser({name, userId, roomId, host, presenter})
    socket.broadcast.to(roomId).emit("allUsers", users)
    socket.emit("userIsJoined", { success: true, users });

    // Send the previous whiteboard data to the newly joined user
    if (roomData[roomId]) {
      socket.emit("whiteboardDataResponse", { elements: roomData[roomId] });
    }
  });

  socket.on("whiteboardData", (data) => {
    const roomId = Array.from(socket.rooms)[1]; // Get the room the user is in
    roomData[roomId] = data.elements; // Update elements for the room
    socket.broadcast.to(roomId).emit("whiteboardDataResponse", data); // Broadcast to others in the room
  });

  socket.on("message", (data) => {
    if (!data) return;
    const {message, userId, roomId} = data;
    console.log("message :-", message, userId, roomId);
    // socket.broadcast.to(roomId).emit("messageResponse", {message, userName});
    io.to(roomId).emit("messageResponse", { message, userId: userId }); 
  })

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const port = process.env.PORT || 5000;
httpServer.listen(port, () => console.log(`Server is running on PORT ${port}`));
