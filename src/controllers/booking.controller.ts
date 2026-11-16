import { Request, Response } from "express";
import Booking from "../models/Booking";
import Item from "../models/Item";

// Generate unique Sri Lankan booking reference code: e.g. #LK-FX6-9812
const generateBookingReference = (title: string = "RENT"): string => {
  const cleanTitle = title.replace(/[^a-zA-Z0-9]/g, "").slice(0, 3).toUpperCase() || "LKA";
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `#LK-${cleanTitle}-${randomNum}`;
};

// GET /api/v1/bookings
export const getAllBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, renter_nic, renter_phone } = req.query;
    const filter: any = {};

    if (status && status !== "All") {
      filter.status = status;
    }

    if (renter_nic) {
      filter.renter_nic = renter_nic;
    }

    if (renter_phone) {
      filter.renter_phone = renter_phone;
    }

    const bookings = await Booking.find(filter)
      .populate("item_id", "title category price_per_day location image_url is_available")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (err: any) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ success: false, message: err.message || "Failed to fetch bookings" });
  }
};

// GET /api/v1/bookings/:id
export const getBookingById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id).populate("item_id");

    if (!booking) {
      res.status(404).json({ success: false, message: "Booking voucher not found" });
      return;
    }

    res.status(200).json({ success: true, data: booking });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/v1/bookings
export const createBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      item_id,
      item_title,
      item_image,
      item_location,
      renter_name,
      renter_phone,
      renter_nic,
      start_date,
      end_date,
      duration_days,
      daily_rate,
      total_price,
      security_deposit,
      platform_fee,
      payment_method,
      status,
    } = req.body;

    if (!item_id || !renter_name || !renter_phone || !start_date || !end_date) {
      res.status(400).json({
        success: false,
        message: "Missing required booking fields (item_id, renter_name, renter_phone, dates).",
      });
      return;
    }

    // Verify item exists
    const item = await Item.findById(item_id);
    if (!item) {
      res.status(404).json({ success: false, message: "Rental item not found" });
      return;
    }

    const finalStatus = status || "Confirmed"; // Escrow checkout auto-confirms or pending
    const booking_reference = generateBookingReference(item.title);

    const newBooking = await Booking.create({
      item_id: item._id,
      item_title: item.title,
      item_image: item_image || item.image_url,
      item_location: item_location || item.location,
      renter_name: renter_name.trim(),
      renter_phone: renter_phone.trim(),
      renter_nic: (renter_nic || "200012345678").trim(),
      start_date,
      end_date,
      duration_days: duration_days || 1,
      daily_rate: daily_rate || item.price_per_day,
      total_price: Number(total_price) || item.price_per_day,
      security_deposit: security_deposit !== undefined ? Number(security_deposit) : item.security_deposit,
      platform_fee: platform_fee || Math.round(Number(total_price || item.price_per_day) * 0.03),
      payment_method: payment_method || "LankaPay Escrow",
      booking_reference,
      status: finalStatus,
    });

    // If confirmed, immediately lock item calendar
    if (finalStatus === "Confirmed") {
      await Item.findByIdAndUpdate(item_id, { is_available: false });
    }

    res.status(201).json({
      success: true,
      message: `Rental booking authorized via ${newBooking.payment_method}!`,
      data: newBooking,
    });
  } catch (err: any) {
    console.error("Create booking error:", err);
    res.status(500).json({ success: false, message: err.message || "Failed to create booking" });
  }
};

// PUT /api/v1/bookings/:id/status
export const updateBookingStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, item_id } = req.body;

    if (!status || !["Pending", "Confirmed", "Rejected"].includes(status)) {
      res.status(400).json({ success: false, message: "Valid status (Pending, Confirmed, Rejected) is required" });
      return;
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedBooking) {
      res.status(404).json({ success: false, message: "Booking not found" });
      return;
    }

    // Determine target item ID
    const targetItemId = item_id || updatedBooking.item_id;

    // If approving, lock calendar by setting item.is_available = false
    if (status === "Confirmed" && targetItemId) {
      await Item.findByIdAndUpdate(targetItemId, { is_available: false });
    } else if (status === "Rejected" && targetItemId) {
      // If rejecting, release calendar back to available
      await Item.findByIdAndUpdate(targetItemId, { is_available: true });
    }

    res.status(200).json({
      success: true,
      message: `Booking #${updatedBooking.booking_reference} marked as ${status}`,
      data: updatedBooking,
    });
  } catch (err: any) {
    console.error("Update booking status error:", err);
    res.status(500).json({ success: false, message: err.message || "Failed to update booking status" });
  }
};
