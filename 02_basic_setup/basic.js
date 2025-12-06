import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "LLMs do not have memory unless explicitly provided with context. explain how to use chat history to simulate memory.",
  });
  console.log(response.text);
}

main();