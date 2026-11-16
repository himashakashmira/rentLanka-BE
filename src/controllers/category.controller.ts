import { Request, Response } from "express";
import Category from "../models/Category";
import Item from "../models/Item";

export const DEFAULT_CATEGORIES = [
  {
    name: "Vehicles",
    icon: "directions_car",
    count: "1,240 items",
    description: "4x4 SUVs, luxury sedans, double cabs, commercial vans, and passenger vehicles for islandwide journeys.",
    image_url: "https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Cameras",
    icon: "photo_camera",
    count: "2,180 items",
    description: "Cinema full-frame bodies, prime lenses, anamorphic glass, drones, gimbal stabilizers, and studio accessories.",
    image_url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Construction",
    icon: "construction",
    count: "1,260 items",
    description: "Hydraulic excavators, backhoe loaders, road rollers, skid steers, concrete mixers, and site dumpers.",
    image_url: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Tools & Machinery",
    icon: "handyman",
    count: "890 items",
    description: "Silent diesel generators, demolition breakers, rotary hammers, plasma cutters, and welding rigs.",
    image_url: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Motorcycles",
    icon: "two_wheeler",
    count: "740 items",
    description: "Adventure touring motorcycles, automatic scooters, trail dirt bikes, and Royal Enfields for scenic coastal exploration.",
    image_url: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Events",
    icon: "campaign",
    count: "520 items",
    description: "Line-array concert audio systems, LED stage walls, daylight HMI/LED cinema lights, and event trusses.",
    image_url: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Electronics",
    icon: "devices",
    count: "610 items",
    description: "High-lumen laser projectors, live streaming switchers, wireless mic kits, and high-end editing laptops.",
    image_url: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Outdoor & Adventure",
    icon: "hiking",
    count: "430 items",
    description: "Expedition camping tents, sleeping bags, hiking packs, surfboards, diving gear, and water sports equipment.",
    image_url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=400&q=80",
  },
];

// Helper to seed categories
export const checkAndSeedCategories = async () => {
  try {
    const count = await Category.countDocuments();
    if (count === 0) {
      console.log(" Seeding default RentLanka categories...");
      await Category.insertMany(DEFAULT_CATEGORIES);
      console.log(" Categories seeded successfully.");
    }
  } catch (err: any) {
    console.warn("Could not seed categories to MongoDB:", err.message);
  }
};

// GET /api/v1/categories
export const getAllCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    let categories = await Category.find().sort({ name: 1 });

    if (categories.length === 0) {
      await checkAndSeedCategories();
      categories = await Category.find().sort({ name: 1 });
    }

    // Optional: compute live item counts per category
    const itemsCountByCategory = await Item.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    const countMap: Record<string, number> = {};
    itemsCountByCategory.forEach((c) => {
      countMap[c._id] = c.count;
    });

    const enriched = categories.map((cat) => {
      const liveCount = countMap[cat.name];
      return {
        _id: cat._id,
        name: cat.name,
        icon: cat.icon,
        count: liveCount !== undefined ? `${liveCount} items` : cat.count,
        description: cat.description,
        image_url: cat.image_url,
      };
    });

    res.status(200).json({ success: true, count: enriched.length, data: enriched });
  } catch (err: any) {
    console.error("Get categories error:", err);
    res.status(500).json({ success: false, message: err.message || "Failed to fetch categories" });
  }
};

// POST /api/v1/categories/seed
export const seedCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    await Category.deleteMany({});
    const created = await Category.insertMany(DEFAULT_CATEGORIES);
    res.status(201).json({
      success: true,
      message: "8 Curated categories seeded successfully!",
      data: created,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
