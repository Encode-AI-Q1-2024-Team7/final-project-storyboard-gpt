import OpenAI from 'openai';

export const openai = new OpenAI({
  // Uncomment below to use OpenAI API
    apiKey: process.env.OPENAI_API_KEY,

  // Or uncomment below to use local instance of text-generation API
  // baseURL: `http://127.0.0.1:5000/v1`, 
});
