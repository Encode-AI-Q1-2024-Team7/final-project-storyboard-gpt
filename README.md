# Encode AI Team 7: project-3-painter-gpt

## Project Description

A Painter GPT program that suggests vivid ideas for a painting based on an art theme. A user selected art theme is sent to an OpenAI Assistant named 'DaVinci' who is a professional painter. DaVinci will provide the descriptive details and also paint the masterpiece upon request.

### Sample Demo

https://github.com/Encode-AI-Q1-2024-Team7/project-3-painter-gpt/assets/105133922/7b78f9c1-c756-4052-9711-5eee30456e33

## Instructions

### 1. Clone git repo

### 2. Install Dependencies

From root directory

```text
npm install
```

### 3. Setting up your keys and OPEN AI Assistant

- Rename `.env.example` to `.env`

- Include your Open AI key for `OPENAI_API_KEY=` in the env file
  - Sign up for an api key at [OpenAI](https://openai.com/)
- (Optional) Include an `ASSISTANT_ID=` in the env file. A new assistant will be created if one is not provided.

---

### 4. Run App

Run command in terminal of root directory:

```text
npm run dev
```

Open link in browser (Default link): [http://localhost:3000/](http://localhost:3000/)
