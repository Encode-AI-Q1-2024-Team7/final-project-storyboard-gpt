import React, { useEffect, useState } from 'react';
import 'regenerator-runtime/runtime';
// import { createSpeechlySpeechRecognition } from '@speechly/speech-recognition-polyfill';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
import { Train_One } from 'next/font/google';

const appId = '<INSERT_SPEECHLY_APP_ID_HERE>';
// const SpeechlySpeechRecognition = createSpeechlySpeechRecognition(appId);
// SpeechRecognition.applyPolyfill(SpeechlySpeechRecognition);

const Dictaphone = () => {
    const [voiceTranscript, setVoiceTranscript] = useState();
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
//   const [] = useState();
  const startListening = () =>
    SpeechRecognition.startListening({ continuous: true });

  useEffect(() => {
    if (listening) {
      console.log('Listening...');
    }
    console.log('transcript:');
    console.log(transcript);
  }, [listening, transcript]);

  if (!browserSupportsSpeechRecognition) {
    return <span>{`Browser doesn't support speech recognition.`}</span>;
  }

  return (
    <>
      <div className='flex flex-col'>
        <p>Microphone: {listening ? 'on' : 'off'}</p>
        <button
          onTouchStart={startListening}
          onMouseDown={startListening}
          onTouchEnd={SpeechRecognition.stopListening}
          onMouseUp={SpeechRecognition.stopListening}
        >
          Hold to talk
        </button>
        <p>{transcript}</p>
        <button onClick={resetTranscript}>Reset</button>
      </div>
      <div>
        <input
          value={voiceTranscript}
        //   onChange={() => {
        //     const text = transcript.toString();
        //     setVoiceTranscript(t)}}
        />
      </div>
    </>
  );
};
export default Dictaphone;
