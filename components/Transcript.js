import React from "react";
import styles from "./Transcript.module.css";

const Transcript = ({ transcript }) => {
  return (
    <div className={styles.transcript}>
      <h2>Transcription</h2>
      <div className={styles.transcripttext}>{transcript}</div>
    </div>
  );
};

export default Transcript;
