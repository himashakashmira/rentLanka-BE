import { Router } from "express";
import { getAllCategories, seedCategories } from "../controllers/category.controller";

const router = Router();

router.get("/", getAllCategories);
router.post("/seed", seedCategories); // run once to put default categories

export default router;