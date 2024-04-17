import { FormEvent, useState } from 'react';
import DropDownBox, { Option } from '../ui/dropdown';
import { AIStatus, AssistantMessage } from '@/app/page';
import Dictaphone from './VoiceToText';

const Themes: Option[] = [
  { id: 1, name: 'Landscape' },
  { id: 2, name: 'Animal' },
  { id: 3, name: 'Abstract' },
  { id: 4, name: 'Nature' },
  { id: 5, name: 'Modern' },
  // More themes...
];

interface VoiceSectionProps {
  status: AIStatus;
  setStatus: (status: AIStatus) => void;
  messages: AssistantMessage[];
  setMessages: (messages: AssistantMessage[]) => void;
  paintAPIHandler: () => void;
  setImageUrl: (url: string) => void;
}

export default function VoiceSection({
  status,
  setStatus,
  messages,
  setMessages,
  paintAPIHandler,
  setImageUrl,
}: VoiceSectionProps) {
  const [selectedTheme, setSelectedTheme] = useState(Themes[0]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessages([]); // Clear messages
    setImageUrl('');
    setStatus(AIStatus.InProgress);

    const formData = new FormData();
    formData.append(
      'message',
      `Can you suggest a ${selectedTheme.name} themed painting?`
    );
    
    const response = await fetch('/api/ai-assistant', {
      method: 'POST',
      body: JSON.stringify({ message: formData.get('message') }),
    });
    
    if (!response.ok) {
      console.error('API request failed');
      return;
    }
    
    const data: { messages: AssistantMessage[] } = await response.json();
    setMessages(data.messages);
    setStatus(AIStatus.Idle);
  }

  return (
    <div className='flex flex-col'>
      <div className='relative min-w-[500px] ml-6 w-96 mockup-window border bg-base-300 h-fit overflow-visible z-10 mb-6'>
        <div className='card-body'>
          <h2 className='text-2xl font-bold text-center mb-4'>Voice Section!</h2>
          <Dictaphone />
          
        </div>
      </div>
      {messages.length > 0 ? (
        <div className='relative min-w-[500px] ml-6 w-96 mockup-window border bg-primary h-fit animate-fade'>
          <div className='card-body'>
            <h2 className='text-2xl font-bold text-center mb-4'>
              Ask DaVinci to Paint!
            </h2>
            <div className='sticky top-36 rounded-md mx-3 py-4'>
              <div className='flex flex-col items-center p-4'>
                <button
                  className='btn btn-accent'
                  disabled={status !== AIStatus.Idle}
                  onClick={paintAPIHandler}
                >
                  {status === AIStatus.InProgress && (
                    <div className='loading loading-dots loading-md' />
                  )}
                  {status === AIStatus.Idle
                    ? `Show me a painting of that ${selectedTheme.name} theme!`
                    : 'Loading'}
                  {status === AIStatus.InProgress && (
                    <div className='loading loading-dots loading-md' />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
