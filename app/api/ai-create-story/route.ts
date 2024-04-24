import { getImage } from './imageAPI';
import { getStory } from './storyAPI';
import { getSummary } from './summaryAPI';

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

const INVALID_MESSAGE = 'please try again';

export enum APIError {
  Story = 'Story API Error',
  Summary = 'Summary API Error',
  Image = 'Image API Error',
}

export type ErrorMessage = {
  storyError: string;
  summaryError: string;
  imageError: string;
};

export type APIResponse = {
  isError: boolean;
  errorMessage: ErrorMessage;
  data: {
    story: string;
    summary: string;
    image: string;
  };
};

export async function POST(req: Request): Promise<Response> {
  // Initialize the API response
  let apiResponse: APIResponse = {
    isError: false,
    errorMessage: {
      storyError: '',
      summaryError: '',
      imageError: '',
    },
    data: {
      story: '',
      summary: '',
      image: '',
    },
  };

  // Parse the request body
  const { message } = (await req.json()) as { message: string };

  console.log('********** message from api/ai-create-story: ', message);

  // Get story from chat assistant
  const storyAPIResponse = await getStory({ message });
  console.log('********** storyAPIResponse: ', storyAPIResponse);

  if (
    storyAPIResponse.isError ||
    storyAPIResponse.data?.message
      .toLocaleLowerCase()
      .includes(INVALID_MESSAGE) ||
    !storyAPIResponse.data?.message
  ) {
    apiResponse.isError = true;
    apiResponse.errorMessage.storyError =
      storyAPIResponse.errorMessage ?? APIError.Story;
    return Response.json({ apiResponse } as { apiResponse: APIResponse });
  }

  const { message: story } = storyAPIResponse.data;

  // Get summary of the story from openai chat completions
  const summaryAPIResponse = await getSummary({ content: story });
  console.log('********** summaryAPIResponse: ', summaryAPIResponse);

  if (
    summaryAPIResponse.isError ||
    summaryAPIResponse.data?.message
      .toLocaleLowerCase()
      .includes(INVALID_MESSAGE) ||
    !summaryAPIResponse.data?.message
  ) {
    apiResponse.isError = true;
    apiResponse.errorMessage.summaryError =
      summaryAPIResponse.errorMessage ?? APIError.Summary;
    return Response.json({ apiResponse } as { apiResponse: APIResponse });
  }

  // Get image from openai dall-e completions
  const imageAPIResponse = await getImage({
    content: summaryAPIResponse.data.message,
  });
  console.log('********** imageAPIResponse: ', imageAPIResponse);

  if (imageAPIResponse.isError || imageAPIResponse.data?.url) {
    apiResponse.isError = true;
    apiResponse.errorMessage.imageError =
      imageAPIResponse.errorMessage ?? APIError.Image;
    return Response.json({ apiResponse } as { apiResponse: APIResponse });
  }

  return Response.json({ apiResponse } as { apiResponse: APIResponse });
}
