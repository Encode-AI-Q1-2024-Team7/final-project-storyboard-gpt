'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './page.module.scss';
import Image from 'next/image';
import Lenis from '@studio-freight/lenis';
import { useTransform, useScroll, motion } from 'framer-motion';
import StoryCard from './components/ui/StoryCard';

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
  const [messages, setMessages] = useState<AssistantMessage[]>([]);

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

  return (
    <main className='min-w-[500px]'>
      <header className='relative py-8 text-5xl font-bold text-center'>
        <Image
          src='/static/android-chrome-192x192.png'
          alt='StoryTime GPT'
          width={100}
          height={100}
          className='absolute top-5 left-5 w-20 h-20  sm:visible invisible'
        />
        <h1>StoryTime GPT</h1>
        <p className='text-2xl'>Creating imaginations into adventures</p>
        <Image
          src='/static/android-chrome-192x192.png'
          alt='StoryTime GPT'
          width={100}
          height={100}
          className='absolute top-5 right-5 w-20 h-20 sm:visible invisible'
        />
      </header>
      {/* <div className={styles.spacer}></div> */}
      <div ref={gallery} className={styles.gallery}>
        <Column id='col1' y={y} />
        <Column id='col2' y={y2} />
        <Column id='col3' y={y3} />
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
      {Array.from({ length: 4 }, (_, i) => (
        <StoryCard key={`${id}-${i + 1}`} id={`${id}-${i + 1}`} />
      ))}
    </motion.div>
  );
};
