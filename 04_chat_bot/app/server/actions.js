"use server";

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });

// Now accepts 'history' array
export async function getChatResponse(history, userMessage) {
  try {
    const chat = ai.chats.create({
      model: "gemini-2.0-flash",
      // Pass the previous conversation history here
      history: history,
      config: {
        systemInstruction:
          "You are a helpful assistant. Keep answers brief and strict.",
      },
    });

    const response = await chat.sendMessage({
      message: userMessage,
    });

    return { success: true, text: response.text };
  } catch (error) {
    console.error("AI Error:", error);

    // Check for Quota Exceeded (429)
    if (
      error.status === 429 ||
      error.message?.includes("429") ||
      error.message?.includes("quota")
    ) {
      return {
        success: false,
        text: "⚠️ API Quota Exceeded. Please try again later or use a different API key.",
      };
    }

    return { success: false, text: "Error: Unable to reach AI." };
  }
}
