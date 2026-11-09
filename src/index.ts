import express, { Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import healthRouter from "./routes/health.routes";
import itemRouter from "./routes/item.routes"; // items route

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI =
    process.env.MONGO_URI ||
    process.env.MONGO_LOCAL_URL ||
    "mongodb://admin:1234@localhost:27017/rentlanka_db?authSource=admin";

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// test route
app.get("/", (req: Request, res: Response) => {
    res.send("RentLanka Rental Management API is online!");
});

// health check
app.use("/api/v1/health", healthRouter);

// all rental items routes
app.use("/api/v1/items", itemRouter);

// try mongo connect but not block server
mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log("DB connected..!");
    })
    .catch((err) => {
        console.log("Mongo skip, using supabase");
    });

// start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;