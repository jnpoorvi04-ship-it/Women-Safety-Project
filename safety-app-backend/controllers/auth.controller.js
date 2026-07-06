import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { newJWTToken } from "../helpers/auth.helper.js";
import bcrypt from "bcrypt"

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuth = async (req, res) => {
  try {
    const { googleToken } = req.body;

    if (!googleToken) {
      return res.status(400).json({
        message: "Google ID token is missing",
      });
    }

    const googleAuthTicket = await client.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = googleAuthTicket.getPayload();

    const { email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        profileImage: picture,
        verified: false,
      });
    }
    return res.status(200).json({
      token: newJWTToken(user._id),
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Google login failed",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    let user = await User.findOne({ email });
    if(!user){
      return res.status(404).json({
        message: "User not found",
      })
    }
     const isMatch = await bcrypt.compare(
            password,
            user.password
          );

          if (!isMatch) {
            return res.status(401).json({
              message: "Invalid password",
            });
          }

    res.status(200).json({
      token: newJWTToken(user._id),
      user,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Login failed",
    });
  }
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      verified: false,
    });

    res.status(201).json({
      message: "Registration successful",
      token: newJWTToken(user._id),
      user,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Registration failed",
    });
  }
};