import { Router } from "express";
import { generateItemDescription, chatWithRentLankaAI } from "../controllers/ai.controller";

const router = Router();

router.post("/generate-description", generateItemDescription);
router.post("/chat", chatWithRentLankaAI);

export default router;