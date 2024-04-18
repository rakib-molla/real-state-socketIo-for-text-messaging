import { Server } from 'socket.io';

const io = new Server({
   cors:{
      origin: "http://localhost:5173",
   },
});

let onlineUser = [];

const addUser = (userId, socketId)=>{
   const userExist = onlineUser.find((user)=> user.userId === userId);
   if(!userExist){
      onlineUser.push({userId, socketId});
   }
}

const removeUser =(socketId)=>{
   onlineUser = onlineUser.filter((user)=> user.socketId !== socketId);
};

const getUser = (userId)=>{
   return onlineUser.find((user)=> user.userId === userId);
}

io.on("connection", (socket)=>{
   // console.log(socket.id);

   socket.on("newUser", (userId)=>{
      addUser(userId, socket.id);
      console.log(onlineUser);
   });

   socket.on("sendMessage", ({ receiverId, data }) => {
      // console.log(data);
      const receiver = getUser(receiverId);
      io.to(receiver.socketId).emit("getMessage", data);
    });

   //disconnect 
   socket.on("disconnect", ()=>{
      removeUser(socket.id);
   });

})

io.listen("4000")