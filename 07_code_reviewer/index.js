import { GoogleGenAI, Type } from "@google/genai";
import "dotenv/config";
import fs from "fs";
import path from "path";

const ai = new GoogleGenAI({ apiKey: process.env.GENAI_API_KEY });

async function readFileContent({ filePath }) {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    console.log("📖 Read file:", filePath);
    return { content };
  } catch (e) {
    return { error: `Failed to read file: ${e.message}` };
  }
}

async function writeFileContent({ filePath, content }) {
  try {
    fs.writeFileSync(filePath, content, "utf-8");
    console.log("💾 Written to:", filePath);
    return { success: true };
  } catch (e) {
    return { error: `Failed to write file: ${e.message}` };
  }
}

async function listDownAllFiles({ directoryPath }) {
  const files = [];
  const extensions = [".js", ".jsx", ".ts", ".tsx", ".json", ".html", ".css"];

  function scanDirectory(dir) {
    let items;
    try {
      items = fs.readdirSync(dir);
    } catch (e) {
      console.error(`Error reading dir ${dir}:`, e.message);
      return;
    }

    for (const item of items) {
      const fullPath = path.join(dir, item);
      if (
        fullPath.includes("node_modules") ||
        fullPath.includes(".git") ||
        fullPath.includes("dist")
      ) {
        continue;
      }

      try {
        const stats = fs.statSync(fullPath);
        if (stats.isDirectory()) {
          scanDirectory(fullPath);
        } else if (stats.isFile()) {
          const ext = path.extname(item);
          if (extensions.includes(ext)) {
            files.push(fullPath);
          }
        }
      } catch (e) {
        console.error(`Error accessing ${fullPath}:`, e.message);
      }
    }
  }

  scanDirectory(directoryPath);
  console.log("📂 Total files found:", files.length);
  return { files };
}

const listFileTool = {
  name: "listDownAllFiles",
  description: "List down all code files in the given directory path.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      directoryPath: {
        type: Type.STRING,
        description: "The directory path where to scan for code files.",
      },
    },
    required: ["directoryPath"],
  },
};

const readFileTool = {
  name: "readFileContent",
  description: "Read the content of a code file given its file path.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      filePath: {
        type: Type.STRING,
        description: "The full path of the code file to read.",
      },
    },
    required: ["filePath"],
  },
};

const writeFileTool = {
  name: "writeFileContent",
  description: "Write content to a code file given its file path.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      filePath: {
        type: Type.STRING,
        description: "The full path of the code file to write.",
      },
      content: {
        type: Type.STRING,
        description: "The content to write into the code file.",
      },
    },
    required: ["filePath", "content"],
  },
};

const tools = {
  listDownAllFiles: listDownAllFiles,
  readFileContent: readFileContent,
  writeFileContent: writeFileContent,
};

export async function runAgent(directoryPath) {
  console.log(`🔍 Reviewing: ${directoryPath}\n`);

  const contents = [
    {
      role: "user",
      parts: [
        {
          text: `Review and fix all JavaScript/TypeScript code in: ${directoryPath}`,
        },
      ],
    },
  ];

  const MAX_TURNS = 10;

  for (let i = 0; i < MAX_TURNS; i++) {
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        systemInstruction: `You are an expert Code Reviewer Agent.

                1. Start by using "listDownAllFiles" to see the project structure.
                2. Read files using "readFileContent".
                3. Fix bugs, add comments, and improve code quality.
                4. Write the fixed code back using "writeFileContent".
                5. Once finished, provide a text summary.
                
                IMPORTANT: When writing files, maintain the existing code style and imports.`,
        tools: [
          {
            functionDeclarations: [listFileTool, readFileTool, writeFileTool],
          },
        ],
      },
    });
    if (result.functionCalls?.length > 0) {
      // Execute all function calls
      for (const functionCall of result.functionCalls) {
        const { name, args } = functionCall;

        console.log(`📌 ${name}`);
        const toolResponse = await tools[name](args);

        // Add function call to history
        contents.push({
          role: "model",
          parts: [{ functionCall }],
        });

        // Add function response to history
        contents.push({
          role: "user",
          parts: [
            {
              functionResponse: {
                name,
                response: { result: toolResponse },
              },
            },
          ],
        });
      }
    } else {
      console.log("\n" + result.text);
      break;
    }
  }
}

const directory = process.argv[2] || '.';

await runAgent(directory);
