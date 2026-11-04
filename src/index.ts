import express, { Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import healthRouter from "./routes/health.routes";

dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGO_URI =
    process.env.MONGO_URI ||
    process.env.MONGO_LOCAL_URL ||
    "mongodb://admin:1234@localhost:27017/rentlanka_db?authSource=admin";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req: Request, res: Response) => {
    res.send("RentLanka Rental Management API is online!");
});

app.use("/api/v1/health", healthRouter);

// Database Connection & Server Startup
mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log("DB connected..!");
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Fail to connect DB..!", err);
    });

export default app;

