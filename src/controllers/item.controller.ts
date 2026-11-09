import { Request, Response } from "express";
import { supabase } from "../config/supabase";

// Database eken items tika ganna function eka
export const getAllItems = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!supabase) {
      res.status(500).json({ success: false, message: "Supabase client not initialized" });
      return;
    }

    const { category } = req.query;
    let query = supabase.from("items").select("*").order("created_at", { ascending: false });

    // Category filter ekak thibboth e category eka witharak gannawa
    if (category && category !== "All") {
      query = query.eq("category", category);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.status(200).json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Aluth item ekak save karana function eka
export const createItem = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!supabase) {
      res.status(500).json({ success: false, message: "Supabase client not initialized" });
      return;
    }

    const { title, category, description, price_per_day, location, image_url, contact_number } = req.body;

    const { data, error } = await supabase.from("items").insert([
      { title, category, description, price_per_day, location, image_url, contact_number }
    ]).select();

    if (error) throw error;

    res.status(201).json({ success: true, message: "Item added successfully", data });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};