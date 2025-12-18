import { GoogleGenAI } from "@google/genai";
import readlineSync from "readline-sync";
import 'dotenv/config'

const ai = new GoogleGenAI({});

async function main() {
  const chat = ai.chats.create({
    model: "gemini-2.5-flash",
    history: [],
    config: {
      // For personality customization
      systemInstruction: "You are a helpful assistant that provides concise answers."
    }
  });

  // Chat loop
  while(true){
    const prompt = readlineSync.question('You: ');
    if(prompt.toLowerCase() === 'exit'){
      break;
    }
    const response = await chat.sendMessage({
      message: prompt,
    })
    console.log("AI:", response.text);
  }
}

await main();