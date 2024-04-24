import { openai } from '@/app/utils/openai';
import { APIError } from './route';

interface ImageAPIResponse {
  isError: boolean;
  errorMessage?: APIError | null;
  data?: { url: string };
}

interface ImageAPIParams {
  content: string;
}

export async function getImage(
  data: ImageAPIParams
): Promise<ImageAPIResponse> {
  try {
    const openaiDallEResponse = await openai.images.generate({
      model: 'dall-e-2',
      n: 1,
      size: '512x512', // Dall-e-3 model requires 1024x1024 minimum
      prompt: data.content,
    });

    if (!openaiDallEResponse) {
      const response: ImageAPIResponse = {
        isError: true,
        errorMessage: APIError.Image,
      };

      return response;
    }

    // console.log('********** openaiDallEResponse: ', openaiDallEResponse);

    const response: ImageAPIResponse = {
      isError: false,
      errorMessage: null,
      data: {
        url: openaiDallEResponse.data[0].url ?? '',
      },
    };

    return response;
  } catch (error: unknown) {
    const response: ImageAPIResponse = {
      isError: true,
      errorMessage: APIError.Image,
    };
    console.error('Error in getImage: ', error);

    return response;
  }
}
