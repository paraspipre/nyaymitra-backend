const express = require("express");
const morgan = require('morgan')
const cors = require("cors");
const http = require("http");
const cookieParser = require('cookie-parser')
const mongoose = require("mongoose");
const socket = require("socket.io");
require("dotenv").config();


//models
const User = require("./models/userModel")

//Routes
const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/user")
const lawyerRoutes = require("./routes/lawyer")
const messagesRoutes = require("./routes/messages")
const postRoutes = require("./routes/post");
const { ExpressPeerServer } = require("peer");

//app
const app = express();

//
app.use(cors({ origin: '*' }));
app.use(morgan('dev'))
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())

//database
mongoose.set("strictQuery", false)
mongoose.connect(process.env.MONGO_URL, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
})
   .then(() => {
      console.log("DB Connetion Successfull");
   })
   .catch((err) => {
      console.log(err.message);
   });

//
app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/lawyer", lawyerRoutes)
app.use("/api/messages", messagesRoutes)
app.use("/api/post", postRoutes)

const server = http.createServer(app);
const io = socket(server, {
   cors: true
});

global.onlineUsers = []
global.onlineVideoUsers = []

const addNewUser = (id, socketId) => {
   !onlineUsers.some((user) => user.id === id) &&
      onlineUsers.push({ id, socketId })
}

const removeUser = (socketId) => {
   onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId)
}

const getUser = (id) => {
   return onlineUsers.find((user) => user.id === id)
}


io.on("connection", (socket) => {
   console.log("user connnected", socket.id)
   
   socket.on("newUser", (id) => {
      addNewUser(id, socket.id)
      console.log(onlineUsers, "onlineUser")
   })
   // console.log(onlineVideoUsers, "onlineVideoUser")
   
   // socket.on("room:join", (data) => {
   //    const { email, room } = data;
   //    emailToSocketIdMap.set(email, socket.id);
   //    socketidToEmailMap.set(socket.id, email);
   //    io.to(room).emit("user:joined", { email, id: socket.id });
   //    socket.join(room);
   //    io.to(socket.id).emit("room:join", data);
   // });

   socket.on("request", ({ to, from,message }) => {
      const receiver = getUser(to);
      console.log(receiver,message)
      io.to(receiver?.socketId).emit("incomming:request", { from, message });
   });

   socket.on("accept", ({ to, from, message }) => {
      const receiver = getUser(to);
      io.to(receiver?.socketId).emit("incomming:accept", { from, message });
   });

   socket.on("user:call", ({ to, offer, from }) => {
      const receiver = getUser(to);
      console.log(receiver,"recieerc",to)
      io.to(receiver?.socketId).emit("incomming:call", { from, offer });
   });

   socket.on("call:accepted", ({ to, ans, from }) => {
      const receiver = getUser(to);
      io.to(receiver?.socketId).emit("call:accepted", { from, ans });
   });

   socket.on("peer:nego:needed", ({ to, offer, from }) => {
      console.log("peer:nego:needed", );
      const receiver = getUser(to);
      io.to(receiver?.socketId).emit("peer:nego:needed", { from, offer });
   });

   socket.on("peer:nego:done", ({ to, ans, from }) => {
      console.log("peer:nego:done", );
      const receiver = getUser(to);
      io.to(receiver?.socketId).emit("peer:nego:final", { from, ans });
   });


   socket.on("send-msg", ({ to, from, message }) => {
      const receiver = getUser(to);
      console.log(receiver, message)
      if (receiver) {
         io.to(receiver.socketId).emit("msg-recieve", message);
      }
   });

   socket.on("send-request", ({ to, from, message }) => {
      const receiver = getUser(to);
      console.log(receiver, message)
      if (receiver) {
         io.to(receiver.socketId).emit("request-recieve", message);
      }
   });

   socket.on("video-call", ({ currentChat, currentUser }) => {
      const receiver = getVideoUser(currentChat?._id);
      const sender = getVideoUser(currentUser?._id);

      if (receiver && sender) {
         console.log("srdgdgdg")
         io.to(sender.id).emit("video-call-recieve", receiver.id);
      }
   })

   socket.on("newVideoUser", ({ id, currentUser }) => {
      addNewVideoUser(currentUser, id)
   })

   // socket.on("video-call", ({ to, from, stream }) => {
   //    const receiver = getUser(to);
   //    console.log(stream, "stream")
   //    if (receiver) {
   //       io.to(receiver.socketId).emit("videocall-recieve", stream);
   //    }
   // });

   socket.on("send-file", ({ to, from, file, type }) => {
      console.log(file, type)
      const receiver = getUser(to);
      if (receiver) {
         io.to(receiver.socketId).emit("file-recieve", { file, type });
      }
   });


   socket.on("like", ({ to, from, message }) => {
      const receiver = getUser(to)
      if (receiver) {
         io.to(receiver.socketId).emit("like", {
            from,
            message,
         })
      }
   })

   socket.on("comment", ({ to, from, message, image }) => {
      const receiver = getUser(to)
      if (receiver) {
         io.to(receiver.socketId).emit("like", {
            from,
            message,
            image
         })
      }
   })

   socket.on("disconnect", () => {
      console.log("disconnected", socket.id)
      removeUser(socket.id)
   });
});

const port = process.env.PORT || 5000;
server.listen(port, () =>
   console.log(`Server started on ${process.env.PORT}`)
);