import Head from "next/head";
import { useState, useRef, useEffect } from "react";
import styles from "./index.module.css";
import Transcript from "../components/Transcript";
import VoiceRecorder from "../components/VoiceRecorder";

export default function Home() {
  const bottomRef = useRef(null);
  const [transcript, setTranscript] = useState("transcription will go here");

  return (
    <div>
      <style global jsx>{`
        html,
        body,
        body > div:first-child,
        div#__next,
        div#__next > div {
          height: 100%;
          min-height: 100%;
          margin: 0px;
        }
      `}</style>
      <Head>
        <title>
          Voice to Text Transcription with OpenAI Whisper and Nextjs
        </title>
      </Head>

      <main className={styles.main}>
        <h1>
          Voice to Text Transcription <br /> with OpenAI Whisper and Nextjs
        </h1>
        <div className={styles.chat}>
          <VoiceRecorder
            onTranscription={(transcription) => {
              console.log(transcription);
              setTranscript(transcription);
            }}
          />
          <Transcript transcript={transcript} />
        </div>
        <div className={styles.footer}>
          made by <a href="http://whichlight.com">whichlight</a>
        </div>
      </main>
    </div>
  );
}
