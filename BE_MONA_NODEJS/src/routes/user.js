import express from "express";

import {
  changePassword,
  forgetPassword,
  getAllUser,
  getUserById,
  removeUser,
  resetPassword,
  searchUser,
  updateUser,
  verifyToken,
} from "../controllers/user.js";

const router = express.Router();

router.get("/users/search", searchUser);
router.get("/users", getAllUser);
router.get("/users/:id", getUserById);
router.put("/users/:id", updateUser);
router.delete("/users/:id", removeUser);

router.post("/users/change-password", changePassword);
router.post("/users/forget-password", forgetPassword);
router.post("/users/verify-email", verifyToken);
router.post("/users/reset-password", resetPassword);

export default router;
