import React, { useEffect, useState } from 'react';
import { Button } from 'react-aria-components';
import 'regenerator-runtime/runtime';
// import { createSpeechlySpeechRecognition } from '@speechly/speech-recognition-polyfill';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
import { Train_One } from 'next/font/google';
import MicIcon from '../icons/micIcon';
import { AssistantMessage } from 'ai';
import { useChat } from 'ai/react';

// const appId = '<INSERT_SPEECHLY_APP_ID_HERE>';
// const SpeechlySpeechRecognition = createSpeechlySpeechRecognition(appId);
// SpeechRecognition.applyPolyfill(SpeechlySpeechRecognition);

const VoiceToText = () => {
  const [browserSupportsSpeech, setBrowserSupportsSpeech] =
    useState<boolean>(true);
  const [userInput, setUserInput] = useState<string[]>([]);
  const [voiceTranscript, setVoiceTranscript] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [voiceAPIResponse, setVoiceAPIResponse] = useState<AssistantMessage[]>(
    []
  );
  const [summaryText, setSummaryText] = useState<string>('');
  const [error, setError] = useState<string>('');

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  // //   const [] = useState();
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
    // event.preventDefault();
    // setMessages([]); // Clear messages
    // setImageUrl('');
    // setStatus(AIStatus.InProgress);

    const formData = new FormData();

    formData.append('message', userInput.join(' '));

    // const response = await fetch('/api/ai-assistant-voice', {
    const response = await fetch('/api/ai-create-story', {
      method: 'POST',
      body: JSON.stringify({ message: formData.get('message') }),
    });

    if (!response.ok) {
      console.error('API request failed');
      return;
    }

    const data = await response.json();
    console.log('********** data from API: ', data);
    // setVoiceAPIResponse(data.messages);
    // setStatus(AIStatus.Idle);
  }

  const handleSummaryAPI = async () => {
    // Get the story suggestion from the assistant
    const prompt = voiceAPIResponse.find(
      (message) => message.role === 'assistant'
    )?.content;

    // If the prompt is not found, log an error and return
    if (!prompt) {
      console.error('Voice Response not found');
      return;
    }

    // Call the AI Summary API
    const response = await fetch('/api/ai-chat-summary', {
      method: 'POST',
      body: JSON.stringify({
        prompt,
      }),
    });

    if (!response.ok) {
      console.error('API request failed');
      return;
    }

    const responseSummaryText = await response.json();
    console.log('********** responseSummaryText: ', responseSummaryText);
    setSummaryText(responseSummaryText);
  };

  const handleImageAPI = async () => {
    // // Set the status to in progress
    // setImageStatus(AIStatus.InProgress);

    //const prompt = summaryText;

    const prompt =
      'Give me an animated picture to represent this: ' +
      summaryText +
      ', and please highlight the sci-fi part.';

    // If the prompt is not found, log an error and return
    if (!prompt) {
      console.error('Prompt not found');
      return;
    }

    // Call the AI image API
    const response = await fetch('/api/ai-image-voice', {
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
    console.log('********** responseUrl: ', responseUrl);
    // setImageUrl(responseUrl.imageUrl);
    // setImageStatus(AIStatus.Idle);
  };

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
        >
          Hold to talk
        </Button>
        <br />
        {voiceTranscript.length > 0 && isListening ? (
          <>
            <p className='text-center text-lg text-green-700'>
              {voiceTranscript}
            </p>
          </>
        ) : userInput.length > 0 ? (
          <div className='flex flex-col justify-between'>
            <p className='text-center text-lg text-blue-700'>{userInput}</p>
            <div className='flex'>
              {/* <Button
                id='btn-api'
                className='mx-auto btn btn-secondary w-fit'
                onPress={handleSummaryAPI}
              >
                Summary
              </Button>
              <Button
                id='btn-api'
                className='mx-auto btn btn-secondary w-fit'
                onPress={handleImageAPI}
              >
                IMAGE
              </Button> */}
              <Button
                id='btn-api'
                className='mx-auto btn btn-secondary w-fit'
                onPress={handleStoryAPI}
              >
                Create A Story
              </Button>
              <Button
                id='btn-reset'
                className='mx-auto btn btn-secondary w-fit'
                onPress={handleReset}
              >
                Reset
              </Button>
              <Button
                id='btn-undo'
                className='mx-auto btn btn-ghost w-fit'
                onPress={handleUndo}
              >
                Undo
              </Button>
            </div>
          </div>
        ) : (
          <p className='text-center'>Press Mic and Speak</p>
        )}
      </div>
    </div>
  );
};
export default VoiceToText;
