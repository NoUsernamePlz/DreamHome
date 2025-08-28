import bcrypt from "bcryptjs";
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
        if(password){
            const hashedPassword = await bcrypt.hash(password,process.env.SALT );
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