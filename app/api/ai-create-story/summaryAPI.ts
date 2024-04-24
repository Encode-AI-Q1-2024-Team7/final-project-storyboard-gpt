import { openai } from '@/app/utils/openai';
import { APIError } from './route';

interface SummaryAPIResponse {
  isError: boolean;
  errorMessage?: APIError | null;
  data?: { message: string };
}

interface SummaryAPIParams {
  content: string;
}

export async function getSummary(
  data: SummaryAPIParams
): Promise<SummaryAPIResponse> {

  try {
    // Request the OpenAI API for the response based on the prompt
    const openaiChatResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      stream: false,

      messages: [
        {
          role: 'system',
          content: `Can you generate a single sentence summary in 15 words in plain language from this sci-fi story text? Here is the story: ${JSON.stringify(
            data.content
          )}`,
        },
      ],
      max_tokens: 200,
      temperature: 0,
      top_p: 1,
      frequency_penalty: 1,
      presence_penalty: 1,
    });

    if (!openaiChatResponse) {
      const response: SummaryAPIResponse = {
        isError: true,
        errorMessage: APIError.Summary,
      };

      return response;
    }

    // console.log('********** openaiChatResponse: ', openaiChatResponse);

    const response: SummaryAPIResponse = {
      isError: false,
      errorMessage: null,
      data: {
        message: openaiChatResponse.choices[0].message.content ?? '',
      },
    };

    return response;
  } catch (error: unknown) {
    const response: SummaryAPIResponse = {
      isError: true,
      errorMessage: APIError.Summary,
    };
    console.log('********** error from ai-chat-summary: ', error);

    return response;
  }
}
