import { Request, Response } from "express";
import dotenv from "dotenv";
import Item from "../models/Item";

dotenv.config();

// sleep helper for retries (just like Thread.sleep in Spring Boot)
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ============================================================================
// GENERATE ITEM DESCRIPTION (AI Copywriter)
// ============================================================================
export const generateItemDescription = async (req: Request, res: Response): Promise<void> => {
  const { title, category, location, specifications } = req.body;

  if (!title) {
    res.status(400).json({ success: false, message: "Item title is required" });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY || "";
  const models = ["gemini-1.5-flash-latest", "gemini-2.0-flash", "gemini-1.5-flash"];

  const prompt = `
You are 'RentLanka AI', an expert equipment and vehicle copywriter for RentLanka (Sri Lanka).
Generate a rich, persuasive 2-paragraph rental advertisement (80-100 words) for:
- Title: "${title}"
- Category: "${category || 'General'}"
- Location: "${location || 'Colombo'}"
${specifications ? `- Specs: ${JSON.stringify(specifications)}` : ''}

Rules:
1. Mention real condition, reliability, and local Sri Lankan use-cases (road trips, commercial shoots, projects).
2. Do not use quotes or robotic filler.
`.trim();

  if (apiKey) {
    for (const model of models) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        });

        if (response.ok) {
          const data = await response.json();
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
          if (text) {
            res.status(200).json({ success: true, description: text });
            return;
          }
        }
      } catch (err) {
        // try next model
      }
    }
  }

  // fallback description
  res.status(200).json({
    success: true,
    description: `High-quality ${title} available for verified rental in ${location || 'Sri Lanka'}. Fully tested, inspected, and maintained in mint condition for immediate handover.`,
  });
};

// ============================================================================
// CHAT WITH RENTLANKA AI (Spring Boot Architecture with Live MongoDB Fleet Context)
// ============================================================================
export const chatWithRentLankaAI = async (req: Request, res: Response): Promise<void> => {
  const { message } = req.body;

  if (!message || typeof message !== "string" || !message.trim()) {
    res.status(400).json({ success: false, message: "Message is required" });
    return;
  }

  const userMessage = message.trim();
  const apiKey = process.env.GEMINI_API_KEY || "";

  // 1. Fetch live system context from database (just like Spring Boot service)
  let activeItems: any[] = [];
  try {
    activeItems = await Item.find({ is_available: true })
      .select("title category location price_per_day is_available")
      .lean();
  } catch (err: any) {
    console.warn("MongoDB fleet fetch error:", err.message);
  }

  // Format real fleet context
  const fleetInventory = activeItems.length > 0
    ? activeItems.map(i => `• ${i.title} (${i.category}) in ${i.location} at LKR ${Number(i.price_per_day).toLocaleString()}/day`).join("\n")
    : "No fleet items currently listed.";

  // 2. Build system instructions (Exact Spring Boot structure)
  const systemInstructions = `
You are 'RentLanka Concierge', the intelligent customer assistant and rental advisor for 'RentLanka' marketplace in Sri Lanka.

STORE LIVE DATA CONTEXT:
Total Available Items: ${activeItems.length}
Current Live Inventory:
${fleetInventory}

KNOWLEDGE & BEHAVIOR RULES:
1. STORE INQUIRIES & AVAILABILITY:
   - Check the LIVE INVENTORY above to answer questions about vehicles, equipment, and locations.
   - If the user asks about cars or items in a specific city (e.g. "Matara", "Beliatta", "Galle", "Colombo"):
     * Check if an item exists in that city in the inventory.
     * If yes, name the exact item, category, location, and daily rate in LKR (e.g., "2017 Vitz in Matara for LKR 5,000/day" or "Honda Dio in Beliatta for LKR 2,500/day").
     * If no exact match for that city, state what is available and suggest the nearest town.
2. POLICIES & ESCROW:
   - Security deposits are held securely via LankaPay escrow and refunded within 2-4 hours after safe return.
3. STRICT OFF-TOPIC RESTRICTION:
   - If the user asks about anything completely unrelated to rentals (e.g. politics, coding, medical advice, cooking, celebrities), politely refuse:
     "I am an AI consultant dedicated exclusively to equipment and vehicle rentals on RentLanka. I cannot assist with unrelated topics."
4. TONE & LANGUAGE:
   - Respond politely and concisely (2-3 sentences) in the language of the user (Sinhala, English, or Singlish).
`.trim();

  // 3. Retry loop (Exact Spring Boot maxRetries = 3 with delay)
  const maxRetries = 3;
  const models = ["gemini-1.5-flash-latest", "gemini-2.0-flash", "gemini-1.5-flash"];

  if (apiKey) {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const model = models[attempt % models.length];
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const requestBody = {
          contents: [
            {
              parts: [{ text: `${systemInstructions}\n\nUser Question: ${userMessage}` }],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 500,
          },
        };

        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });

        if (response.ok) {
          const root = await response.json();
          const reply = root?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
          if (reply) {
            res.status(200).json({ success: true, reply, source: model });
            return;
          }
        }

        // Delay between retries (just like Thread.sleep(1500) in Java)
        await sleep(1200);
      } catch (err: any) {
        console.warn(`Retry attempt ${attempt + 1} failed:`, err.message);
        await sleep(1200);
      }
    }
  }

  // 4. Smart Local Matcher Fallback (Guaranteed to answer Matara, Beliatta, etc. accurately if API is offline)
  const queryLower = userMessage.toLowerCase();
  const matched = activeItems.filter(i =>
    queryLower.includes(i.location.toLowerCase()) ||
    queryLower.includes(i.title.toLowerCase())
  );

  if (matched.length > 0) {
    const list = matched.map(m => `• ${m.title} in ${m.location} for LKR ${Number(m.price_per_day).toLocaleString()}/day`).join("\n");
    res.status(200).json({
      success: true,
      reply: `Yes! Here are the matching rentals available in our database:\n${list}\n\nYou can book any of these directly on RentLanka!`,
      source: "db-matcher",
    });
    return;
  }

  res.status(200).json({
    success: true,
    reply: `Hello! We currently have ${activeItems.length} verified rentals available across Sri Lanka including cars, bikes, and cameras. How can I assist with your hire today?`,
    source: "fallback",
  });
};

export const chatWithAi = chatWithRentLankaAI;