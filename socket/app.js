import {server} from "socket.io"

const io = new Server({
    cors:{
      origin:"http://localhost:5173",  
    },
});

io.on("connection", (socket)=>{
    socket.on("test",(data)=>{
        console.log(data)
    })
    console.log(socket.id);
});

io.listen("4000")