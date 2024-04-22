import { AssistantMessage } from '@/app/page';
import { openai } from '@/app/utils/openai';

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

const randomId = () => Math.random().toString(10);

// Set assistant name here if you have setup in OpenAI
const ASSISTANT_NAME = 'Storyboard1'+ randomId();

export async function POST(req: Request) {
  const data = await req.json();

  console.log('********** data: ', data);

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
      instructions:
        `You are a famous science fiction writer. You always use easy to understand and plain language to write your stories. Your works focus on the analysis of society and human nature and the exploration of the future. Now the user will ask you to generate a story. Please generate a story within 800 characters. The story should start with a title. The story must have a beginning and an end. If you don't understand the user, respond with "Please try again.".  If you are not able to generate a story, respond with "Please try again.".`,
      model: 'gpt-3.5-turbo',
    });
  }

  // Create a new thread ID if creating a new assistant
  const threadId =
    (data.threadId as string) ?? (await openai.beta.threads.create()).id;

  // Add a new message to the thread
  const message = await openai.beta.threads.messages.create(threadId, {
    role: 'user',
    content: data.message,
  });

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
    .on('messageDone', (messageDone) =>
      console.log('messageDone: ', messageDone)
    )
    ;

  const result = await run.finalRun();
  console.log('********** Assistant Run Completed **********');
  // console.log(result);

  // Get new thread messages (after our message)
  const responseMessages = (
    await openai.beta.threads.messages.list(threadId, {
      order: 'asc',
    })
  ).data;

  // console.log('responseMessages: ', responseMessages);

  const messages = responseMessages.map((message) => {
    const textContent = message.content.find(
      (content) => content.type === 'text'
    );
    return {
      id: message.id,
      role: message.role,
      content:
        textContent && 'text' in textContent ? textContent.text.value : '',
    };
  });

  console.log('************ messages: ', messages);

  return Response.json({ messages } as { messages: AssistantMessage[] });
}
