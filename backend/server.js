import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import userRoutes from "./Routes/userRoutes.js";
import postRoutes from "./Routes/postRoutes.js";
import{v2 as cloudinary} from "cloudinary"
import messageRoutes from './Routes/messageRoutes.js'
import {app,server} from './Socket/Socket.js'

dotenv.config();

connectDB();



cloudinary.config({
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
  api_key:process.env.CLOUDINARY_API_KEY,
  api_secret:process.env.CLOUDINARY_SECRET_KEY,
})

app.use(express.json({limit:"50mb"}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/messages", messageRoutes);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () =>
  console.log(`Server started on port http://localhost:${PORT}`)
);
