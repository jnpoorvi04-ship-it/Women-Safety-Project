import express from "express";
import User from "../models/User.js";
import { isUserLoggedIn } from "../middlewares/auth.middleware.js";
import { updateUserInfo, getUserInfo, onboardUser } from "../controllers/user.controller.js";

const router = express.Router();


router.post("/onboard", isUserLoggedIn, onboardUser);
router.put("/profile", isUserLoggedIn, updateUserInfo);
router.get("/me", isUserLoggedIn, getUserInfo);

export default router;