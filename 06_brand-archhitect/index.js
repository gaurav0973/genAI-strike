import { GoogleGenAI, Type } from "@google/genai";
import readlineSync from "readline-sync";
import "dotenv/config";
import { createFile, executeCommand, scrapeProfile } from "./tools.js";
import { systemPrompt } from "./constant.js";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// 1. Tool Implementation Map
const toolFunctions = {
  createFile: createFile,
  executeCommand: executeCommand,
  scrapeProfile: scrapeProfile, // The new superpower
};

// 2. Tool Definitions (Schema for Gemini)
const tools = [
  {
    functionDeclarations: [
      {
        name: "createFile",
        description: "Creates a file. Use this for HTML, CSS, JS.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            filePath: { type: Type.STRING, description: "Path (e.g. bio_site/index.html)" },
            content: { type: Type.STRING, description: "File content" },
          },
          required: ["filePath", "content"],
        },
      },
      {
        name: "executeCommand",
        description: "Executes terminal commands (mkdir only).",
        parameters: {
          type: Type.OBJECT,
          properties: {
            command: { type: Type.STRING },
          },
          required: ["command"],
        },
      },
      {
        name: "scrapeProfile",
        description: "Scrapes a social media URL to get public Name, Bio, and Image.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            url: { type: Type.STRING, description: "The full URL (e.g. https://x.com/username)" },
          },
          required: ["url"],
        },
      },
    ],
  },
];

// 3. Main Loop
const pastConversation = [];

async function handleUserQuery(userQuery) {
  pastConversation.push({ role: "user", parts: [{ text: userQuery }] });

  while (true) {
    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp", // Ensure you are using a capable model
      contents: pastConversation,
      config: {
        systemInstruction: systemPrompt(),
        tools: tools,
      },
    });

    // Handle Tool Calls
    if (result.functionCalls && result.functionCalls.length > 0) {
      const functionCall = result.functionCalls[0];
      const { name, args } = functionCall;

      if (!toolFunctions[name]) throw new Error(`Unknown tool: ${name}`);

      const toolResponse = await toolFunctions[name](args);

      pastConversation.push({
        role: "model",
        parts: [{ functionCall: functionCall }],
      });

      pastConversation.push({
        role: "user",
        parts: [{
          functionResponse: {
            name: name,
            response: { result: toolResponse },
          },
        }],
      });
    } else {
      // Final Answer
      const text = result.text;
      console.log(`\n🤖 AI: ${text}`);
      pastConversation.push({ role: "model", parts: [{ text: text }] });
      break;
    }
  }
}

async function main() {
  console.log("🚀 Link-in-Bio Generator Started");
  console.log("👉 Paste a Twitter URL to generate a site automatically.");
  console.log("--------------------------------");

  while (true) {
    const question = readlineSync.question("\nInput URL (or 'exit'): ");
    if (question.toLowerCase() === "exit") break;
    await handleUserQuery(question);
  }
}

main();