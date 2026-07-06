import jwt from "jsonwebtoken";
import { tokenExpiryTime } from "../constants/Constant.js";

function newJWTToken(userId){
    let jwttoken = jwt.sign(
        { id: userId }, 
        process.env.JWT_SECRET, 
        { expiresIn: tokenExpiryTime }
        );
    return jwttoken
    } 

export { 
    newJWTToken 
} 