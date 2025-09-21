// import { createContext, useContext, useEffect, useState } from "react";
// import { io } from "socket.io-client";
// import { AuthContext } from "./AuthContext";

// export const SocketContext = createContext();

// export const SocketContextProvider = ({ children }) => {
//   const { currentUser } = useContext(AuthContext);
//   const [socket, setSocket] = useState(null);

//   useEffect(() => {
//     setSocket(io("http://localhost:4000"));
//   }, []);

//   useEffect(() => {
//   currentUser && socket?.emit("newUser", currentUser.id);
//   }, [currentUser, socket]);

//   return (
//     <SocketContext.Provider value={{ socket }}>
//       {children}
//     </SocketContext.Provider>
//   );
// };



import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

export const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (currentUser) {
      // connect when user logs in
      const newSocket = io("http://localhost:5000");
      newSocket.emit("newUser", currentUser.id);
      setSocket(newSocket);

      return () => {
        newSocket.disconnect(); // cleanup on logout/unmount
      };
    } else {
      // if no user, reset socket
      setSocket(null);
    }
  }, [currentUser]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
