// controllers/messages.js
import prisma from "../lib/prisma.js";
import { io } from "../app.js"; // Import the io instance

export const addMessage = async (req, res) => {
  const tokenUserId = req.userId;
  const chatId = req.params.chatId;
  const text = req.body.text;

  if (!chatId || chatId === "null") {
    return res.status(400).json({ message: "Invalid chatId" });
  }

  try {
    // ensure chat exists and user is participant
    const chat = await prisma.chat.findFirst({
      where: { id: chatId, userIDs: { has: tokenUserId } },
    });

    if (!chat) return res.status(404).json({ message: "Chat not found!" });

    // Save message in DB
    const message = await prisma.message.create({
      data: { text, chatId, userId: tokenUserId },
      include: {
        user: { select: { id: true, username: true, avatar: true } },
      },
    });

    // Update chat meta
    await prisma.chat.update({
      where: { id: chatId },
      data: {
        seenBy: { push: tokenUserId },
        lastMessage: text,
      },
    });

    // Find the receiverId (the other participant)
    const receiverId = chat.userIDs.find((id) => id !== tokenUserId);

    // Build message payload to send via socket
    const messageData = {
      id: message.id,
      chatId,
      userId: tokenUserId,
      text,
      createdAt: message.createdAt,
      user: message.user,
    };

    // Emit to the receiver room and also to the sender's room
    if (receiverId) {
      io.to(receiverId).emit("getMessage", messageData);
    }
    io.to(tokenUserId).emit("getMessage", messageData); // send back to sender (all their sockets)

    // return the saved message to the HTTP client
    res.status(200).json(message);
  } catch (err) {
    console.error("Error in addMessage:", err);
    res.status(500).json({ message: "Failed to add message!" });
  }
};
