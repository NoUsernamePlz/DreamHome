import { useContext, useEffect, useRef, useState } from "react";
import "./chat.scss";
import { AuthContext } from "../../context/AuthContext";
import { SocketContext } from "../../context/SocketContext";
import { format } from "timeago.js";
import apiRequest from "../../lib/apiRequest";
import { useNotificationStore } from "../../lib/notificationSrore";

function Chat({ chats }) {
  const [chat, setChat] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const messageEndRef = useRef();
  const decrease = useNotificationStore((state) => state.decrease);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  useEffect(() => {
    if (socket && currentUser) {
      socket.emit("addUser", currentUser.id);
    }
  }, [socket, currentUser]);

  const handleOpenChat = async (id, receiver) => {
    try {
      let res;
      if (id) {
        res = await apiRequest("/chats/" + id);
      } else {
        res = await apiRequest.post("/chats", { receiverId: receiver.id });
      }

      if (!res.data.seenBy?.includes(currentUser.id)) decrease();

      setChat({
        ...res.data,
        receiver,
        messages: res.data.messages || [],
      });
    } catch (err) {
      console.log(err);
    }
  };



const handleSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const text = formData.get("text");
  if (!text) return;

  try {
    const res = await apiRequest.post("/messages/" + chat.id, { text });

    const newMessage = {
      chatId: chat.id,
      userId: currentUser.id,
      text,
      createdAt: res.data.createdAt,
    };

    setChat((prev) => ({
      ...prev,
      messages: [...prev.messages, newMessage],
    }));

    socket.emit("sendMessage", {
      ...newMessage,
      receiverId: chat.receiver.id,
    });

    e.target.reset();
  } catch (err) {
    console.error("Failed to send message:", err);
  }
};




useEffect(() => {
  if (!socket) return;

  const handleMessage = (data) => {
    if (chat && chat.id === data.chatId && data.userId !== currentUser.id) {
      setChat((prev) => ({
        ...prev,
        messages: [...prev.messages, data],
      }));
    }
  };

  socket.on("getMessage", handleMessage);
  return () => {
    socket.off("getMessage", handleMessage);
  };
}, [socket, chat?.id, currentUser.id]);







return (
  <div className="chat">
    <div className="messages">
      <h1>Messages</h1>
      {chats
        ?.filter((c) => c.receiver.id !== currentUser.id) 
        .map((c) => (
          <div
            className="message"
            key={c.id || `chat-${c.userIDs.join("-")}`}
            style={{
              backgroundColor:
                c.seenBy.includes(currentUser.id) || chat?.id === c.id
                  ? "white"
                  : "hsl(124, 81%, 92%)",
            }}
            onClick={() => handleOpenChat(c.id, c.receiver)}
          >
            <img src={c.receiver.avatar || "/noavatar.jpg"} alt="" />
            <span>{c.receiver.username}</span>
            <p>{c.lastMessage || "No messages yet"}</p>
          </div>
        ))}
    </div>

    {chat && (
      <div className="chatBox">
        <div className="top">
          <div className="user">
            <img src={chat.receiver.avatar || "/noavatar.jpg"} alt="" />
            {chat.receiver.username}
          </div>
          <span className="close" onClick={() => setChat(null)}>
            X
          </span>
        </div>

        <div className="center">
          {chat.messages.map((msg, idx) => (
         <div
  key={msg.id || `${chat.id}-${idx}-${msg.userId}`}
  className="chatMessage"
  style={{
    alignSelf: msg.userId === currentUser.id ? "flex-end" : "flex-start",
    textAlign: msg.userId === currentUser.id ? "right" : "left",
    backgroundColor: msg.userId === currentUser.id ? "#43a047;" : "#f1f1f1", 
    borderRadius: "12px",
    padding: "8px 12px",
    margin: "4px 0",
    maxWidth: "70%",
  }}
>
  <p>{msg.text}</p>
  <span>{format(msg.createdAt)}</span>
</div>

          ))}
          <div ref={messageEndRef}></div>
        </div>

        <form onSubmit={handleSubmit} className="bottom">
          <textarea name="text" placeholder="Type a message..."></textarea>
          <button type="submit">Send</button>
        </form>
      </div>
    )}
  </div>
);

}

export default Chat;
