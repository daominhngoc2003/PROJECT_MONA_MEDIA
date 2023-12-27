import express from "express";
import { refreshToken, signin, signup } from "../controllers/auth.js";

const router = express.Router();
router.post("/signup", signup);
router.post("/signin", signin);
router.post("refresh-token", refreshToken);
export default router;
