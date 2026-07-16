import mongoose from "mongoose";

const alertSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  location: {
    lat: Number,
    lng: Number,
  },
  status: {
    type: String,
    default: "ACTIVE",
  },
  responders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
}, { timestamps: true });

export default mongoose.model("Alert", alertSchema);