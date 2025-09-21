import prisma from "../lib/prisma.js";

// export const getChats = async (req, res) => {
//   const tokenUserId = req.userId;

//   try {
//     // 1. Get all users except the logged-in user
//     const users = await prisma.user.findMany({
//       where: {
//         id: { not: tokenUserId },
//       },
//       select: {
//         id: true,
//         username: true,
//         avatar: true,
//       },
//     });

//     // 2. Get all chats that the logged-in user is part of
//     const chats = await prisma.chat.findMany({
//       where: {
//         userIDs: {
//           hasSome: [tokenUserId],
//         },
//       },
//     });

//     // 3. Map users to chats (existing or new placeholder)
//     const userChats = await Promise.all(
//       users.map(async (user) => {
//         let chat = chats.find((c) => c.userIDs.includes(user.id));

//         if (!chat) {
//           // Create a "virtual" chat object (not stored yet)
//           chat = {
//             id: null,
//             userIDs: [tokenUserId, user.id],
//             lastMessage: null,
//             seenBy: [],
//           };
//         }

//         return {
//           ...chat,
//           receiver: user,
//         };
//       })
//     );

//     res.status(200).json(userChats);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Failed to get chats!" });
//   }
// };




// export const getChats = async (req, res) => {
//   const tokenUserId = req.userId;

//   try {
//     // Get all users except the current user
//     const users = await prisma.user.findMany({
//       where: { id: { not: tokenUserId } },
//       select: { id: true, username: true, avatar: true },
//     });

//     // Get all chats that include the current user
//     const chats = await prisma.chat.findMany({
//       where: { userIDs: { hasSome: [tokenUserId] } },
//       include: { messages: { orderBy: { createdAt: "asc" } } },
//     });

//     // Map users to chats (existing or virtual)
//     const userChats = users.map((user) => {
//       let chat = chats.find((c) => c.userIDs.includes(user.id));

//       if (!chat) {
//         // Virtual chat
//         chat = {
//           id: null,
//           userIDs: [tokenUserId, user.id],
//           lastMessage: null,
//           seenBy: [],
//           messages: [],
//         };
//       }

//       return { ...chat, receiver: user };
//     });

//     res.status(200).json(userChats);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Failed to get chats!" });
//   }
// };


// export const getChat = async (req, res) => {
//   const tokenUserId = req.userId;

//   try {
//     const chat = await prisma.chat.findUnique({
//       where: {
//         id: req.params.id,
//         userIDs: {
//           hasSome: [tokenUserId],
//         },
//       },
//       include: {
//         messages: {
//           orderBy: {
//             createdAt: "asc",
//           },
//         },
//       },
//     });

//     if (chat) {
//       await prisma.chat.update({
//         where: {
//           id: req.params.id,
//         },
//         data: {
//           seenBy: {
//             push: [tokenUserId],
//           },
//         },
//       });
//     }

//     res.status(200).json(chat);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Failed to get chat!" });
//   }
// };

// export const addChat = async (req, res) => {
//   const tokenUserId = req.userId;
//   try {
//     const newChat = await prisma.chat.create({
//       data: {
//         userIDs: [tokenUserId, req.body.receiverId],
//       },
//     });
//     res.status(200).json(newChat);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Failed to add chat!" });
//   }
// };

// export const readChat = async (req, res) => {
//   const tokenUserId = req.userId;

//   try {
//     const chat = await prisma.chat.update({
//       where: {
//         id: req.params.id,
//         userIDs: {
//           hasSome: [tokenUserId],
//         },
//       },
//       data: {
//         seenBy: {
//           set: [tokenUserId],
//         },
//       },
//     });
//     res.status(200).json(chat);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Failed to read chat!" });
//   }
// };





// Get all chats + other users for messaging
export const getChats = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    // 1. Get all users except the logged-in user
    const users = await prisma.user.findMany({
      where: { id: { not: tokenUserId } },
      select: { id: true, username: true, avatar: true },
    });

    // 2. Get all chats that include the logged-in user
    const chats = await prisma.chat.findMany({
      where: { userIDs: { has: tokenUserId } },
      include: {
        messages: { orderBy: { createdAt: "desc" }, take: 1 }, // last message
      },
    });

    // 3. Map users to chats (existing or virtual)
    const userChats = users.map((user) => {
      const chat = chats.find((c) => c.userIDs.includes(user.id));

      return {
        id: chat ? chat.id : null,
        userIDs: [tokenUserId, user.id],
        lastMessage: chat?.messages[0]?.text || "No messages yet",
        seenBy: chat?.seenBy || [],
        receiver: user,
      };
    });

    res.status(200).json(userChats);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get chats!" });
  }
};

// Get single chat by ID
export const getChat = async (req, res) => {
  const tokenUserId = req.userId;
  try {
    const chat = await prisma.chat.findUnique({
      where: { id: req.params.id },
      include: { messages: { orderBy: { createdAt: "asc" } } },
    });

    if (!chat) return res.status(404).json({ message: "Chat not found!" });

    if (!chat.seenBy.includes(tokenUserId)) {
      await prisma.chat.update({
        where: { id: req.params.id },
        data: { seenBy: { push: tokenUserId } },
      });
    }

    res.status(200).json(chat);
  } catch (err) {
    console.error("Error in getChat:", err);
    res.status(500).json({ message: "Failed to get chat!" });
  }
};


// Create a new chat if not exists
export const addChat = async (req, res) => {
  const tokenUserId = req.userId;
  const { receiverId } = req.body;

  try {
    // Check if chat already exists
    let chat = await prisma.chat.findFirst({
      where: {
        AND: [
          { userIDs: { has: tokenUserId } },
          { userIDs: { has: receiverId } },
        ],
      },
    });

    if (!chat) {
      chat = await prisma.chat.create({
        data: { userIDs: [tokenUserId, receiverId] },
      });
    }

    res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to add chat!" });
  }
};

// Mark chat as read
export const readChat = async (req, res) => {
  const tokenUserId = req.userId;
  try {
    const chat = await prisma.chat.update({
      where: { id: req.params.id },
      data: { seenBy: { push: [tokenUserId] } },
    });
    res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to read chat!" });
  }
};
