import { Request, Response } from "express";
import Category from "../models/category.model";

// get all categories
export const getAllCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json({ success: true, data: categories });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// create initial default categories if empty
export const seedCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const count = await Category.countDocuments();
    if (count === 0) {
      const defaultCategories = [
        { name: "Vehicles", icon: "truck", description: "Cars, vans and commercial vehicles" },
        { name: "Motorcycles", icon: "bike", description: "Bikes and scooters" },
        { name: "Electronics", icon: "laptop", description: "Laptops, gadgets and gaming" },
        { name: "Cameras", icon: "camera", description: "DSLR, lenses and accessories" },
        { name: "Construction", icon: "hard-hat", description: "Heavy equipment and machines" },
        { name: "Tools & Machinery", icon: "wrench", description: "Power tools and home tools" },
        { name: "Furniture", icon: "armchair", description: "Event and house furniture" },
        { name: "Events", icon: "calendar", description: "Party and wedding items" },
      ];
      await Category.insertMany(defaultCategories);
      res.status(201).json({ success: true, message: "Categories seeded successfully" });
      return;
    }
    res.status(200).json({ success: true, message: "Categories already exist" });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};