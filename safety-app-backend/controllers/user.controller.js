import { excludePassword } from "../constants/Constant.js";
import User from "../models/User.js";
import verificationDocument from "../models/verificationDocument.js";
import EmergencyContact from "../models/EmergencyContact.js";


export const getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate("verificationDocument")
      .populate("emergencyContacts");
    if (!user) {
      return res.status(404).json({
        message:"User not found"
      });
    }
    res.status(200).json({
      user
    });

  } catch(error){
    console.error(error);
    res.status(500).json({
      message:"Failed to fetch user info",
      error: error.message,
    });
  }
};

export const updateUserInfo = async (req, res) => {
    try{
      const {phone, emergencyContacts} = req.body;

      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.phone = req.body.phone || user.phone;
      
      if(emergencyContacts && Array.isArray(emergencyContacts)){
        if(emergencyContacts.length <1){
          return res.status(400).json({
            message: "At least one emergency contact is required",
          });
        }

        await EmergencyContact.deleteMany({user: user._id});

        const createdContacts = await EmergencyContact.insertMany(
            emergencyContacts.map((contact) => ({
            user: user._id,
            name: contact.name,
            phone: contact.phone,
            email: contact.email,
          }))
        );

        user.emergencyContacts = createdContacts.map((contact) => contact._id);
      }
      await user.save();

      const updatedUser = await User.findById(user._id)
        .populate("emergencyContacts")
        .populate("verificationDocument");

      res.status(200).json({
        message: "Profile updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to update profile",
        error: error.message,
      });
    }
  };

export const onboardUser = async (req, res) => {
  try {
    const { aadhaarCard, emergencyContacts, phone } = req.body;

    if (!aadhaarCard) {
      return res.status(400).json({
        message: "Aadhaar number is required"
      });
    }

    if (
      !emergencyContacts ||
      !Array.isArray(emergencyContacts) ||
      emergencyContacts.length < 1
    ) {
      return res.status(400).json({
        message: "At least one emergency contact is required"
      });
    }

    for (const contact of emergencyContacts) {
      if (!contact.name || !contact.phone || !contact.email) {
        return res.status(400).json({
          message: "Each emergency contact must have name, phone, and email"
        });
      }
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }
    user.phone = phone;

    const verificationDoc = await verificationDocument.create({
      email: user.email,
      aadhaarCard
    });

    const createdContacts = await EmergencyContact.insertMany(
      emergencyContacts.map((contact) => ({
        user: user._id,
        name: contact.name,
        phone: contact.phone,
        email: contact.email
      }))
    );

    user.verificationDocument = verificationDoc._id;
    user.emergencyContacts = createdContacts.map((contact) => contact._id);
    user.verified = true;

    await user.save();

    res.status(200).json({
      message: "User onboarded and verified successfully",
      verified: user.verified,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

