import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import healthRouter from "./routes/health.routes";
import itemRouter from "./routes/item.routes";
import bookingRouter from "./routes/booking.routes";
import authRouter from "./routes/auth.routes";
import categoryRouter from "./routes/category.routes";
import aiRouter from "./routes/ai.routes";
import { checkAndSeedItems } from "./controllers/item.controller";
import { checkAndSeedCategories } from "./controllers/category.controller";
import uploadRouter from "./routes/upload.routes";

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

// Middlewares
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// High limit for direct image base64 uploads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Root welcome route
app.get("/", (req: Request, res: Response) => {
  res.json({
    project: "RentLanka - Peer-to-Peer Rental Marketplace API",
    version: "1.0.0",
    status: "online",
    endpoints: {
      auth: "/api/v1/auth",
      items: "/api/v1/items",
      bookings: "/api/v1/bookings",
      categories: "/api/v1/categories",
      ai: "/api/v1/ai",
      health: "/api/v1/health",
    },
  });
});

// API Routes
app.use("/api/v1/health", healthRouter);
app.use("/api/v1/items", itemRouter);
app.use("/api/v1/bookings", bookingRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/ai", aiRouter);

// image upload to supabase
app.use("/api/v1/upload", uploadRouter);

// Global 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Connect Database & Bootstrap Seeds
connectDB().then(async () => {
  await checkAndSeedCategories();
  await checkAndSeedItems();
});

// Start Server
app.listen(PORT, () => {
  console.log(` RentLanka Backend Server running on http://localhost:${PORT}`);
});

export default app;
