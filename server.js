const express = require("express");
const morgan = require('morgan')
const cors = require("cors");
const http = require("http");
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
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
app.use(cookieParser())

app.use(bodyParser.json());
app.use(
   bodyParser.urlencoded({
      extended: true,
   }),
);



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
   cors: {
      origin: "*"
   },
});


// const peerServer = ExpressPeerServer(server, {
//    debug: true,
// });
// app.use('/peerjs', peerServer);

global.onlineUsers = []
global.onlineVideoUsers = []

const addNewUser = (username, socketId) => {
   !onlineUsers.some((user) => user.username === username) &&
      onlineUsers.push({ username, socketId })
}

const removeUser = (socketId) => {
   onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId)
}

const getUser = (username) => {
   return onlineUsers.find((user) => user.username === username)
}

const addNewVideoUser = (currentUser, id) => {
   !onlineVideoUsers.some((user) => user.currentUser === currentUser) &&
      onlineVideoUsers.push({ currentUser, id })
}

const removeVideoUser = (id) => {
   onlineVideoUsers = onlineVideoUsers.filter((user) => user.id !== id)
}

const getVideoUser = (currentUser) => {
   return onlineVideoUsers.find((user) => user.currentUser === currentUser)
}


io.on("connection", (socket) => {
   console.log("user connnected", socket.id)

   socket.on("newUser", (username) => {
      addNewUser(username, socket.id)
   })
   
   console.log(onlineUsers, "onlineUser")
   console.log(onlineVideoUsers, "onlineVideoUser")


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