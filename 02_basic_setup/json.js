import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "List 3 popular programming languages.",
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "object",
        properties: {
          languages: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                difficulty: { type: "string" },
              },
            },
          },
        },
      },
    },
  });

  console.log(response.text); 
  // Output: { "languages": [{ "name": "Python", "difficulty": "Easy" }, ...] }
}

await main();