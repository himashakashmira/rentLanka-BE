import { Request, Response } from "express";
import dotenv from "dotenv";
import Item from "../models/Item";

dotenv.config();

// sleep helper identical to Java's Thread.sleep(1500)
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const generateItemDescription = async (req: Request, res: Response): Promise<void> => {
  const { title, category, location, specifications } = req.body;

  if (!title) {
    res.status(400).json({ success: false, message: "Item title is required" });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY || "";
  const maxRetries = 3;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[RentLanka AI] Attempt ${attempt} of ${maxRetries} for: ${title}`);

      // Build system instructions matching your Java Aurum AI pattern
      const systemInstructions = `
You are 'RentLanka AI', the expert commercial equipment copywriter and rental consultant for RentLanka Marketplace (Sri Lanka).

ITEM CONTEXT:
- Title: ${title}
- Category: ${category || "General"}
- Handover Hub: ${location || "Colombo"}
${specifications ? `- Technical Specs: ${JSON.stringify(specifications)}` : ""}

KNOWLEDGE & WRITING RULES:
1. DEEP REAL PRODUCT KNOWLEDGE:
   - Identify the exact product "${title}". Detail its real-world specs (e.g. if JBL PartyBox: mention explosive pro sound, deep punchy bass, dynamic party lightshow, wireless mic inputs, and long battery life. If vehicle: interior comfort, AC, automatic/manual transmission, and fuel economy. If camera: 4K/8K resolution, dynamic range, and lens clarity).
2. TONE & STRUCTURE:
   - Write a rich, persuasive 2-paragraph rental advertisement (around 80-120 words).
   - Paragraph 1: Product features, power, and condition.
   - Paragraph 2: Ideal use-cases in Sri Lanka (events, road trips, commercial shoots) and handover readiness.
   - Do NOT use quotation marks. Do not use generic robotic filler.
      `.trim();

      // Working Gemini Model Endpoint
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`;

      const requestBody = {
        contents: [
          {
            parts: [{ text: systemInstructions + `\n\nGenerate listing description for: ${title}` }],
          },
        ],
      };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error?.message || response.statusText);
      }

      const root = await response.json();
      const generatedText = root?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

      if (!generatedText) {
        throw new Error("Empty text in Gemini response");
      }

      console.log(`[RentLanka AI] Succeeded on attempt ${attempt}!`);
      res.status(200).json({
        success: true,
        description: generatedText,
      });
      return; // Success, exit function
    } catch (e: any) {
      console.log(`[RentLanka AI] Attempt ${attempt} failed:`, e.message);

      if (attempt === maxRetries) {
        res.status(200).json({
          success: true,
          description: `High-performance ${title} available for rental in ${location || 'Sri Lanka'}. Maintained in mint condition and fully tested for immediate handover.`,
        });
        return;
      }

      await sleep(1500);
    }
  }
};


export const chatWithRentLankaAI = async (req: Request, res: Response): Promise<void> => {
  const { message } = req.body;

  if (!message || typeof message !== "string" || !message.trim()) {
    res.status(400).json({ success: false, message: "A user message string is required" });
    return;
  }

  const userQuery = message.trim();

  // 1. Fetch live fleet context from MongoDB
  let fleetSummary = "No active fleet listed";
  let activeItems: any[] = [];
  try {
    activeItems = await Item.find({ is_available: true })
      .select("title category price_per_day location security_deposit")
      .limit(35);

    if (activeItems.length > 0) {
      fleetSummary = activeItems
        .map(
          (i) =>
            `${i.title} (${i.category}) in ${i.location} at LKR ${Number(i.price_per_day).toLocaleString()}/day`
        )
        .join("; ");
    }
  } catch (dbErr: any) {
    console.warn("[RentLanka AI] MongoDB live fleet context fetch error:", dbErr.message);
  }

  // 2. Build strict system instructions (matching Java/RAD specification)
  const systemInstructions = `
You are 'RentLanka AI', the official intelligent rental consultant for 'RentLanka' marketplace in Sri Lanka.

LIVE DATABASE FLEET CONTEXT:
Available items currently in system: [ ${fleetSummary} ]
Escrow terms: Refundable deposit held securely via LankaPay escrow and returned within 2-4 hours after safe return.

BEHAVIOR & KNOWLEDGE RULES:
1. RENTLANKA INQUIRIES:
   - Answer questions about available vehicles, cameras, tools, machinery, rental rates, pickup locations, and booking procedures using the live fleet context above.
   - If an item is NOT in the database, politely state that it is currently not listed and suggest checking back later or browsing similar categories.

2. STRICT NON-RENTAL RESTRICTION (CRITICAL GUARDRAIL):
   - If the user asks about ANYTHING unrelated to RentLanka rentals (e.g. politics, who is president, sports, weather, coding, movies, medical advice, cooking), you MUST POLITELY REFUSE:
     "I am RentLanka AI, dedicated exclusively to assisting with rental equipment, vehicles, and bookings on RentLanka. I cannot assist with unrelated topics."
     (If asked in Sinhala, respond: "සමාවෙන්න, මට සහාය විය හැක්කේ RentLanka හි වාහන, උපකරණ කුලියට ගැනීම් සහ වෙන්කිරීම් පිළිබඳව පමණි.")

3. LANGUAGE & TONE:
   - Respond warmly and concisely in the user's language (Sinhala, English, or Singlish).
`.trim();

  // Helper guardrail check for fallback / offline simulation
  const isSinhala = /[\u0D80-\u0DFF]/.test(userQuery);
  const isOffTopic = (text: string): boolean => {
    const lower = text.toLowerCase();
    const offTopicKeywords = [
      "president", "politics", "minister", "parliament", "election", "vote",
      "weather", "forecast", "rain", "temperature",
      "movie", "cinema film", "actor", "actress", "song", "cricket", "football", "ipl", "match",
      "coding", "write code", "python", "javascript", "react", "bug", "algorithm",
      "doctor", "medicine", "headache", "recipe", "cook", "biryani",
    ];
    return offTopicKeywords.some((kw) => lower.includes(kw));
  };

  const refusalMessage = isSinhala
    ? "සමාවෙන්න, මට සහාය විය හැක්කේ RentLanka හි වාහන, උපකරණ කුලියට ගැනීම් සහ වෙන්කිරීම් පිළිබඳව පමණි."
    : "I am RentLanka AI, dedicated exclusively to assisting with rental equipment, vehicles, and bookings on RentLanka. I cannot assist with unrelated topics.";

  if (isOffTopic(userQuery)) {
    res.status(200).json({
      success: true,
      reply: refusalMessage,
    });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY || "";
  const maxRetries = 3;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[RentLanka AI Chat] Attempt ${attempt} of ${maxRetries} for: "${userQuery.slice(0, 30)}..."`);

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`;

      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: `${systemInstructions}\n\nUser Question: ${userQuery}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 600,
        },
      };

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error?.message || response.statusText);
      }

      const root = await response.json();
      const generatedText = root?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

      if (!generatedText) {
        throw new Error("Empty text in Gemini response");
      }

      console.log(`[RentLanka AI Chat] Succeeded on attempt ${attempt}!`);
      res.status(200).json({
        success: true,
        reply: generatedText,
      });
      return;
    } catch (e: any) {
      console.log(`[RentLanka AI Chat] Attempt ${attempt} failed:`, e.message);

      if (attempt === maxRetries) {
        // High-fidelity fallback based on live database fleet context
        const lowerQ = userQuery.toLowerCase();
        let fallbackReply = "";

        if (lowerQ.includes("deposit") || lowerQ.includes("escrow") || lowerQ.includes("refund")) {
          fallbackReply = isSinhala
            ? "RentLanka හි සියලුම තැන්පතු LankaPay escrow හරහා සුරක්ෂිතව තබා ගන්නා අතර භාණ්ඩය ආපසු භාරදී පැය 2-4ක් ඇතුළත ආපසු මුදා හරිනු ලැබේ."
            : "RentLanka holds all refundable security deposits securely via LankaPay escrow. Once equipment is safely returned and inspected, the hold is automatically released within 2 to 4 hours.";
        } else if (lowerQ.includes("car") || lowerQ.includes("vehicle") || lowerQ.includes("prado") || lowerQ.includes("hilux")) {
          const vehicles = activeItems.filter((i) => i.category === "Vehicles");
          if (vehicles.length > 0) {
            fallbackReply = `Currently available vehicles: ${vehicles.map(v => `${v.title} in ${v.location} (LKR ${Number(v.price_per_day).toLocaleString()}/day)`).join("; ")}. All vehicle hires include comprehensive commercial insurance.`;
          } else {
            fallbackReply = "We have rugged 4x4 double cab Hiluxes and Toyota Land Cruiser Prados available for regional travel across Sri Lanka. Check our Explore Rentals tab for full availability!";
          }
        } else if (lowerQ.includes("camera") || lowerQ.includes("fx6") || lowerQ.includes("cine") || lowerQ.includes("lens")) {
          const cameras = activeItems.filter((i) => i.category === "Cameras");
          if (cameras.length > 0) {
            fallbackReply = `Available cine cameras in stock: ${cameras.map(c => `${c.title} in ${c.location} at LKR ${Number(c.price_per_day).toLocaleString()}/day`).join("; ")}. Ready for immediate shoot handover.`;
          } else {
            fallbackReply = "We have production-ready Sony FX6 full-frame cinema kits and GM lenses available in Colombo with V-Mount battery sets.";
          }
        } else if (lowerQ.includes("colombo") || lowerQ.includes("kandy") || lowerQ.includes("galle")) {
          const locMatched = activeItems.filter((i) => lowerQ.includes(i.location.toLowerCase()));
          if (locMatched.length > 0) {
            fallbackReply = `Here are active rentals in your requested region: ${locMatched.slice(0, 4).map(m => `${m.title} at LKR ${Number(m.price_per_day).toLocaleString()}/day`).join("; ")}.`;
          } else {
            fallbackReply = "RentLanka connects verified hosts across Colombo, Kandy, Galle, and Jaffna with islandwide courier delivery available.";
          }
        } else {
          fallbackReply = isSinhala
            ? `RentLanka වෙත සාදරයෙන් පිළිගනිමු! අපගේ ක්‍රියාකාරී පද්ධතියේ වාහන, කැමරා සහ යන්ත්‍රෝපකරණ ${activeItems.length}ක් ලැයිස්තුගත කර ඇත. ඔබට අවශ්‍ය උපකරණය පිළිබඳව විමසන්න.`
            : `Hello! I am RentLanka AI. We currently have ${activeItems.length} verified pieces of equipment and vehicles available across Sri Lanka (4x4 SUVs, FX6 cinema rigs, excavators, and power gear). How can I assist with your hire today?`;
        }

        res.status(200).json({
          success: true,
          reply: fallbackReply,
        });
        return;
      }

      await sleep(1500);
    }
  }
};
