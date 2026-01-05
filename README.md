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

- history array to maintain the conversation
- config
- systemInstruction
- readlineSync for taking input from user in terminal

## Lecture 04 : Introduction to Tools in Generative AI

- what are tools ?
- why tools are required ?
- basic flow of tools usage
    - user prompt
    - model decide to use tool
    - tool execution
    - tool response
    - model generate final response

## Lecture 05 : Calling External Tools / APIs in Generative AI
- Create function => tools
- execute tool based on model's decision
- maintain history with tool usage


## Lecture 06 :
## Lecture 07 :
## Lecture 08 : What is Vector
🌟[X Post](https://x.com/gauravkmaurya09/status/2008245829874954350?s=20)
- The Problem
    - Computers match letters, not meaning.
- Possible Solution
    - make categories
    - graphs with weights = matrix => analyse that matrix
    - Assign numbers to words and then find closeness
    - Vectors 
- Semantic Meaning => meaning of words/sentences based on context
- Vector => List of numbers representing semantic meaning
- Vector Embedding => process of translating that 'Semantic Meaning' into a 'Vector' in such a way that similar meanings end up with similar numbers.
- Who vectors are generated ?
    - Neural Networks



