import express from "express";

import {
  SearchBill,
  checkOut,
  deleteBillById,
  getAllBills,
  getBillByUser,
  getOneBill,
  updateBill,
} from "../controllers/bill.js";

const router = express.Router();
router.post("/bills/checkout", checkOut);
router.get("/bills/search", SearchBill);
router.get("/bills", getAllBills);
router.get("/bills/user/:userId", getBillByUser);
router.get("/bills/:billId", getOneBill);
router.delete("/bills/delete/:id", deleteBillById);
router.put("/bills/update/:billId", updateBill);
export default router;
