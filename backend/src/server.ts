import express from "express";
import type { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/database";
import searchRoutes from "./routes/searchRoutes";
import alertRoutes from "./routes/alertRoutes";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Allows your Angular frontend to make requests
app.use(express.json()); // Parses incoming JSON payloads

//routes
app.use("/api", searchRoutes);
app.use("/api", alertRoutes);
// A simple test route
app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "Online",
    message: "Travel Aggregator API is running smoothly.",
  });
});

// Start the server and connect to the database
app.listen(PORT, async () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  await connectDB();
});
