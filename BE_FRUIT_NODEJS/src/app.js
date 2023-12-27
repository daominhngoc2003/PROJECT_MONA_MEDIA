import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
dotenv.config();

import productRouter from "./routes/product.js";
import categoryRouter from "./routes/category.js";
import usertRouter from "./routes/user.js";
import authtRouter from "./routes/auth.js";
import uploadRouter from "./routes/upload.js";
import connectDB from "../src/config/database.js";
import cartRouter from "../src/routes/cart.js";
import BillRouter from "./routes/bill.js";
import mongoose from "mongoose";
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));

app.use("/api", productRouter);
app.use("/api", usertRouter);
app.use("/api", authtRouter);
app.use("/api", categoryRouter);
app.use("/api", uploadRouter);
app.use("/api", cartRouter);
app.use("/api", BillRouter);

//connect to MongoDB
connectDB(process.env.MONGO_URL);

app.listen(process.env.PORT, async () => {
  await mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Server is running http://localhost:8080/api");
});

export const viteNodeApp = app;
