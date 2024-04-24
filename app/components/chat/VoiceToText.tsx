import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'react-aria-components';
import 'regenerator-runtime/runtime';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
import MicIcon from '../icons/micIcon';
import { APIResponse } from '@/app/api/ai-create-story/route';
import { CardData, Loading } from '../ui/StoryCard';
import { clear } from 'console';

interface VoiceToTextProps {
  setCardData: (data: CardData) => void;
  setCardError: (error: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: Loading) => void;
}

export const VoiceToText = ({
  setCardData,
  setCardError,
  isLoading,
  setIsLoading,
}: VoiceToTextProps) => {
  const [browserSupportsSpeech, setBrowserSupportsSpeech] =
    useState<boolean>(true);
  const [userInput, setUserInput] = useState<string[]>([]);
  const [voiceTranscript, setVoiceTranscript] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const startListening = () =>
    SpeechRecognition.startListening({ continuous: true });

  // UseEffect added to prevent hydration errors
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      setBrowserSupportsSpeech(false);
    }
    if (browserSupportsSpeechRecognition) {
      setVoiceTranscript(transcript);
      setIsListening(listening);
    }
  }, [browserSupportsSpeechRecognition, listening, transcript]);

  const handleVoiceTranscript = (action?: string) => {
    if (action === 'end') {
      // Stop speech recognition
      SpeechRecognition.stopListening();

      console.log('********** transcript: ', transcript);

      // Update user input state is there is a new voice transcript
      setUserInput((prev) => {
        if (voiceTranscript.length <= 0) {
          return prev;
        }
        // A period and space added at end of new voice transcript
        return [...prev, voiceTranscript.concat('. ')];
      });
      setTimeout(() => {
        resetTranscript();
      }, 250); // Added delay to ensure transcript from speech recognition is reset, increase time as needed
    }
    resetTranscript();
    startListening();
  };

  const handleUndo = () => {
    // Remove last element in array from user input
    setUserInput((prev) => {
      const copy = [...prev];

      copy.pop();
      return copy;
    });
  };
  const handleReset = () => {
    // Remove all elements in array from user input
    setUserInput([]);
  };

  async function handleStoryAPI() {
    // Start AI request
    setIsLoading({ state: true, value: 10 });

    const formData = new FormData();
    formData.append('message', userInput.join(' '));

    // Simulate progress
    setIsLoading({ state: true, value: 30 });

    // Call the AI API
    const response = await fetch('/api/ai-create-story', {
      method: 'POST',
      body: JSON.stringify({ message: formData.get('message') }),
    });

    setIsLoading({ state: true, value: 90 });

    if (!response.ok) {
      console.error('API request failed');
      setIsLoading({ state: false, value: 0 });
      setCardError('Please try again');
      return;
    }

    // Get the response from the API
    const res = (await response.json()) as { apiResponse: APIResponse };
    const { isError, errorMessage, data } = res.apiResponse;

    // Set the card data or error
    if (isError) {
      // Get the last error key and value
      let lastErrorValue = '';
      Object.entries(errorMessage).forEach(([_, value]) => {
        if (value !== '') {
          lastErrorValue = value;
        }
      });
      setCardError(lastErrorValue);
    } else {
      setCardData(data);
    }

    // End loading
    setIsLoading({ state: false, value: 0 });
  }

  if (!browserSupportsSpeech) {
    return <div>Your browser does not support speech recognition</div>;
  }

  return (
    <div className='mx-auto'>
      <div className='flex flex-col'>
        <div className='flex justify-center'>
          {isListening ? (
            <>
              <MicIcon />
              <span>Listening...</span>
            </>
          ) : (
            <>
              <span>Microphone:&nbsp;</span>
              <span>Off</span>
            </>
          )}
        </div>
        <Button
          id='btn-speech'
          className='mt-1 btn btn-primary w-fit mx-auto'
          onPressStart={() => handleVoiceTranscript('start')}
          // onTouchStart={() => handleVoiceTranscript('start')}
          // onMouseDown={() => handleVoiceTranscript('start')}
          onPressEnd={() => handleVoiceTranscript('end')}
          // onTouchEnd={() => handleVoiceTranscript('end')}
          // onMouseUp={() => handleVoiceTranscript('end')}
          isDisabled={isLoading}
        >
          Hold to talk
        </Button>
        <br />
        {userInput.length > 0 ? (
          <div className='flex flex-col justify-between'>
            <div className='flex bottom-0'>
              <Button
                id='btn-api'
                className='mx-auto btn btn-ghost w-fit'
                onPress={handleStoryAPI}
                isDisabled={isLoading}
              >
                Create A Story
              </Button>
              <Button
                id='btn-undo'
                className='mx-auto btn btn-ghost w-fit'
                onPress={handleUndo}
                isDisabled={isLoading}
              >
                Undo
              </Button>
              <Button
                id='btn-reset'
                className='mx-auto btn btn-ghost w-fit'
                onPress={handleReset}
                isDisabled={isLoading}
              >
                Reset
              </Button>
            </div>
          </div>
        ) : null}
        <br />
        {voiceTranscript.length > 0 && isListening ? (
          <>
            <p className='text-center text-lg text-green-700'>
              {voiceTranscript}
            </p>
          </>
        ) : userInput.length > 0 ? (
          <p className='text-center text-lg text-blue-700'>{userInput}</p>
        ) : (
          <p className='text-center'>Press Mic and Speak</p>
        )}
      </div>
    </div>
  );
};
export default VoiceToText;
