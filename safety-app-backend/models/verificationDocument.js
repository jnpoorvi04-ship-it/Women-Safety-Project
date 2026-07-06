import mongoose from "mongoose";

const verificationDocumentSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },

    aadhaarCard: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const VerificationDocument = mongoose.model(
  "VerificationDocument",
  verificationDocumentSchema
);

export default VerificationDocument;