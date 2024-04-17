'use client';

import { useEffect, useRef, useState } from 'react';
import ChatSettings from './components/chat/ChatSettings';
import ChatSection from './components/chat/ChatSection';
import { Finger_Paint } from 'next/font/google';

const fingerPaint = Finger_Paint({ weight: '400', subsets: ['latin'] });

export enum AIStatus {
  Idle = 'Idle',
  InProgress = 'In Progress',
}

export type AssistantMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export default function Home() {
  const [status, setStatus] = useState(AIStatus.Idle);
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [imageStatus, setImageStatus] = useState<AIStatus>(AIStatus.Idle);
  const [imageUrl, setImageUrl] = useState('');

  const lastMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const paintAPIHandler = async () => {
    // Set the status to in progress
    setImageStatus(AIStatus.InProgress);

    // Get the painting suggestion from the assistant
    const prompt = messages.find(
      (message) => message.role === 'assistant'
    )?.content;

    // If the prompt is not found, log an error and return
    if (!prompt) {
      console.error('Prompt not found');
      return;
    }

    // Call the AI image API
    const response = await fetch('/api/ai-image', {
      method: 'POST',
      body: JSON.stringify({
        prompt,
      }),
    });

    if (!response.ok) {
      console.error('API request failed');
      return;
    }

    const responseUrl = await response.json();
    setImageUrl(responseUrl.imageUrl);
    setImageStatus(AIStatus.Idle);
  };

  // const lastMessage = messages.filter((m) => m.role === 'assistant').pop();
  return (
    <main className={fingerPaint.className}>
      <header className='py-8 text-5xl font-bold text-center mb-4'>
        DaVinci GPT
      </header>
      <div className='flex min-w-lg'>
        <ChatSettings
          status={status}
          setStatus={setStatus}
          messages={messages}
          setMessages={setMessages}
          paintAPIHandler={paintAPIHandler}
          setImageUrl={setImageUrl}
        />
        <ChatSection
          messages={messages}
          status={status}
          lastMessageRef={lastMessageRef}
          imageStatus={imageStatus}
          imageUrl={imageUrl}
        />
      </div>
    </main>
  );
}
