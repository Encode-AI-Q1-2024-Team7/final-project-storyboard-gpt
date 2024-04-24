import { Key, use, useEffect, useState } from 'react';
import VoiceToText from '../chat/VoiceToText';
import { Button } from 'react-aria-components';
import Image from 'next/image';
import StoryModal from './StoryModal';
import demo from '@/app/api/ai-create-story/data/data.json';

const CARD_LOOKUP: { [key: string]: number } = {
  'col1-1': 1,
  'col1-2': 2,
  'col1-3': 3,
  'col1-4': 4,
  'col2-1': 5,
  'col2-2': 6,
  'col2-3': 7,
  'col2-4': 8,
  'col3-1': 9,
  'col3-2': 10,
  'col3-3': 11,
  'col3-4': 12,
};

export type CardData = {
  story: string;
  summary: string;
  image: string;
};

export type Loading = {
  state: boolean;
  value: number;
};

export type Demo = {
  id: number;
  content: string;
  summary: string;
  image: string;
};

const DefaultSummary = 'StoryTime';
const DefaultCardImage = '/static/storytime_logo.png';
const DefaultCardData: CardData = {
  story: '',
  summary: DefaultSummary,
  image: DefaultCardImage,
};

export const StoryCard = ({ id }: { id: Key }) => {
  const [cardData, setCardData] = useState<CardData>(DefaultCardData);
  const [cardError, setCardError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<Loading>({
    state: false,
    value: 0,
  });
  const [open, setOpen] = useState(false);

  const cardStyle = isLoading.state
    ? 'opacity-10 transition ease-in-out duration-500'
    : 'group-hover:opacity-10 transition ease-in-out duration-500';

  // Setting up a few cards for pre-rendering for sample demo
  useEffect(() => {
    const cardId = id.toString();
    if (CARD_LOOKUP[cardId] === 1 || CARD_LOOKUP[cardId] === 3 || CARD_LOOKUP[cardId] === 7 || CARD_LOOKUP[cardId] === 9 || CARD_LOOKUP[cardId] === 11) {
      const demoData = demo.data.find((data: Demo) => CARD_LOOKUP[cardId] === data.id);
      setCardData({
        story: demoData?.content!,
        summary: demoData?.summary!,
        image: demoData?.image!,
      });
    }
  }, [id]);

  return (
    <>
      <StoryModal
        summary={cardData.summary}
        storyText={cardData.story}
        open={open}
        setOpen={setOpen}
      />
      <div
        key={id}
        id={id.toString()}
        className='group card card-compact w-96 bg-base-100 shadow-xl'
      >
        <div className='relative flex justify-center items-center'>
          {isLoading.state ? (
            <div className={'absolute flex flex-col z-20'}>
              <p className='text-center text-2xl'>Loading...</p>
              <progress
                className='progress w-56 my-2'
                value={isLoading.value}
                max={100}
              ></progress>
              <div className='mx-auto'>
                <span className='loading loading-ball loading-lg'></span>
                <span className='loading loading-ball loading-md'></span>
                <span className='loading loading-ball loading-xs'></span>
                <span className='loading loading-ball loading-lg'></span>
                <span className='loading loading-ball loading-sm'></span>
                <span className='loading loading-ball loading-md'></span>
                <span className='loading loading-ball loading-xs'></span>
                <span className='loading loading-ball loading-lg'></span>
              </div>
            </div>
          ) : cardData.story === '' ? (
            <div className='invisible group-hover:visible absolute inset-x-0 top-10 z-20 opacity-100 transition ease-in-out duration-500'>
              <VoiceToText
                setCardData={setCardData}
                setCardError={setCardError}
                isLoading={isLoading.state}
                setIsLoading={setIsLoading}
              />
            </div>
          ) : (
            <div
              className={
                'invisible group-hover:visible absolute flex flex-col z-20'
              }
            >
              <Button id={`view-story-${id}`} onPress={() => setOpen(true)}>
                <h2 className='text-2xl'>Click to View Story</h2>
              </Button>
            </div>
          )}

          <figure className={cardStyle}>
            <Image
              width={400}
              height={400}
              src={cardData.image ?? DefaultCardImage}
              alt={cardData.summary ?? DefaultSummary}
              style={{
                objectFit: 'contain', // cover, contain, none
              }}
              priority
            />
          </figure>
        </div>
        <div className='card-body'>
          {cardError ? (
            <p className='text-red-500 text-center'>{cardError}</p>
          ) : (
            <p className='text-center'>{cardData.summary}</p>
          )}
        </div>
      </div>
    </>
  );
};

export default StoryCard;
