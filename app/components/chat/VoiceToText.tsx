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
  const [voiceTranscript, setVoiceTranscript] = useState<string[]>([]);
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  //   const [] = useState();
  const startListening = () =>
    SpeechRecognition.startListening({ continuous: true });

  // useEffect(() => {
  //   if (listening) {
  //     console.log('Listening...');
  //   }
  //   console.log('transcript:');
  //   console.log(transcript);
  // }, [listening, transcript]);

  if (!browserSupportsSpeechRecognition) {
    return <span>{`Browser doesn't support speech recognition.`}</span>;
  }

  const handleVoiceTranscript = () => {
    setVoiceTranscript((prev) => {
      console.log('prev: ', prev);
      const arrayToString = prev.join(' ');
      const diff = getStringDifference(arrayToString, transcript);

      console.log('diff: ', diff);

      return diff.length > 0 ? [...prev, diff] : prev;
    });
    SpeechRecognition.stopListening();
    resetTranscript();
  };

  const handleUndo = () => {
    setVoiceTranscript((prev) => {
      const copy = [...prev];
      copy.pop();
      return copy;
    });
  }

  return (
    <>
      <div className='flex flex-col'>
        <p>Microphone: {listening ? 'on' : 'off'}</p>
        <button
          onTouchStart={startListening}
          onMouseDown={startListening}
          onTouchEnd={handleVoiceTranscript}
          onMouseUp={handleVoiceTranscript}
        >
          Hold to talk
        </button>
        <p>{'transcript: '}</p>
        <p>{transcript}</p>
        <p>{'voiceTranscript: '}</p>
        <p>{voiceTranscript}</p>
        <button onClick={handleUndo}>Undo</button>
        <button onClick={resetTranscript}>Reset</button>
      </div>
      {/* <div>
        <input
          value={voiceTranscript}
          // onChange={() => {
          //   const text = transcript.toString();
          //   setVoiceTranscript(t)}}
        />
      </div> */}
    </>
  );
};
export default Dictaphone;

function getStringDifference(prevStr: string, fullTranscript: string) {
  if (fullTranscript.length <= 0) {
    return '';
  }

  let difference = '';
  difference = fullTranscript.slice(prevStr.length, fullTranscript.length);
  console.log('difference: ', difference);

  return difference;
}
