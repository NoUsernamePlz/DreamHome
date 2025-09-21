// import express from "express";
// import cookieParser from "cookie-parser";
// import authRoute from "./routes/auth.routes.js";
// import cors from "cors";
// import dotenv from "dotenv";
// import testRoute from "./routes/test.routes.js";
// import userRoute from "./routes/user.routes.js";
// import postRoute from "./routes/post.routes.js";
// import chatRoute from "./routes/chat.routes.js";
// import messageRoute from "./routes/message.routes.js";
// dotenv.config();   


// const app = express();


// const PORT = process.env.PORT || 5000;  

// app.use(cors({
//     origin: process.env.CLIENT_URL,
//     credentials:true,
// }));
// app.use(express.json());
// app.use(cookieParser());

// app.use("/api/auth",authRoute);
// app.use("/api/test",testRoute);
// app.use("/api/users",userRoute);
// app.use("/api/posts",postRoute);
// app.use("/api/chats",chatRoute);
// app.use("/api/messages", messageRoute);

// app.listen(PORT,()=>{
//     console.log("Server is running on port + PORT");    
// })


import express from "express";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.routes.js";
import cors from "cors";
import dotenv from "dotenv";
import testRoute from "./routes/test.routes.js";
import userRoute from "./routes/user.routes.js";
import postRoute from "./routes/post.routes.js";
import chatRoute from "./routes/chat.routes.js";
import messageRoute from "./routes/message.routes.js";

import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL, // e.g. "http://localhost:5173"
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoute);
app.use("/api/test", testRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

// --- SOCKET.IO SETUP ---
// const server = createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: process.env.CLIENT_URL,
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });

// let onlineUsers = [];

// const addUser = (userId, socketId) => {
//   if (!onlineUsers.find((user) => user.userId === userId)) {
//     onlineUsers.push({ userId, socketId });
//   }
// };

// const removeUser = (socketId) => {
//   onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
// };

// const getUser = (userId) => onlineUsers.find((user) => user.userId === userId);

// io.on("connection", (socket) => {
//   console.log("User connected:", socket.id);

//   // Register new user
//   socket.on("newUser", (userId) => {
//     addUser(userId, socket.id);
//     console.log("Online Users:", onlineUsers);
//     io.emit("getUsers", onlineUsers);
//   });

//   // Handle messages
//   socket.on("sendMessage", ({ senderId, receiverId, text }) => {
//     const receiver = getUser(receiverId);
//     if (receiver) {
//       io.to(receiver.socketId).emit("getMessage", { senderId, text });
//     }
//   });

//   // On disconnect
//   socket.on("disconnect", () => {
//     removeUser(socket.id);
//     io.emit("getUsers", onlineUsers);
//     console.log("User disconnected:", socket.id);
//   });
// });

// // Start server + socket together
// server.listen(PORT, () => {
//   console.log(`Server with Socket.IO running on port ${PORT}`);
// });





// socket.js (or wherever you have your socket server)



const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Track online users if you want (still optional)
let onlineUsers = [];

// addUser: keep record (optional)
const addUser = (userId, socketId) => {
  if (!onlineUsers.find((u) => u.userId === userId)) {
    onlineUsers.push({ userId, socketId });
  }
};

// remove user on disconnect (optional)
const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((u) => u.socketId !== socketId);
};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // When a client tells server who they are, join a room with their userId
  socket.on("addUser", (userId) => {
    socket.join(userId);            // <--- important: socket joins a room named userId
    addUser(userId, socket.id);
    io.emit("getUsers", onlineUsers); // still optional
    console.log("addUser:", userId, "socket:", socket.id);
  });


socket.on("sendMessage", ({ chatId, senderId, receiverId, text, createdAt }) => {
  const messageData = {
    chatId,
    userId: senderId,
    text,
    createdAt,
  };


  io.to(senderId).emit("getMessage", messageData);
  io.to(receiverId).emit("getMessage", messageData);
});



  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    removeUser(socket.id);
    io.emit("getUsers", onlineUsers);
  });
});

server.listen(5000, () => console.log("Socket server running on port 5000"));


export { io };
export default server;
