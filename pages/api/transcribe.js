import nextConnect from "next-connect";
import { Configuration, OpenAIApi } from "openai";
import { Readable } from "stream";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = nextConnect();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
  organization: "org-iAUV31QM1NGKtBQ4cpSyXQET",
});
const openai = new OpenAIApi(configuration);

function readAudioBuffer(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];

    const onData = (chunk) => {
      chunks.push(chunk);
    };

    const onEnd = () => {
      const buffer = Buffer.concat(chunks);
      resolve(buffer);
    };

    const onError = (error) => {
      reject(error);
    };

    const readable = new Readable().wrap(req);
    readable.on("data", onData);
    readable.on("end", onEnd);
    readable.on("error", onError);
  });
}

handler.post(async (req, res) => {
  req.on("error", (error) => {
    console.error("Error reading audio file:", error);
    res.status(500).json({ error: "Error reading audio file" });
  });

  try {
    const audioBuffer = await readAudioBuffer(req);
    const audioReadStream = Readable.from(audioBuffer);
    audioReadStream.path = "temp.webm";

    const response = await openai.createTranscription(
      audioReadStream,
      "whisper-1"
    );

    if (response.status !== 200) {
      res.status(response.status).json({ error: "Error transcribing audio" });
      return;
    }

    const transcription = response.data.text;

    res.status(200).json({ transcription });
  } catch (error) {
    res.status(500).json({ error: "error in handler" });
  }
});

export default handler;
