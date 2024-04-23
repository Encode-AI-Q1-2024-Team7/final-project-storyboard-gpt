'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './page.module.scss';
import Image from 'next/image';
import Lenis from '@studio-freight/lenis';
import { useTransform, useScroll, motion } from 'framer-motion';
import ChatSettings from './components/chat/ChatSettings';
import ChatSection from './components/chat/ChatSection';
import VoiceSection from './components/chat/VoiceSection';

const images = ['STORYTIME.jpg'];

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
  const gallery = useRef(null);
  const [dimension, setDimension] = useState({ width: 0, height: 0 });
  const [status, setStatus] = useState(AIStatus.Idle);
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [imageStatus, setImageStatus] = useState<AIStatus>(AIStatus.Idle);
  const [imageUrl, setImageUrl] = useState('');

  const { scrollYProgress } = useScroll({
    target: gallery,
    offset: ['start end', 'end start'],
  });
  const { height } = dimension;
  const y = useTransform(scrollYProgress, [0, 1], [0, height * 6.0]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, height * 1.0]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, height * 7.0]);
  // const y4 = useTransform(scrollYProgress, [0, 1], [0, height * 3])

  useEffect(() => {
    const lenis = new Lenis();

    const raf = (time: any) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    const resize = () => {
      setDimension({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', resize);
    requestAnimationFrame(raf);
    resize();

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

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

  const lastMessage = messages.filter((m) => m.role === 'assistant').pop();

  return (
    <main className='min-w-[500px]'>
      <header className='py-8 text-5xl font-bold text-center'>
        StoryTime GPT
      </header>
      {/* <div className={styles.spacer}></div> */}
      <div ref={gallery} className={styles.gallery}>
        {/* <Column images={[images[0], images[1], images[2], images[3]]} y={y} /> */}
        <Column
          images={[
            <StoryCard
              key={1}
              status={status}
              setStatus={setStatus}
              messages={messages}
              setMessages={setMessages}
              paintAPIHandler={paintAPIHandler}
              setImageUrl={setImageUrl}
            />,
            <StoryCard
              key={2}
              status={status}
              setStatus={setStatus}
              messages={messages}
              setMessages={setMessages}
              paintAPIHandler={paintAPIHandler}
              setImageUrl={setImageUrl}
            />,
            <StoryCard
              key={3}
              status={status}
              setStatus={setStatus}
              messages={messages}
              setMessages={setMessages}
              paintAPIHandler={paintAPIHandler}
              setImageUrl={setImageUrl}
            />,
            <StoryCard
              key={4}
              status={status}
              setStatus={setStatus}
              messages={messages}
              setMessages={setMessages}
              paintAPIHandler={paintAPIHandler}
              setImageUrl={setImageUrl}
            />,
          ]}
          y={y}
        />
        <Column
          images={[
            <StoryCard
              key={1}
              status={status}
              setStatus={setStatus}
              messages={messages}
              setMessages={setMessages}
              paintAPIHandler={paintAPIHandler}
              setImageUrl={setImageUrl}
            />,
            <StoryCard
              key={2}
              status={status}
              setStatus={setStatus}
              messages={messages}
              setMessages={setMessages}
              paintAPIHandler={paintAPIHandler}
              setImageUrl={setImageUrl}
            />,
            <StoryCard
              key={3}
              status={status}
              setStatus={setStatus}
              messages={messages}
              setMessages={setMessages}
              paintAPIHandler={paintAPIHandler}
              setImageUrl={setImageUrl}
            />,
            <StoryCard
              key={4}
              status={status}
              setStatus={setStatus}
              messages={messages}
              setMessages={setMessages}
              paintAPIHandler={paintAPIHandler}
              setImageUrl={setImageUrl}
            />,
          ]}
          y={y2}
        />
        <Column
          images={[
            <StoryCard
              key={1}
              status={status}
              setStatus={setStatus}
              messages={messages}
              setMessages={setMessages}
              paintAPIHandler={paintAPIHandler}
              setImageUrl={setImageUrl}
            />,
            <StoryCard
              key={2}
              status={status}
              setStatus={setStatus}
              messages={messages}
              setMessages={setMessages}
              paintAPIHandler={paintAPIHandler}
              setImageUrl={setImageUrl}
            />,
            <StoryCard
              key={3}
              status={status}
              setStatus={setStatus}
              messages={messages}
              setMessages={setMessages}
              paintAPIHandler={paintAPIHandler}
              setImageUrl={setImageUrl}
            />,
            <StoryCard
              key={4}
              status={status}
              setStatus={setStatus}
              messages={messages}
              setMessages={setMessages}
              paintAPIHandler={paintAPIHandler}
              setImageUrl={setImageUrl}
            />,
          ]}
          y={y3}
        />
      </div>
      <div className={styles.spacer}></div>
    </main>
  );
}

const Column = ({ images, y }: { images: any; y: any }) => {
  return (
    <motion.div className={styles.column} style={{ y }}>
      {images.map((src: any, i: any) => {
        return (
          <div key={i} className='flex flex-col'>
            {src}
          </div>
        );
      })}
    </motion.div>
  );
};

interface StoryCardProps {
  status: AIStatus;
  setStatus: React.Dispatch<React.SetStateAction<AIStatus>>;
  messages: AssistantMessage[];
  setMessages: React.Dispatch<React.SetStateAction<AssistantMessage[]>>;
  paintAPIHandler: () => void;
  setImageUrl: React.Dispatch<React.SetStateAction<string>>;
}

const StoryCard = ({
  status,
  setStatus,
  messages,
  setMessages,
  paintAPIHandler,
  setImageUrl,
}: StoryCardProps) => {
  return (
    <div className='card card-compact w-96 bg-base-100 shadow-xl'>
      <figure>
        <Image
          width={400}
          height={400}
          src='/images/STORYTIME.png'
          alt='Shoes'
          style={{
            objectFit: 'contain', // cover, contain, none
          }}
        />
      </figure>
      <div className='card-body'>
        <h2 className='card-title'>Shoes!</h2>
        <p>If a dog chews shoes whose shoes does he choose?</p>
        <div className='card-actions justify-end'>
          <button className='btn btn-primary'>Buy Now</button>
        </div>
      </div>
    </div>
  );
};


//   return (
//     <main className={fingerPaint.className}>
//       <header className='py-8 text-5xl font-bold text-center mb-4'>
//         StoryTime GPT
//       </header>
//       <div className='flex min-w-lg flex-wrap'>
//         <div className='flex flex-col'>
//           <VoiceSection
//             status={status}
//             setStatus={setStatus}
//             messages={messages}
//             setMessages={setMessages}
//             paintAPIHandler={paintAPIHandler}
//             setImageUrl={setImageUrl}
//           />
//           {/* <ChatSettings
//             status={status}
//             setStatus={setStatus}
//             messages={messages}
//             setMessages={setMessages}
//             paintAPIHandler={paintAPIHandler}
//             setImageUrl={setImageUrl}
//           /> */}
//         </div>

//         {/* <ChatSection
//           messages={messages}
//           status={status}
//           lastMessageRef={lastMessageRef}
//           imageStatus={imageStatus}
//           imageUrl={imageUrl}
//         /> */}
//       </div>
//     </main>
//   );
// }