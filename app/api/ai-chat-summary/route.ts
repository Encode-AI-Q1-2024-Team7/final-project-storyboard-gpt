import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { openai } from '@/app/utils/openai';

export const runtime = 'edge';


// Route that handles a request to provide ratings for joke content
export async function POST(req: Request) {
    const { prompt } = await req.json();

    console.log('********** prompt from ai-chat-summary: ', prompt);

    // const assistantMessage = data.message.find((role: string) => role === 'assistant')?.content;

    // console.log('********** assistantMessage: ', assistantMessage);

  // Request the OpenAI API for the response based on the prompt
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    stream: false,
    
    messages: [
      {
        role: 'system',
        content: `Can you generate a single sentence summary in 15 words in plain language from this story text? Here is the story: ${JSON.stringify(prompt)}`,
      },
    ],
    max_tokens: 200,
    temperature: 0,
    top_p: 1,
    frequency_penalty: 1,
    presence_penalty: 1,
  });

  console.log('********** response from ai-chat-summary: ', response);

  if(!response) {
    return new Response(JSON.stringify("No response from AI"), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // const stream = OpenAIStream(response);

  // return new StreamingTextResponse(stream);
  return new Response(JSON.stringify(response.choices[0].message.content), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
