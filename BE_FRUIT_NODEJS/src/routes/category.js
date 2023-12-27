import express from "express";
import {
  createCategory,
  getAllCategory,
  getCategoryBySlug,
  getOneCategoryById,
  removeCategory,
  updateCategory,
} from "../controllers/category.js";

const router = express.Router();
router.get("/categories", getAllCategory);
router.get("/categories/:id", getOneCategoryById);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", removeCategory);
router.get("/category/:slug", getCategoryBySlug);
router.post("/categories", createCategory);
export default router;
