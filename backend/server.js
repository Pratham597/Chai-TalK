import express from "express";
import "dotenv/config";

import userRoutes from "../backend/routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import mongoose from "mongoose";
import cors from 'cors'
import { Server } from "socket.io";

// Creating an App;
const app = express();
const port = process.env.PORT;

async function connectDB() {
  await mongoose.connect(process.env.DB_URL);
}

connectDB().then(() => {
  console.log("MongoDB is connected successfully");
}).catch((err)=>{
  console.log('MongoDB connectivity failed!')
});

const corsOptions = {
  origin: 'https://chaitalk.vercel.app/', // Allow requests only from this origin
  optionsSuccessStatus: 200, // For legacy browser support
};

app.use(cors(corsOptions))

// Middlewares for app.
app.use(express.json());

// Handling the apis.

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

//Error handling.
app.use(notFound);
app.use(errorHandler);

app.use((req, res, next) => {
  // console.log(req.originalUrl);
  return next();
});

const server = app.listen(port, () => {
  console.log("App is listening on given port ");
});

const io = new Server(server, {
  pingTimeout: 6000,
  cors: {
    origin: "https://chaitalk.vercel.app/",
  },
});

io.on("connection", (socket) => {
  console.log("Socket is connected");
  // Listener for activity setup.

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    // console.log("User join room ", room);
  });

  socket.on('typing',(room,user)=>{
    socket.in(room).emit('typing',user,room)
  })
  socket.on('stop typing',(room,user)=>{
    socket.in(room).emit('stop typing',user,room)
  })
  

  socket.on("new message", (newMessage) => {
    let chat = newMessage.chat;

    if (!chat.users && chat.users.length == 0)
      return console.log("Chat users not defined");

    chat.users.forEach((user) => {
      if (user._id !== newMessage.sender._id) {
        socket.in(user._id).emit('message recieved',newMessage)
      }
    });
  });

  socket.off('setup',()=>{
    console.log('User disconnect');
    socket.leave(userData._id);
  })
});
