import { AssistantMessage } from '@/app/page';
import { openai } from '@/app/utils/openai';
import { APIError } from './route';

interface StoryAPIResponse {
  isError: boolean;
  errorMessage?: APIError | null;
  data?: { message: string };
}

interface StoryAPIParams {
  threadId?: string;
  message: string;
}

const randomId = () => Math.random().toString(10);

// Set assistant name here if you have setup in OpenAI
const ASSISTANT_NAME = 'Storyboard1' + randomId();

export async function getStory(
  data: StoryAPIParams
): Promise<StoryAPIResponse> {
  // Setup the assistant
  let assistant = null;

  // Retrieve an assistant from OpenAI, if available
  //  - Set env file with ASSISTANT_ID if you want to use a specific assistant
  const assistants = await openai.beta.assistants.list();
  assistant = assistants.data.find((assistant) => {
    if (process.env.ASSISTANT_ID) {
      return assistant.id === process.env.ASSISTANT_ID;
    } else {
      return assistant.name === ASSISTANT_NAME;
    }
  });

  // Create a new assistant if one does not exist
  if (!assistant) {
    assistant = await openai.beta.assistants.create({
      name: ASSISTANT_NAME,
      instructions: `You are a famous sci-fi writer. You always use easy to understand and plain language to write your stories. Your works focus on the analysis of society and human nature and the exploration of the future. You can always add sci-fi element to a story. The story must have a beginning and an end. If you can not generate story based on user input, reply "Please try again".`,
      model: 'gpt-3.5-turbo',
    });
  }

  // Create a new thread ID if creating a new assistant
  const threadId = data.threadId ?? (await openai.beta.threads.create()).id;

  // Add a new message to the thread
  const openaiThreadResponse = await openai.beta.threads.messages.create(
    threadId,
    {
      role: 'user',
      content: data.message,
    }
  );

  console.log('********** openaiThreadResponse: ', openaiThreadResponse);

  // Initialize Stroy API response
  let storyAPIResponse: StoryAPIResponse = {
    isError: false,
    errorMessage: null,
  };

  // run the thread using the assistant
  // - Uncomment the event listeners to see the different events
  const run = openai.beta.threads.runs
    .stream(threadId, {
      assistant_id: assistant.id,
      temperature: 1,
    })
    // .on('textCreated', (text) => console.log('textCreated: ', text))
    // .on('textDelta', (textDelta) =>
    //   console.log('textDelta: ', textDelta.value)
    // )
    // .on('textDone', (textDone) => console.log('textDone: ', textDone))
    // // .on('messageCreated', (message) => {
    // //   console.log('messageCreated: ', message);
    // //   sendMessage({
    // //     id: message.id,
    // //     role: 'assistant',
    // //     content: message.content.filter(
    // //       (content) => content.type === 'text'
    // //     ),
    // //   } as AssistantMessage);
    // // })
    // .on('messageDelta', (messageDelta) =>
    //   console.log('messageDelta: ', messageDelta)
    // )
    .on('messageDone', (messageDone) => {
      const textContent = messageDone.content.find(
        (content) => content.type === 'text'
      );

      storyAPIResponse = {
        isError: false,
        errorMessage: null,
        data: {
          message:
            textContent && 'text' in textContent ? textContent.text.value : '',
        },
      };
    })
    .on('error', (error) => {
      storyAPIResponse = {
        isError: true,
        errorMessage: APIError.Story,
      };
      console.log('********** error: ', error.message);
    });
    
    await run.finalRun();
    console.log('********** Assistant Run Completed **********');

    return storyAPIResponse;
}
