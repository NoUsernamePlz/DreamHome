import express from "express";
import { deleteUser, getUser, getUsers, updateUsers } from "../controllers/user.controller";
import { verifyToken } from "../middleware/verifyToken";

const router = express.Router();    

router.get("/",verifyToken, getUsers);  
router.get("/:id", verifyToken, getUser);
router.put("/:id",verifyToken, updateUsers);      
router.delete("/:id",verifyToken, deleteUser); 


export default router;
