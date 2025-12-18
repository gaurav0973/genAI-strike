## Lecture 01 : Basic Theory of Generative AI
🌟[X Post](https://x.com/gauravkmaurya09/status/1996448975457833299?s=20)
---
- Generative AI
- Context Window
- Token and Tokenization
- Tokens Vs Words
- ChatBots don't think, they predict!
- Temperature
- don't remembers the past conversations

## Lecture 02 : Basic Setup for Generative AI Projects
- 🌟[X Post](https://x.com/gauravkmaurya09/status/1997314412890493373?s=20)
- 🌟[Gitub Code](https://github.com/gauravkmaurya09/genAI-strike)
- Repo usage Guide
    - npm install
    - create .env file and add your API key
    - npm run file_name (without .js)
        - npm run basic
        - npm run history
---
- Setting up Node.js Environment
- API keys 
- [Basic setup](https://ai.google.dev/gemini-api/docs/quickstart)
- [Text Generation Example](https://ai.google.dev/gemini-api/docs/text-generation)
- only give responce based on the context provided
    - *simple prompt* : what is my name ?
    - *answer* : I don't know your name. Please provide more context.
    - **context prompt** : My name is Gaurav Maurya. what is my name ?
    - **answer** : Your name is Gaurav Maurya.
- context = previous conversation + current prompt
- Some questions 
    - How they maintain history ?
    - Time is randomly showing in responce when asked for current date and time ?
    - what is readlineSync and why we need it ?
    - how history is maintained in the code ?


## Lecture 03 : Maintaining History in Chatbots
🌟[X Post](https://x.com/gauravkmaurya09/status/1998224861864867072?s=20)

## Lecture 04 : Introduction to Tools in Generative AI


## Lecture 05 : Calling External Tools / APIs in Generative AI
🌟[X Post](https://x.com/gauravkmaurya09/status/1999114862642049280?s=20)
- Create function => tools
- 