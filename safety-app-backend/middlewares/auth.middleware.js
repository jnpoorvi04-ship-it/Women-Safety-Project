import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { space, excludePassword } from "../constants/Constant.js";



export const isUserLoggedIn = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(space)[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = await User.findById(decoded.id).select(excludePassword);
    
    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Not authorized",
      error: error.message,
    });
  }
};

