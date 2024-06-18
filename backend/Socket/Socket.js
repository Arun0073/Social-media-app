import { Server } from "socket.io";
import http from "http";
import express from "express";
import Message from '../models/messageModels.js'
import Conversation from "../models/conversationModel.js";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:4000",
    methods: ["GET", "POST"],
  },
});


export const getRecipientSocketId=(recipientId)=>userSocketMap[recipientId]
const userSocketMap = {};

io.on("connection", (socket) => {
  console.log("user Connected", socket.id);


  const userId = socket.handshake.query.userId;
  if (userId != "undefined") userSocketMap[userId] = socket.id;
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("markMessageAsSeen",async({conversationId,userId})=>{
    try {
      await Message.updateMany({conversationId:conversationId,seen:false},{$set:{seen:true}})
      await Conversation.updateOne({_id:conversationId},{$set:{"lastMessage.seen":true}})
      io.to(userSocketMap[userId]).emit("messagesSeen",{conversationId});
    } catch (error) {
      console.log(error)
    }
  })


  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    delete userSocketMap[userId];
		io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, server, app };
