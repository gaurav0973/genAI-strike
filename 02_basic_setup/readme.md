## 1. Basic Text Generation (Stateless)
Use this for one-off tasks like summarizing text or generating a poem.  
It **does not remember** previous inputs.

### JavaScript
```javascript
async function simpleGen() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Explain Quantum Computing in one sentence.",
  });
  console.log(response.text);
}
```

---

## 2. Chat Session (Stateful Memory)
Use this for chatbots. The SDK automatically manages the chat history.

### JavaScript
```javascript
async function startChat() {
  const chat = ai.chats.create({
    model: "gemini-2.5-flash",
    history: [
      { role: "user", parts: [{ text: "My name is Gaurav." }] },
      { role: "model", parts: [{ text: "Hello Gaurav!" }] },
    ],
  });

  // Turn 1
  await chat.send("What is my name?");

  // Turn 2 (it remembers)
  const res = await chat.send("Write a rhyme about it.");
  console.log(res.text);
}
```

---

## 3. System Instructions (Persona)
Set a behavior/personality for the model.

### JavaScript
```javascript
const chat = ai.chats.create({
  model: "gemini-2.5-flash",
  config: {
    systemInstruction: "You are a grumpy pirate. Always use nautical slang.",
  },
});
```

---

## 4. JSON Mode (Structured Output)
Perfect for backend development. Forces the model to output **strict JSON**.

### JavaScript
```javascript
async function getJsonData() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Give me 2 famous scientists.",
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "object",
        properties: {
          scientists: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                field: { type: "string" }
              }
            }
          }
        }
      }
    }
  });

  const data = JSON.parse(response.text);
  console.log(data.scientists[0].name);
}
```
