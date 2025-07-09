import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app.js";

dotenv.config({ path: "./src/config/.env" });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("DB connected successfully!");
  } catch (error) {
    console.error(`MongoDB connection failed ${error.message}`);
  }
};

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running on port ${PORT}`);
});
