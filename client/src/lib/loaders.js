import { defer } from "react-router-dom";
import apiRequest from "./apiRequest";

export const singlePageLoader = async({request,params})=>{
    const res = await apiRequest("/posts/"+ params.id);
    return res.data;
}

export const listPageLoader = async({request,params})=>{
    const query = request.url.split("?")[1]
    const postPromise = await apiRequest("/posts?"+ query);
    return defer({
        postResponse:postPromise,
    });
};

// export const profilePageLoader = async () => {
//   const postPromise = apiRequest("/users/profilePosts");
//   const chatPromise = apiRequest("/chats");
//   const usersPromise = apiRequest("/users"); 

//   return defer({
//     postResponse: postPromise,
//     chatResponse: chatPromise,
//     usersResponse: usersPromise, 
//   });
// };


// export const profilePageLoader = async () => {
//   const postPromise = apiRequest("/users/profilePosts");
//   const chatPromise = apiRequest("/chats");
//   const usersPromise = apiRequest("/users");

//   const chatResponse = chatPromise.then((res) =>
//     res.data.map((chat) => ({
//       ...chat,
//       id: chat.id || chat.receiver?.id,
//       lastMessage: chat.lastMessage || "No messages yet",
//       seenBy: chat.seenBy || [],
//     }))
//   );

//   return defer({
//     postResponse: postPromise,
//     chatResponse,
//     usersResponse: usersPromise,
//   });
// };



// export const profilePageLoader = async () => {
//   const postPromise = apiRequest("/users/profilePosts");
//   const chatPromise = apiRequest("/chats"); // combined chats
//   const chatResponse = chatPromise.then((res) => res.data);

//   return defer({
//     postResponse: postPromise,
//     chatResponse,
//   });
// };




// export const profilePageLoader = async () => {
//   const chatPromise = apiRequest("/chats"); 
//   const usersPromise = apiRequest("/users"); 
//   const postPromise = apiRequest("/users/profilePosts"); 

//   const chatResponse = chatPromise.then((res) => res.data);
//   const usersResponse = usersPromise.then((res) => res.data);
//   const postResponse = postPromise.then((res) => res.data);


//   const combinedChats = Promise.all([chatResponse, usersResponse]).then(
//     ([chats, users]) => {
//       const currentUserId = localStorage.getItem("currentUserId");

//       return users
//         .filter((u) => u.id !== currentUserId) 
//         .map((user) => {
  
//           let chat = chats.find((c) => c.userIDs.includes(user.id));

//           if (!chat) {
//             chat = {
//               id: null,
//               userIDs: [currentUserId, user.id],
//               lastMessage: "No messages yet",
//               seenBy: [],
//               messages: [],
//             };
//           }

//           return {
//             ...chat,
//             receiver: user,
//           };
//         });
//     }
//   );

//   return defer({
//     chatResponse: combinedChats,
//     postResponse, 
//   });
// };



export const profilePageLoader = async () => {
  try {
    const chatPromise = apiRequest("/chats").then(res => res.data);
    const usersPromise = apiRequest("/users").then(res => res.data);
    const postPromise = apiRequest("/users/profilePosts").then(res => res.data);

    const combinedChats = Promise.all([chatPromise, usersPromise]).then(
      ([chats, users]) => {
        const currentUserId = localStorage.getItem("currentUserId");
        return users
          .filter(u => u.id !== currentUserId)
          .map(user => {
            let chat = chats.find(c => c.userIDs.includes(user.id));
            if (!chat) {
              chat = {
                id: null,
                userIDs: [currentUserId, user.id],
                lastMessage: "No messages yet",
                seenBy: [],
                messages: [],
              };
            }
            return { ...chat, receiver: user };
          });
      }
    );

    return defer({
      chatResponse: combinedChats,
      userPosts: postPromise.then(data => data.userPosts),
      savedPosts: postPromise.then(data => data.savedPosts),
    });
  } catch (err) {
    console.error("Loader error:", err);
    return defer({
      chatResponse: [],
      userPosts: [],
      savedPosts: [],
    });
  }
};
