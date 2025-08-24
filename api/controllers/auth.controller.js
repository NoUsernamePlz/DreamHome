import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

export const register = async(req,res)=>{
    const {username, email, password}= req.body;
   
   try{
    //hash the password
    const hashedPassword = await bcrypt.hashSync(password,10); 
    console.log(hashedPassword);   

    //create a user and save to db
    const newUser = await prisma.user.create({
        data:{
            username,
            email,
            password:hashedPassword,
        }
    });

    console.log(newUser);
    res.status(201).json({message:"User registered successfully"});
}catch(error){
    console.log(error);
    res.status(500).json({error:"Failed to create user"});
}
};

export const login = async(req,res)=>{
    const {username,password} = req.body;

    try{
        //find the user by email
        const user = await prisma.user.findUnique({
            where:{username}
        });

        if(!user){
            return res.status(404).json({error:"User not found"});
        }

        //compare the password
        const isPasswordValid = await bcrypt.compare(password,user.password);
        if(!isPasswordValid){
            return res.status(401).json({error:"Invalid password"});
        }
        
        const token = jwt.sign({id:user.id}, process.env.JWT_SECRET_KEY,{expiresIn:"7d"});
        // res.setHeader("Set-cookie","test=" + "myValue").json("Login successful");
        res.cookie("token",token,{httpOnly:true,maxAge:24*60*60*1000*7,

        }).status(200).json("Login successful");

    }catch(error){
        console.log(error);
        res.status(500).json({error:"Failed to login!"});
    }
};

export const logout = (req, res)=>{
    res.clearCookie("token").status(200).json({message:"Logged out successfully"});
};