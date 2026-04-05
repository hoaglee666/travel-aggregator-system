import express from "express";
import type { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { globalBookingCounts } from "./utils/BookingStore";
import { Server as SocketIOServer } from "socket.io";
import searchRoutes from "./routes/searchRoutes";
import alertRoutes from "./routes/alertRoutes";
import authRoutes from "./routes/authRoutes";
import redirectRoutes from "./routes/redirectRoutes";
import adminRoutes from "./routes/adminRoutes";
import profileRoutes from "./routes/profileRoutes";
dotenv.config();

const app = express();
// Middleware
app.use(cors()); // Allows your Angular frontend to make requests
app.use(express.json()); // Parses incoming JSON payloads
//routes
app.use("/api", searchRoutes);
app.use("/api", alertRoutes);
app.use("/api", authRoutes);
app.use("/api", redirectRoutes);
app.use("/api", adminRoutes);
app.use("/api", profileRoutes);
// A simple test route
app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "Online",
    message: "Travel Aggregator API is running smoothly.",
  });
});
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

io.on("connection", (socket) => {
  console.log("⚡ A user connected via WebSockets:", socket.id);

  // When ANY client emits a 'booking_made' event...
  socket.on("booking_made", (data) => {
    console.log(`🏨 Booking confirmed for hotel: ${data.hotelId}`);

    // ✅ NEW: Add this booking to the global server memory
    const currentCount = globalBookingCounts.get(data.hotelId) || 0;
    globalBookingCounts.set(data.hotelId, currentCount + 1);

    // Broadcast this update to EVERYONE ELSE
    socket.broadcast.emit("inventory_update", {
      hotelId: data.hotelId,
      roomsBooked: 1,
    });
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
// CHANGE FROM app.listen to server.listen!
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
