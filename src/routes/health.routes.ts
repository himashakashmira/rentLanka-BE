import { Router } from "express";
import { getAllItems, createItem, getItemById } from "../controllers/item.controller";

const router = Router();

router.get("/", getAllItems);
router.post("/", createItem);
router.get("/:id", getItemById); // single item route

export default router;