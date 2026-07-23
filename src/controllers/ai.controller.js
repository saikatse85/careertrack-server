import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const suggestApplication = async (req, res, next) => {
  try {
    const { companyName, jobTitle, notes } = req.body;

    const prompt = `
You are a professional career coach.

Company: ${companyName}
Job Title: ${jobTitle}
Notes: ${notes}

Give:
1. Resume Tips
2. Interview Tips
3. Skills to prepare
4. Follow-up advice

Return in Markdown.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    res.json({
      success: true,
      data: response.text,
    });
  } catch (err) {
    next(err);
  }
};