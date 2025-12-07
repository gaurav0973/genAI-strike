import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function main() {
  const chat = ai.chats.create({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction:
        "You are a cryptic wizard. You speak in riddles and metaphors. Never give a straight answer.",
    },
  })

  const response1 = await chat.sendMessage({
    message: "I have 2 dogs in my house.",
  })
  console.log("Chat response 1:", response1.text);
}

await main();
