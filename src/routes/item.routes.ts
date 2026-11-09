import { Router } from "express";
import { getAllItems, createItem } from "../controllers/item.controller";

const router = Router();

router.get("/", getAllItems);
router.post("/", createItem);

export default router;