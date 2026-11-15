import { Router } from "express";
import { generateItemDescription } from "../controllers/ai.controller";

const router = Router();

router.post("/generate-description", generateItemDescription);

export default router;