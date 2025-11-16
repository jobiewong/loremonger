// import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
// import {
//   type BodySpeechToTextV1SpeechToTextPost,
//   type SpeechToTextChunkResponseModel,
// } from "@elevenlabs/elevenlabs-js/api";
// import "dotenv/config";
// import fs from "fs";

// const elevenlabs = new ElevenLabsClient({
//   apiKey: process.env.ELEVENLABS_API_KEY,
// });

// export async function transcribeAudio(
//   filePath: string,
//   options?: Partial<BodySpeechToTextV1SpeechToTextPost>
// ) {
//   console.log("Transcribing audio with Elevenlabs...");
//   const transcription = await elevenlabs.speechToText.convert({
//     file: fs.createReadStream(filePath),
//     modelId: "scribe_v1",
//     tagAudioEvents: true,
//     languageCode: "eng",
//     diarize: true,
//   });

//   console.log("Transcription complete");
//   return transcription as SpeechToTextChunkResponseModel;
// }
