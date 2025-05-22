import express from "express";
import cors from "cors";
import { config } from "./config/config";
import queryRoutes from "./routes/queryRoutes";

const app = express();
const PORT = config.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "RAG API is running" });
});

// Routes
app.use("/api/query", queryRoutes);
// Start the server
app.listen(PORT, () => {
  console.log(`RAG API server running on port ${PORT}`);
});
