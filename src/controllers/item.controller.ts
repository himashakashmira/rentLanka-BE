import { Request, Response } from "express";
import Item from "../models/item.model";

// get all items with category filter
export const getAllItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category } = req.query;
    let filter = {};

    if (category && category !== "All" && category !== "All categories") {
      filter = { category };
    }

    const items = await Item.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: items });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// get single item by id
export const getItemById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const item = await Item.findById(id);

    if (!item) {
      res.status(404).json({ success: false, message: "Item not found" });
      return;
    }

    res.status(200).json({ success: true, data: item });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// add new rental item
export const createItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, category, description, price_per_day, location, image_url, contact_number } = req.body;

    const newItem = await Item.create({
      title,
      category,
      description,
      price_per_day,
      location,
      image_url,
      contact_number,
    });

    res.status(201).json({ success: true, message: "Item added successfully", data: newItem });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};