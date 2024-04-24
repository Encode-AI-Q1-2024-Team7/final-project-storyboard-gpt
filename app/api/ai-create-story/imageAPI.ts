'use server'
import { openai } from '@/app/utils/openai';
import { APIError } from './route';
import { writeFileSync } from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';

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

    if (!openaiDallEResponse || !openaiDallEResponse.data[0].url) {
      const response: ImageAPIResponse = {
        isError: true,
        errorMessage: APIError.Image,
      };

      return response;
    }

    // console.log('********** openaiDallEResponse: ', openaiDallEResponse);
    const imgUrl = openaiDallEResponse.data[0].url;

    const response: ImageAPIResponse = {
      isError: false,
      errorMessage: null,
      data: {
        url: imgUrl,
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

// export async function writeFile(req: NextApiRequest, res: NextApiResponse) {
//   const { path } = req.query;
//   if (!path) {
//     res.status(400).json({ status: 'no path provided' });
//   } else {
//     fetch(path as string)
//       .then((response) => response.arrayBuffer())
//       .then((buffer) => {
//         const content = Buffer.from(buffer);
//         writeFileSync(`/app/api/ai-create-story/img/2.png`, content);
//         res.status(200).json({ status: 'success'});
//       })
//       .catch((error) => {
//         console.error('Error:', error);
//         res.status(500).json({ status: 'internal server error' });
//       });
//   }
// }
