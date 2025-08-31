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


// export const getUser = async(req,res)=>{
//     try{
      
//         const user = await prisma.user.findUnique({
//             where:{
//                 id: req.params.id
//             }
//         });
//         res.status(200).json(user);    
//     }catch(err){
//         res.status(500).json({message:"Failed to get user!"});
//     }
// }

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
  const postId = req.body.postId;
  const tokenUserId = req.userId;

  try {
    const savedPost = await prisma.savedPost.findUnique({
      where: {
        userId_postId: {
          userId: tokenUserId,
          postId,
        },
      },
    });

    if (savedPost) {
      await prisma.savedPost.delete({
        where: {
          id: savedPost.id,
        },
      });
      res.status(200).json({ message: "Post removed from saved list" });
    } else {
      await prisma.savedPost.create({
        data: {
          userId: tokenUserId,
          postId,
        },
      });
      res.status(200).json({ message: "Post saved" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to delete users!" });
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