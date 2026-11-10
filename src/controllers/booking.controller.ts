import { Request, Response } from "express";
import { supabase } from "../config/supabase";

// get all bookings for admin dashboard
export const getAllBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!supabase) {
      res.status(500).json({ success: false, message: "Supabase not connected" });
      return;
    }

    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.status(200).json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// create booking request by customer
export const createBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!supabase) {
      res.status(500).json({ success: false, message: "Supabase not connected" });
      return;
    }

    const { item_id, item_title, renter_name, renter_phone, start_date, end_date, total_price } = req.body;

    const { data, error } = await supabase.from("bookings").insert([
      { item_id, item_title, renter_name, renter_phone, start_date, end_date, total_price, status: "Pending" }
    ]).select();

    if (error) throw error;
    res.status(201).json({ success: true, message: "Booking created", data });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// admin can confirm or reject booking
export const updateBookingStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!supabase) {
      res.status(500).json({ success: false, message: "Supabase not connected" });
      return;
    }

    const { id } = req.params;
    const { status, item_id } = req.body; // status is 'Confirmed' or 'Rejected'

    // update booking status
    const { data, error } = await supabase
      .from("bookings")
      .update({ status })
      .eq("id", id)
      .select();

    if (error) throw error;

    // if admin confirmed, mark item as not available on homepage
    if (status === "Confirmed" && item_id) {
      await supabase.from("items").update({ is_available: false }).eq("id", item_id);
    }

    res.status(200).json({ success: true, message: `Booking ${status}`, data });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};