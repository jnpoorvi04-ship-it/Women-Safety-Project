import express from "express";
import { createAlert } from "../controllers/alert.controller.js";
import {isUserLoggedIn} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create", isUserLoggedIn, createAlert);

export default router;