// import { Server } from "socket.io";

// const io = new Server({
//   cors: {
//     origin: "http://localhost:5173",
//   },
// });

// let onlineUser = [];

// const addUser = (userId, socketId) => {
//   const userExits = onlineUser.find((user) => user.userId === userId);
//   if (!userExits) {
//     onlineUser.push({ userId, socketId });
//   }
// };

// const removeUser = (socketId) => {
//   onlineUser = onlineUser.filter((user) => user.socketId !== socketId);
// };

// const getUser = (userId) => {
//   return onlineUser.find((user) => user.userId === userId);
// };

// io.on("connection", (socket) => {
//   socket.on("newUser", (userId) => {
//     addUser(userId, socket.id);
//   });

//   socket.on("sendMessage", ({ receiverId, data }) => {
//     const receiver = getUser(receiverId);
//     io.to(receiver.socketId).emit("getMessage", data);
//   });

//   socket.on("disconnect", () => {
//     removeUser(socket.id);
//   });
// });

// io.listen("4000");





import { Server } from "socket.io";
import prisma from "./lib/prisma.js"; // adjust path

const io = new Server({
  cors: {
    origin: "http://localhost:5173",
  },
});

let onlineUsers = [];

// track users
const addUser = (userId, socketId) => {
  if (!onlineUsers.some((u) => u.userId === userId)) {
    onlineUsers.push({ userId, socketId });
  }
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => onlineUsers.find((user) => user.userId === userId);

io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  // when a new user joins
  socket.on("newUser", (userId) => {
    addUser(userId, socket.id);
    console.log("📌 Online users:", onlineUsers);
  });

  // when a message is sent
  socket.on("sendMessage", async ({ chatId, senderId, receiverId, text }) => {
    try {
      // 1️⃣ Save message to DB
      const message = await prisma.message.create({
        data: {
          text,
          chatId,
          userId: senderId,
        },
        include: {
          user: { select: { id: true, username: true, avatar: true } },
        },
      });

      // 2️⃣ Update chat metadata
      await prisma.chat.update({
        where: { id: chatId },
        data: {
          lastMessage: text,
          seenBy: { set: [senderId] }, // sender has seen it
        },
      });

      // 3️⃣ Send to receiver if online
      const receiver = getUser(receiverId);
      if (receiver) {
        io.to(receiver.socketId).emit("getMessage", message);
      }

      // 4️⃣ Also echo back to sender (so UI updates instantly)
      io.to(socket.id).emit("getMessage", message);
    } catch (err) {
      console.error("❌ Error handling sendMessage:", err);
    }
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
    console.log("❌ User disconnected:", socket.id);
  });
});

io.listen(4000, () => console.log("🚀 Socket server running on port 4000"));
