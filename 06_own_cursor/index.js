import { GoogleGenAI, Type } from "@google/genai";
import { exec } from "child_process";
import readlineSync from "readline-sync";
import "dotenv/config";
import util from "util";
import os from "os";
import { createFile, executeCommand } from "./tools.js";
import { systemPrompt } from "./constant.js";


const execute = util.promisify(exec);
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const platform = os.platform();


//1. Tools in tool function
const toolFunctions = {
  createFile: createFile,
  executeCommand: executeCommand,
};

//2. Tool Definition
const tools = [
  {
    functionDeclarations: [
      {
        name: "createFile",
        description:
          "Creates or overwrites a file with specific content. Use this for HTML, CSS, JS, etc.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            filePath: {
              type: Type.STRING,
              description: "Path to the file (e.g., 'calculator/index.html')",
            },
            content: {
              type: Type.STRING,
              description: "The content to write inside the file.",
            },
          },
          required: ["filePath", "content"],
        },
      },
      {
        name: "executeCommand",
        description:
          "Executes terminal commands. Use ONLY for creating folders (mkdir) or checking versions.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            command: {
              type: Type.STRING,
              description: "The terminal command to run.",
            },
          },
          required: ["command"],
        },
      },
    ],
  },
];

//3. Talking to AI
const pastConversation = [];
async function handleUserQuery(userQuery) {

  while (true) {


    //1. API call to gemini
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: pastConversation,
      config: {
        systemInstruction : systemPrompt(platform),
        tools : tools,
      },
    });

    //2. Get responce from Tool Call
    if (result.functionCalls && result.functionCalls.length > 0) {

      const functionCall = result.functionCalls[0];
      const { name, args } = functionCall;


      const toolResponse = await toolFunctions[name](args);

      const functionResponsePart = {
        name: functionCall.name,
        response: { 
          result: toolResponse
        },
      };

      // send response back to model
      pastConversation.push({
        role: "model",
        parts: [{ functionCall: functionCall }],
      });
      pastConversation.push({
        role: "user",
        parts: [{ functionResponse: functionResponsePart }],
      });

    } 
    else {
      console.log(`AI: ${result.text}`);
      pastConversation.push({
        role: "model",
        parts: [{ text: result.text }],
      });
      break;
    }
  }
}

async function main() {
  console.log("🚀 Website Builder Agent Started");
  console.log("--------------------------------");

  while (true) {
    const question = readlineSync.question(
      "\nWhat should I build? (or 'exit'): "
    );
    if (question.toLowerCase() === "exit") break;

    pastConversation.push({
      role: "user",
      parts: [{ text: question }],
    });

    await handleUserQuery(question);
  }
}
main()