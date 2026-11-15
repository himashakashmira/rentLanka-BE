import { Request, Response } from "express";

// generate description using gemini api
export const generateItemDescription = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, category } = req.body;

    if (!title) {
      res.status(400).json({ success: false, message: "Item title is required" });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY || "";

    // fallback smart template if no api key provided
    if (!apiKey) {
      const generated = `High quality ${title} in the ${category || "General"} category. Well maintained and inspected for rental. Available for daily hire across Sri Lanka with full owner support.`;
      res.status(200).json({ success: true, description: generated });
      return;
    }

    // call gemini api endpoint
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Write a short 2-3 sentence rental advertisement description for a '${title}' in the '${category}' category in Sri Lanka. Focus on condition, reliability, and rental readiness.`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    res.status(200).json({
      success: true,
      description: text || `Well-maintained ${title} ready for rent. Tested and fully operational.`,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};