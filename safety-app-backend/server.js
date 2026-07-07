import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
import router from "./routes/alert.routes.js";
import authRoutes from "./routes/auth.routes.js";
import User from "./models/User.js";
import http from "http";
import userRoutes from "./routes/user.routes.js";
import { initializeSocket } from "./sockets/socket.js";
dotenv.config();

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/alerts", router);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Backend running...");
});

const server = http.createServer(app);

initializeSocket(server);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    server.listen(5000, () => {
      console.log("Server running on port 5000");
    });
  })
  .catch((error) => {
    console.log("MongoDB connection failed:", error.message);
  });