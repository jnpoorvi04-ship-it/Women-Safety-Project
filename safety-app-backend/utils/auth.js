import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const getAuthenticatedUser = async (token) => {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id)
    .populate("emergencyContacts")
    .select("-password");


    if (!user) {
        throw new Error("User not found");
    }
    
    return user;
};






