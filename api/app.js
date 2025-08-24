import express from "express";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.routes.js";
import cors from "cors";
import dotenv from "dotenv";
import testRoute from "./routes/test.routes.js";
dotenv.config();   


const app = express();


const PORT = process.env.PORT || 5000;  

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials:true,
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",authRoute);
app.use("/api/test",testRoute);



app.listen(PORT,()=>{
    console.log("Server is running on port + PORT");    
})