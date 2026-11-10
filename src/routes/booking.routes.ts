import { Router } from "express";
import { getAllBookings, createBooking, updateBookingStatus } from "../controllers/booking.controller";

const router = Router();

// booking endpoints
router.get("/", getAllBookings);
router.post("/", createBooking);
router.put("/:id/status", updateBookingStatus);

export default router;