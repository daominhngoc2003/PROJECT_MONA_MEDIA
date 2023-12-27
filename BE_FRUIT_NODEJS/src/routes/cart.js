import express from "express";

import {
  addToCart,
  deleleAllProductCart,
  deleteProductCart,
  getAllCarts,
  getCartById,
  getCartByUser,
  updateCart,
} from "../controllers/cart.js";

const router = express.Router();

// add
router.post("/cart/add", addToCart);
router.put("/cart/update", updateCart);

// get
router.get("/cart", getAllCarts);
router.get("/cart/:id", getCartById);
router.get("/cart/user/:userId", getCartByUser);

// delete
router.post("/cart/delete", deleteProductCart);
router.delete("/cart/deleteall/:userId", deleleAllProductCart);
export default router;
