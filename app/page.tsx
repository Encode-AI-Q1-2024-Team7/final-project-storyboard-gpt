'use client';
import { Key, useEffect, useRef, useState } from 'react';
import styles from './page.module.scss';
import Image from 'next/image';
import Lenis from '@studio-freight/lenis';
import { useTransform, useScroll, motion } from 'framer-motion';
import ChatSettings from './components/chat/ChatSettings';
import ChatSection from './components/chat/ChatSection';
import VoiceSection from './components/chat/VoiceSection';
import VoiceToText from './components/chat/VoiceToText';


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
        <Column id='col-1' y={y} />
        <Column id='col-2' y={y2} />
        <Column id='col-3' y={y3} />
      </div>
      <div className={styles.spacer}></div>
      <header className='py-8 text-5xl font-bold text-center'>
        ~ End of Page ~
      </header>
    </main>
  );
}

const Column = ({ id, y }: { id: string; y: any }) => {
  return (
    <motion.div className={styles.column} style={{ y }}>
      <StoryCard id={id} />
      <StoryCard id={id} />
      <StoryCard id={id} />
      <StoryCard id={id} />
    </motion.div>
  );
};

// interface StoryCardProps {
//   status: AIStatus;
//   setStatus: React.Dispatch<React.SetStateAction<AIStatus>>;
//   messages: AssistantMessage[];
//   setMessages: React.Dispatch<React.SetStateAction<AssistantMessage[]>>;
//   paintAPIHandler: () => void;
//   setImageUrl: React.Dispatch<React.SetStateAction<string>>;
// }

const StoryCard = ({ id }: { id: Key }) => {
  return (
    <div
      key={id}
      id={id.toString()}
      className='group card card-compact w-96 bg-base-100 shadow-xl'
    >
      <div className='relative'>
        <div className='invisible group-hover:visible absolute inset-x-0 top-14 z-20 opacity-100 transition ease-in-out duration-500'>
          <VoiceToText />
        </div>

        <figure className='group-hover:opacity-10 transition ease-in-out duration-500'>
          <Image
            width={400}
            height={400}
            src='/images/STORYTIME.png'
            alt='Shoes'
            style={{
              objectFit: 'contain', // cover, contain, none
            }}
            priority
          />
        </figure>
      </div>
      <div className='card-body'>
        {/* <h2 className='card-title'>Shoes!</h2> */}
        <p>TODO: This is the plachholder for Summary Text </p>
        {/* <div className='card-actions justify-end'>

        </div> */}
      </div>
    </div>
  );
};
