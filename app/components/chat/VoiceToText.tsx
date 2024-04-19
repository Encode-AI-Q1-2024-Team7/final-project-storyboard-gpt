import React, { useEffect, useState } from 'react';
import 'regenerator-runtime/runtime';
// import { createSpeechlySpeechRecognition } from '@speechly/speech-recognition-polyfill';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
import { Train_One } from 'next/font/google';
import MicIcon from '../icons/micIcon';

// const appId = '<INSERT_SPEECHLY_APP_ID_HERE>';
// const SpeechlySpeechRecognition = createSpeechlySpeechRecognition(appId);
// SpeechRecognition.applyPolyfill(SpeechlySpeechRecognition);

const Dictaphone = () => {
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

  const handleVoiceTranscript = () => {
    // Stop speech recognition
    SpeechRecognition.stopListening();

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
  };

  const handleUndo = () => {
    // Remove last element in array from user input
    setUserInput((prev) => {
      const copy = [...prev];
      copy.pop();
      return copy;
    });
  };

  if (!browserSupportsSpeech) {
    return <div>Your browser does not support speech recognition</div>;
  }

  return (
    <>
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

      <button
        className='btn btn-primary'
        onTouchStart={startListening}
        onMouseDown={startListening}
        onTouchEnd={handleVoiceTranscript}
        onMouseUp={handleVoiceTranscript}
      >
        Hold to talk
      </button>
      <br />
      {voiceTranscript.length > 0 ? (
        <>
          <p className='text-center text-lg text-green-700'>
            {voiceTranscript}
          </p>
        </>
      ) : userInput.length > 0 ? (
        <>
          <p className='text-center text-lg text-blue-700'>{userInput}</p>
          <button className='mx-auto btn btn-ghost w-fit' onClick={handleUndo}>
            Undo
          </button>
        </>
      ) : (
        <p className='text-center'>Press Mic and Speak</p>
      )}
    </>
  );
};
export default Dictaphone;
