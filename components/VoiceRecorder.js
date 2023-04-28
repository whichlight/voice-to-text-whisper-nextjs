import React, { useState } from "react";

const VoiceRecorder = ({ onTranscription }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  let audioChunks = [];

  const handleRecord = () => {
    if (isRecording) {
      // Stop recording and get the transcript
      mediaRecorder.stop();
    } else {
      // Start recording
      setIsRecording(true);

      // Set up Web Audio API and record audio
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();

        // Attach event listeners
        mediaRecorder.addEventListener("dataavailable", (event) => {
          audioChunks.push(event.data);
          console.log("recording", event.data);
        });

        mediaRecorder.addEventListener("stop", async () => {
          const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
          const audioURL = URL.createObjectURL(audioBlob);
          setIsRecording(false);
          setAudioURL(audioURL);
          audioChunks = [];

          // Get transcription
          getTranscription(audioBlob);
        });

        setMediaRecorder(mediaRecorder);
      });
    }
  };

  const getTranscription = async (audioBlob) => {
    // Convert the audioBlob to the desired format (FLAC or WAV)
    // ...
    console.log("before transcription blob", audioBlob);

    // Send the audio file to your server for transcription
    try {
      const response = await fetch("/api/transcribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/octet-stream",
        },
        body: audioBlob,
      });

      const data = await response.json();
      onTranscription(data.transcription);
    } catch (error) {
      console.error("Error fetching transcription:", error);
      alert("Error transcribing audio");
    }
  };

  return (
    <div className="recorder">
      <h2>Voice Recorder</h2>
      <button onClick={handleRecord}>
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
      <p>status: {isRecording ? "Recording" : "Not recording"}</p>
      {audioURL && (
        <>
          <h2>Audio Playback:</h2>
          <audio src={audioURL} controls />
        </>
      )}
    </div>
  );
};

export default VoiceRecorder;
