import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";
export const getUsers = async(req,res)=>{
    try{
        const users = await prisma.user.findMany();
        res.status(200).json(users);

    }catch(err){
        console.log(err);
        res.status(500).json({message:"Failed to get user!"});
    }
}


export const getUser = async(req,res)=>{
    try{
      
        const user = await prisma.user.findUnique({
            where:{
                id: req.params.id
            }
        });
        res.status(200).json(user);    
    }catch(err){
        res.status(500).json({message:"Failed to get user!"});
    }
}

export const updateUser = async(req,res)=>{
    const id = req.params.id;
    const tokenUserId = req.userId;
    const {password,avatar, ...inputs} = req.body;

    if(id !== tokenUserId){
        return res.status(403).json({message:"You can update only your account!"});
    }
    try{
        let hashedPassword;
        if(password){
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password,salt);
            inputs.password = hashedPassword;
        }
        const updateUser = await prisma.user.update({
            where:{id},
            data:{
                ...inputs,
                ...(hashedPassword && {password:hashedPassword}),
                ...(avatar && {avatar}),
            },
        });
         const {password:userPassword, ...rest} = updateUser;
         res.status(200).json(rest);
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Failed to update user!"});
    }
}

export const deleteUser = async(req,res)=>{
    const id = req.params.id;
    const tokenUserId = req.userId;
    if(id !== tokenUserId){
        return res.status(403).json({message:"You can delete only your account!"});
    }   
    try{
        await prisma.user.delete({
            where:{id}
        })

    }catch(err){
        console.log(err);
        res.status(500).json({message:"Failed to delete user!"});
    }
}



export const savePost = async (req, res) => {
  const { postId } = req.body;
  const tokenUserId = req.userId;

  if (!postId) return res.status(400).json({ message: "Post ID is required" });

  try {
    const postIdStr = String(postId);
    const userIdStr = String(tokenUserId);

    // Attempt to delete the saved post first
    const deleted = await prisma.savedPost.deleteMany({
      where: {
        userId: userIdStr,
        postId: postIdStr,
      },
    });

    if (deleted.count > 0) {
      // If a document was deleted → post was previously saved
      return res.status(200).json({ message: "Post removed from saved list", saved: false });
    } else {
      // If no document was deleted → post not saved yet, so save it
      await prisma.savedPost.create({
        data: {
          userId: userIdStr,
          postId: postIdStr,
        },
      });
      return res.status(200).json({ message: "Post saved", saved: true });
    }
  } catch (err) {
    console.error("Error in savePost:", err);
    return res.status(500).json({ message: "Failed to toggle saved post" });
  }
};





export const profilePosts = async (req, res) => {
  const tokenUserId = req.userId;
  try {
    const userPosts = await prisma.post.findMany({
      where: { userId: tokenUserId },
    });
    const saved = await prisma.savedPost.findMany({
      where: { userId: tokenUserId },
      include: {
        post: true,
      },
    });

    const savedPosts = saved.map((item) => item.post);
    res.status(200).json({ userPosts, savedPosts });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get profile posts!" });
  }
};

export const getNotificationNumber = async (req, res) => {
  const tokenUserId = req.userId;
  try {
    const number = await prisma.chat.count({
      where: {
        userIDs: {
          hasSome: [tokenUserId],
        },
        NOT: {
          seenBy: {
            hasSome: [tokenUserId],
          },
        },
      },
    });
    res.status(200).json(number);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get profile posts!" });
  }
};