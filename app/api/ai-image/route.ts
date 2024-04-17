import { openai } from '@/app/utils/openai';

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

const ASSISTANT_NAME = 'DaVinci';

export async function POST(req: Request) {
  const data = await req.json();

  const response = await openai.images.generate({
    model: 'dall-e-3',
    n: 1,
    size: '1024x1024', // Dall-e-3 model requires 1024x1024 minimum
    prompt: data.prompt,
  });

  const imageUrl = response.data[0].url;
  console.log('********* imageUrl: ', imageUrl);

  return Response.json({ imageUrl } as { imageUrl: string });
}
