import { Router } from "express";
import { register, login, getMe, forgotPassword, getAllUsers } from "../controllers/auth.controller";
import { verifyToken } from "../middleware/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.get("/me", verifyToken, getMe);
router.get("/users", getAllUsers);

export default router;
