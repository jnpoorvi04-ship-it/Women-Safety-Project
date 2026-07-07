import jwt from "jsonwebtoken";
import { authSocket } from "../middlewares/authSocket.middleware.js";
import { Server } from "socket.io";
import { addUser, removeUser } from "./onlineUsers.js";
import { registerAlertHandlers } from "./handlers/alert.handler.js";
let io;

export const initializeSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true,
        },
    });

   

    io.use(authSocket); 

    io.on("connection", (socket) => {
        console.log("Socket connected:", socket.id);
        registerAlertHandlers(io, socket);
        addUser(socket.user._id, socket.id);



        socket.on("disconnect", ()=> {
            console.log("Socket disconnected:", socket.id);
            removeUser(socket.user._id);
        });
    });
};

export const getIO = () => io;