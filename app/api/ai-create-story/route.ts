import { getImage } from './imageAPI';
import { getStory } from './storyAPI';
import { getSummary } from './summaryAPI';

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

const INVALID_MESSAGE = 'please try again';

export enum APIError {
  Story = `Sorry, Please try again.`,
  Summary = 'We ran into an issue, please try again.',
  Image = 'Could not generate image, please try again.',
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
    return Response.json({ apiResponse });
  }

  const { message: story } = storyAPIResponse.data;
  apiResponse.data.story = story; // Set the story in the API response

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
    return Response.json({ apiResponse });
  }
  const { message: summary } = summaryAPIResponse.data;
  apiResponse.data.summary = summary; // Set the summary in the API response

  // Get image from openai dall-e completions
  const imageAPIResponse = await getImage({
    content: summary,
  });
  console.log('********** imageAPIResponse: ', imageAPIResponse);

  if (imageAPIResponse.isError || !imageAPIResponse.data?.url) {
    apiResponse.isError = true;
    apiResponse.errorMessage.imageError =
      imageAPIResponse.errorMessage ?? APIError.Image;
    return Response.json({ apiResponse });
  }
  const { url: image } = imageAPIResponse.data;
  apiResponse.data.image = image; // Set the image in the API response

  return Response.json({ apiResponse });
}
