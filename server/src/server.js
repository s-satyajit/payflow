import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app.js";

dotenv.config({ path: "./src/config/.env" });

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.DB_URI);
    isConnected = true;
    console.log("DB connected successfully!");
  } catch (error) {
    console.error(`MongoDB connection failed ${error.message}`);
  }
};

connectDB();

export default app;
