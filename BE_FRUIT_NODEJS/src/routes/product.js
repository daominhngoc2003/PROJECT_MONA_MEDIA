import express from "express";
import {
  SearchProduct,
  createProduct,
  getAllProducts,
  getProductByCategoryId,
  getProductByCategorySearch,
  getProductById,
  getProductBySlug,
  removeProduct,
  updateProduct,
} from "../controllers/product.js";

const router = express.Router();
router.get("/products", getAllProducts);
router.get("/products/search", SearchProduct);
router.get("/products/:id", getProductById);
router.get("/product/:slug", getProductBySlug);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", removeProduct);
router.post("/products", createProduct);
router.get("/products/categoryId/:id", getProductByCategoryId);
router.get("/products/categoryId/search/:id", getProductByCategorySearch);
export default router;
