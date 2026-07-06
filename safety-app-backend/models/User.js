import mongoose from "mongoose";
import verificationDocument from "./verificationDocument.js";
import { userModel } from "../constants/Constant.js";
import EmergencyContact from "./EmergencyContact.js";

const userSchema = new mongoose.Schema({
  name: String,
  email: { 
  type: String, 
  unique: true 
   },
  password: String,
  profileImage: String,
  phone: String,
  location: {
    lat: Number,
    lng: Number,
  },
  verificationDocument: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "VerificationDocument" 
  },
  emergencyContacts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EmergencyContact"
    }
  ],
  verified: { type: Boolean, 
    default: false },
}, 
{ timestamps: true });

export default mongoose.model(userModel , userSchema);