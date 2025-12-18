import { GoogleGenAI, Type } from "@google/genai";
import readlineSync from "readline-sync"
import 'dotenv/config'
import { cryptoCurrency, weatherInformation } from "./tools.js";


// 1. initialise my AI client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// 2. my tools in toolFunction
const toolFunctions = {
  cryptoCurrency: cryptoCurrency,
  weatherInformation: weatherInformation,
};

// 3. provide tool definitions to AI
const cryptoInfo = {
  name: "cryptoCurrency",
  description:
    "We can give you the current price or other information related to cryptocurrency like bitcoin and ethereum etc",
  parameters: {
    type: Type.OBJECT,
    properties: {
      coin: {
        type: Type.STRING,
        description:
          "It will be the name of the cryptocurrency like bitcoin, ethereum, etc",
      },
    },
    required: ["coin"],
  },
};
const weatherInfo = {
  name: "weatherInformation",
  description:
    "You can get the current weather information of any city like london, goa etc",
  parameters: {
    type: Type.OBJECT,
    properties: {
      city: {
        type: Type.STRING,
        description:
          "Name of the city for which I have to fetch weather information like london, goa etc",
      },
    },
    required: ["city"],
  },
};
const tools = [
  {
    functionDeclarations: [cryptoInfo, weatherInfo],
  },
];

// 4. Now lets talk with agent
const history = [];
async function runAgent() {
  while (true) {
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: history,
      config: { tools },
    });

    if (result.functionCalls && result.functionCalls.length > 0) {
      const functionCall = result.functionCalls[0];
      const { name, args } = functionCall;
      const response = await toolFunctions[name](args);
      const functionResponsePart = {
        name: functionCall.name,
        response: {
          result: response,
        },
      };

      // Send the function response back to the model.
      history.push({
        role: "model",
        parts: [{ functionCall: functionCall }],
      });

      history.push({
        role: "user",
        parts: [{ functionResponse: functionResponsePart }],
      });
    }
    else{
        history.push({
            role:'model',
            parts:[{text:result.text}]
        });
        console.log(result.text);
        break;
    }
  }
}


while(true){
    
    const question = readlineSync.question('Ask me anything: ');

    if(question == 'exit'){
        break;
    }

    history.push({
        role:'user',
        parts:[{text:question}]
    });

    await runAgent();
}
