import { Request, Response } from "express";
import Booking from "../models/booking.model";
import Item from "../models/item.model";

// get all bookings
export const getAllBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: bookings });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// create booking
export const createBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { item_id, item_title, renter_name, renter_phone, start_date, end_date, total_price } = req.body;

    const newBooking = await Booking.create({
      item_id,
      item_title,
      renter_name,
      renter_phone,
      start_date,
      end_date,
      total_price,
      status: "Pending",
    });

    res.status(201).json({ success: true, message: "Booking created", data: newBooking });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// update booking status (confirm / reject)
export const updateBookingStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, item_id } = req.body;

    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    // if admin confirms, mark item as not available
    if (status === "Confirmed" && item_id) {
      await Item.findByIdAndUpdate(item_id, { is_available: false });
    }

    res.status(200).json({ success: true, message: `Booking ${status}`, data: updatedBooking });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};