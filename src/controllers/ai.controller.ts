import { Request, Response } from "express";

// Smart contextual generator for fallback descriptions
const generateFallbackDescription = (title: string, category: string, hub: string = "Sri Lanka"): string => {
  const t = title.toLowerCase();

  if (category.toLowerCase().includes("camera") || t.includes("camera") || t.includes("lens") || t.includes("rig") || t.includes("sony")) {
    return `Production-ready ${title} in pristine condition, fully inspected and calibrated for high-end cinematic shoots, commercial broadcast, and photography across ${hub}. Includes standard flight transport case, power accessories, and verified owner onboarding. Available for flexible single-day or multi-week production rentals with full RentLanka Shield™ escrow security hold.`;
  }

  if (category.toLowerCase().includes("vehicle") || t.includes("cab") || t.includes("hilux") || t.includes("suv") || t.includes("car")) {
    return `Clean, reliable, and meticulously maintained ${title} available for hire across ${hub} and islandwide touring. Features full air conditioning, comprehensive all-island commercial rental insurance, high ground clearance, and an ample luggage bed. Ideal for corporate site inspections, holiday travel, or production crews. Valid driving license and NIC required upon handover.`;
  }

  if (category.toLowerCase().includes("construction") || t.includes("excavator") || t.includes("cat") || t.includes("loader")) {
    return `Industrial-grade ${title} ready for heavy earthmoving, trenching, road development, and site preparation across ${hub}. Certified maintenance history with minimal machine hours, high fuel efficiency, and reinforced bucket/arm assembly. Complies with local safety regulations with low-bed transport coordination available upon booking.`;
  }

  if (category.toLowerCase().includes("tool") || category.toLowerCase().includes("machinery") || t.includes("generator") || t.includes("hammer")) {
    return `Heavy-duty ${title} engineered for rigorous contractor work and event power reliability. Inspected prior to dispatch with tested voltage stability, full safety guards, and operating accessories included. Perfect for builders, event organizers, and industrial backup throughout ${hub}.`;
  }

  if (category.toLowerCase().includes("motorcycle") || t.includes("bike") || t.includes("honda") || t.includes("scooter")) {
    return `Excellently serviced ${title} prepared for city commuting and scenic coastal cruising in ${hub}. Excellent fuel economy, responsive braking with dual safety helmets, and luggage rack included. Ride with peace of mind backed by 24/7 roadside assistance coordination.`;
  }

  return `High-performance ${title} in the ${category || "General"} sector. Maintained to commercial standards and verified for immediate dispatch in ${hub}. Complete with manufacturer operating manual, essential accessories, and backed by RentLanka Escrow protection for a seamless peer-to-peer rental experience.`;
};

// POST /api/v1/ai/generate-description
export const generateItemDescription = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, category, location, specs } = req.body;

    if (!title) {
      res.status(400).json({ success: false, message: "Item title is required for AI generation" });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY || "";

    if (!apiKey) {
      const generated = generateFallbackDescription(title, category || "Equipment", location || "Sri Lanka");
      res.status(200).json({
        success: true,
        description: generated,
        source: "RentLanka Smart Engine (Ready for Gemini API Key)",
      });
      return;
    }

    // Call Google Gemini API
    try {
      const promptText = `You are a professional copywriter for RentLanka, Sri Lanka's leading peer-to-peer rental marketplace for vehicles, heavy machinery, cinema gear, and industrial tools.
Write an engaging, SEO-optimized, highly trustworthy 3-4 sentence rental listing advertisement for:
- Title: "${title}"
- Category: "${category || "Equipment"}"
- Hub/Location: "${location || "Colombo, Sri Lanka"}"
${specs ? `- Technical Specs: ${JSON.stringify(specs)}` : ""}

Focus on equipment condition, reliability, included accessories, use cases (film, construction, road trips, corporate), and islandwide readiness. Do not use generic filler words or markdown headings, just return pure clean polished descriptive text suitable for the listing description field.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 250,
            },
          }),
        }
      );

      const data = await response.json();
      const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

      if (generatedText) {
        res.status(200).json({
          success: true,
          description: generatedText,
          source: "Google Gemini 1.5 Flash",
        });
        return;
      }
    } catch (apiErr: any) {
      console.warn("Gemini API call failed, falling back to smart engine:", apiErr.message);
    }

    // Smart fallback if API call fails
    const fallback = generateFallbackDescription(title, category || "Equipment", location || "Sri Lanka");
    res.status(200).json({
      success: true,
      description: fallback,
      source: "RentLanka Smart Engine (Fallback)",
    });
  } catch (err: any) {
    console.error("AI controller error:", err);
    res.status(500).json({ success: false, message: err.message || "Failed to generate AI description" });
  }
};
