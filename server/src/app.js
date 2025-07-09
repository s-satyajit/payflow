import express from "express";
import cors from "cors";
import accountRoutes from "./routes/account.route.js";
import authRoutes from "./routes/auth.route.js";
import transactionRoutes from "./routes/transaction.route.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/account", accountRoutes);
app.use("/api/v1/transaction", transactionRoutes);

app.get("/test", (req, res) => {
  res.json({ message: "API is working!" });
});

export default app;
