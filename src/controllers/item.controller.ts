import { Request, Response } from "express";
import Item from "../models/Item";
import { AuthRequest } from "../middleware/auth.middleware";

// Default initial items for RentLanka platform
export const INITIAL_RENTAL_ITEMS = [
  {
    title: "Sony FX6 Cinema Line Full-Frame Rig",
    category: "Cameras",
    description: "Production-ready Sony FX6 Cinema Line camera body equipped with Tilta full cage, V-Mount battery plate, Sony FE 24-70mm f/2.8 GM II lens, 2x 160GB CFexpress Type A cards, Rode NTG5 shotgun mic, and Pelican 1510 hard roller case. Ideal for Sri Lankan commercial film shoots, documentaries, and music videos.",
    price_per_day: 28000,
    security_deposit: 20000,
    location: "Colombo",
    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCL6k30Buh21nC7XJ7sZg3BfZuXoIq9b4rXo0s9z9Xj1-23k8sM7n4b1v0c9a8z7y6x5w4v3u2t1s0r9q8p7o6n5m4l3k2j1h0g",
    contact_number: "+94 77 123 4567",
    is_available: true,
    rating: 4.95,
    reviews_count: 32,
    owner_name: "Ceylon Cine Solutions",
    specs: {
      Sensor: "4K Full-Frame 10.2MP Back-Illuminated Exmor R CMOS",
      Mount: "Sony E-Mount (Full Frame)",
      DynamicRange: "15+ Stops in S-Log3",
      Recording: "4K DCI 120p / FHD 240p 10-bit 4:2:2 All-Intra",
      Audio: "Dual Channel XLR Inputs on Top Handle",
      Power: "3x 150Wh V-Mount Battery Packs + Dual Fast Charger"
    },
    inclusions: [
      "Sony FX6 Body + Tilta Full Armor Cage",
      "Sony 24-70mm f/2.8 GM II Zoom Lens",
      "2x 160GB CFexpress Type A + High-Speed Card Reader",
      "3x 150Wh V-Mount Batteries & Dual Charger",
      "Rode NTG5 Shotgun Microphone + XLR Cable",
      "Pelican 1510 Waterproof Hard Case with TrekPak"
    ]
  },
  {
    title: "2023 Toyota Hilux Double Cab 4x4",
    category: "Vehicles",
    description: "Rugged 2.8L turbo-diesel double cab 4WD with heavy-duty canopy, all-terrain tires, Ironman snorkel, and dual battery system. Perfect for regional site inspections, estate tours in Nuwara Eliya, and off-road production logistics.",
    price_per_day: 22500,
    security_deposit: 35000,
    location: "Colombo",
    image_url: "https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=1200&q=80",
    contact_number: "+94 71 888 9900",
    is_available: true,
    rating: 4.9,
    reviews_count: 46,
    owner_name: "Lanka Expeditions Fleet",
    specs: {
      Engine: "2.8L 1GD-FTV Turbo Diesel (201 hp / 500 Nm)",
      Transmission: "6-Speed Automatic 4WD with High/Low Range",
      Seating: "5 Passenger Double Cab Leather Interior",
      Payload: "1,000 kg Bed Capacity + Tow Bar Hitch",
      FuelEfficiency: "11.2 km/L Intercity Highway Cycle"
    },
    inclusions: [
      "Comprehensive All-Island Commercial Insurance",
      "200 km Daily Mileage Allowance Included",
      "Ironman 12,000 lbs Electric Recovery Winch",
      "Heavy-Duty Locking Aluminum Canopy"
    ]
  },
  {
    title: "CAT 320D Hydraulic Crawler Excavator",
    category: "Construction",
    description: "Heavy-duty 20-ton hydraulic crawler excavator with standard 1.0 m³ bucket, certified operator safety cab, and high-efficiency hydraulic flow. Serviced regularly for highway, quarry, and foundation projects islandwide.",
    price_per_day: 68000,
    security_deposit: 75000,
    location: "Kandy",
    image_url: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80",
    contact_number: "+94 81 222 3344",
    is_available: true,
    rating: 4.88,
    reviews_count: 19,
    owner_name: "Central Heavy Machineries PLC",
    specs: {
      OperatingWeight: "20,500 kg (45,200 lb)",
      FlywheelPower: "148 HP (110 kW) CAT C6.4 ACERT",
      BucketCapacity: "1.0 m³ Heavy Excavation Bucket",
      MaxDiggingDepth: "6,650 mm (21.8 ft)"
    },
    inclusions: [
      "Certified IJSE / CIDA Operating Certificate",
      "Routine Maintenance Technicians On-Call",
      "Low-Bed Transport Coordination (Islandwide)"
    ]
  },
  {
    title: "Honda CB500X Adventure Touring Motorcycle",
    category: "Motorcycles",
    description: "Twin-cylinder 471cc adventure sport motorcycle equipped with Givi aluminum panniers, crash bars, tall touring screen, and dual-purpose Pirelli Scorpion tires. The definitive motorcycle to explore Sri Lanka's coastal roads and hill country passes.",
    price_per_day: 7500,
    security_deposit: 15000,
    location: "Galle",
    image_url: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80",
    contact_number: "+94 91 333 4455",
    is_available: true,
    rating: 4.98,
    reviews_count: 58,
    owner_name: "Southern Moto Riders Hub",
    specs: {
      Engine: "471cc Liquid-Cooled Parallel Twin DOHC",
      FuelTank: "17.7 Liters (Approx 450 km Range)",
      Braking: "Dual Front Discs with Dual-Channel ABS",
      Luggage: "Givi 37L Lockable Side Aluminum Panniers"
    },
    inclusions: [
      "2x DOT Certified Modular Helmets Included",
      "RAM Mount Phone Holder with USB Quick Charge",
      "Comprehensive Third Party & Collision Cover"
    ]
  },
  {
    title: "Denyo 60kVA Ultra-Soundproof Diesel Generator",
    category: "Tools & Machinery",
    description: "Japanese ultra-silent 60kVA 3-phase prime diesel generator mounted on heavy mobile trailer with ATS connection panel. Silent acoustic canopy makes it optimal for luxury outdoor weddings, Colombo hotel backup, and remote film location lighting.",
    price_per_day: 32000,
    security_deposit: 30000,
    location: "Negombo",
    image_url: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1200&q=80",
    contact_number: "+94 31 444 5566",
    is_available: true,
    rating: 4.92,
    reviews_count: 24,
    owner_name: "Western Genset Logistics",
    specs: {
      RatedOutput: "60 kVA (48 kW) Prime Continuous",
      Voltage: "415V / 230V 3-Phase 4-Wire 50Hz",
      NoiseLevel: "58 dB(A) at 7m (Ultra-Silent Canopy)",
      FuelTank: "140 Liter Internal Tank (14h Continuous)"
    },
    inclusions: [
      "50m 3-Phase Camlock Heavy Armored Cables",
      "Automatic Transfer Switch (ATS) Interface Box",
      "Delivery Trailer with Heavy-Duty Stabilizers"
    ]
  },
  {
    title: "Aputure Electro Storm CS15 Point Source LED Light",
    category: "Events",
    description: "1500W full-color point source fixture with ultra-high CRI 98, motorized Bowens mount, IP65 weather resistance, and Sidus Link wireless control. Produces punchy daylight output matching a 1.8kW HMI with zero ballast buzz.",
    price_per_day: 16500,
    security_deposit: 20000,
    location: "Colombo",
    image_url: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80",
    contact_number: "+94 77 999 8877",
    is_available: true,
    rating: 4.96,
    reviews_count: 21,
    owner_name: "Colombo Grip & Light Rental",
    specs: {
      PowerDraw: "1500W High-Output RGBACL Engine",
      ColorTemp: "2,000K to 10,000K + Green-Magenta Tint",
      WeatherRating: "IP65 Dust and Water Resistant",
      Wireless: "CRMX LumenRadio & Bluetooth Sidus Link"
    },
    inclusions: [
      "CS15 Lamp Head & Control Box with Ballast",
      "35-Degree Reflector + Heavy-Duty C-Stand",
      "Aputure Lantern 90 Softbox & Rolling Flight Case"
    ]
  },
  {
    title: "DJI Inspire 3 8K Full-Frame Cinema Drone Combo",
    category: "Cameras",
    description: "The gold standard aerial cinematography system featuring X9-8K Air gimbal camera, dual-operator RC Plus remotes, RTK centimeter-level positioning, and 5x TB51 high-capacity intelligent flight batteries.",
    price_per_day: 55000,
    security_deposit: 60000,
    location: "Colombo",
    image_url: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=1200&q=80",
    contact_number: "+94 77 444 3322",
    is_available: false,
    rating: 4.97,
    reviews_count: 17,
    owner_name: "AeroVision Ceylon",
    specs: {
      Resolution: "8K/75fps Apple ProRes RAW & CinemaDNG",
      Sensor: "Full-Frame 35mm 45MP Exmor CMOS",
      MaxSpeed: "94 km/h (58 mph)",
      FlightTime: "Up to 28 Minutes Per Battery Pair"
    },
    inclusions: [
      "Inspire 3 Aircraft & Zenmuse X9-8K Gimbal",
      "DL 18mm, 24mm, 35mm, 50mm f/2.8 Prime Lenses",
      "2x DJI RC Plus Remotes (Pilot + Camera Op)",
      "6x TB51 Intelligent Batteries + Charging Hub"
    ]
  },
  {
    title: "Bosch Professional Heavy Demolition Hammer GSH 16-28",
    category: "Tools & Machinery",
    description: "41 Joules extreme impact rate demolition hammer engineered for breaking concrete slabs, road repair, and granite trenching. Features Vibration Control to reduce operator fatigue over 8-hour construction shifts.",
    price_per_day: 5200,
    security_deposit: 12000,
    location: "Jaffna",
    image_url: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=1200&q=80",
    contact_number: "+94 21 555 6677",
    is_available: true,
    rating: 4.85,
    reviews_count: 14,
    owner_name: "Jaffna Builders & Power Tools",
    specs: {
      ImpactEnergy: "41 Joules (Extreme Chipping Rate)",
      PowerInput: "1,750 Watts Heavy Duty Motor",
      Weight: "17.9 kg with Auxiliary Handle",
      BitShank: "28 mm Hexagon Chuck"
    },
    inclusions: [
      "1x Pointed Chisel (400 mm) & 1x Flat Chisel",
      "Trolley Transport Cart for Easy Mobility",
      "Shock-Absorbing Work Gloves & Safety Goggles"
    ]
  }
];

// Helper: Seed default items if collection is empty
export const checkAndSeedItems = async () => {
  try {
    const count = await Item.countDocuments();
    if (count === 0) {
      console.log(" Seeding initial verified marketplace items...");
      await Item.insertMany(INITIAL_RENTAL_ITEMS);
      console.log(" Initial marketplace items seeded successfully.");
    }
  } catch (err: any) {
    console.warn("Could not seed items to MongoDB:", err.message);
  }
};

// GET /api/v1/items (with query filters)
export const getAllItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, search, location, minPrice, maxPrice, available, sortBy } = req.query;
    const filter: any = {};

    // Filter by Category (flexible regex substring match)
    if (category && category !== "all" && category !== "All" && category !== "All categories") {
      filter.category = { $regex: new RegExp(String(category).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i") };
    }

    // Filter by Search Query (Title or Description)
    if (search && typeof search === "string" && search.trim()) {
      const q = search.trim();
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { location: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
      ];
    }

    // Filter by Location / Hub
    if (location && location !== "all" && location !== "All") {
      filter.location = { $regex: new RegExp(String(location), "i") };
    }

    // Filter by Price Range
    if (minPrice || maxPrice) {
      filter.price_per_day = {};
      if (minPrice) filter.price_per_day.$gte = Number(minPrice);
      if (maxPrice) filter.price_per_day.$lte = Number(maxPrice);
    }

    // Filter by Availability
    if (available !== undefined && available !== "") {
      filter.is_available = String(available) === "true";
    }

    // Sorting
    let sortOption: any = { createdAt: -1 };
    if (sortBy === "price_asc") sortOption = { price_per_day: 1 };
    else if (sortBy === "price_desc") sortOption = { price_per_day: -1 };
    else if (sortBy === "rating") sortOption = { rating: -1 };

    let items = await Item.find(filter).sort(sortOption);

    // If database returned 0 and no filters were applied, seed and re-query
    if (items.length === 0 && Object.keys(filter).length === 0) {
      await checkAndSeedItems();
      items = await Item.find().sort(sortOption);
    }

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (err: any) {
    console.error("Error fetching items:", err);
    res.status(500).json({ success: false, message: err.message || "Failed to fetch items" });
  }
};

// GET /api/v1/items/:id
export const getItemById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    let item = await Item.findById(id);

    // If not found by ObjectId, try title or fallback match
    if (!item) {
      res.status(404).json({ success: false, message: "Rental item not found" });
      return;
    }

    res.status(200).json({ success: true, data: item });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || "Invalid item ID" });
  }
};

// POST /api/v1/items
export const createItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      title,
      category,
      description,
      price_per_day,
      security_deposit,
      location,
      image_url,
      images,
      contact_number,
      specs,
      inclusions,
      owner_name,
    } = req.body;

    if (!title || !category || !price_per_day || !location) {
      res.status(400).json({
        success: false,
        message: "Title, category, price per day, and location are required.",
      });
      return;
    }

    const newItem = await Item.create({
      title: title.trim(),
      category: category.trim(),
      description: description || "",
      price_per_day: Number(price_per_day),
      security_deposit: security_deposit ? Number(security_deposit) : 20000,
      location: location.trim(),
      image_url: image_url || "https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=800&q=80",
      images: Array.isArray(images) && images.length ? images : (image_url ? [image_url] : []),
      contact_number: contact_number || "+94 77 123 4567",
      is_available: true,
      owner_name: owner_name || (req.user ? req.user.name : "RentLanka Verified Host"),
      owner_id: req.user ? req.user.id : undefined,
      specs: specs || {},
      inclusions: inclusions || [],
    });

    res.status(201).json({
      success: true,
      message: "Asset listed successfully on RentLanka marketplace!",
      data: newItem,
    });
  } catch (err: any) {
    console.error("Create item error:", err);
    res.status(500).json({ success: false, message: err.message || "Failed to create listing" });
  }
};

// PUT /api/v1/items/:id
export const updateItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updated = await Item.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    if (!updated) {
      res.status(404).json({ success: false, message: "Item not found" });
      return;
    }

    res.status(200).json({ success: true, message: "Listing updated", data: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/v1/items/:id
export const deleteItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await Item.findByIdAndDelete(id);

    if (!deleted) {
      res.status(404).json({ success: false, message: "Item not found" });
      return;
    }

    res.status(200).json({ success: true, message: "Listing deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
