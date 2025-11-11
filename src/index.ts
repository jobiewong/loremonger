import fs from "fs";
// import { transcribeAudio } from "~/lib/openai-utils";
import { transcribeAudio } from "~/lib/el-labs-utils";
import { getTokenCount } from "~/lib/utils";

const inputFile = "src/input/audio.mp3";
// const transcription = await transcribeAudio(inputFile);
const transcription = await transcribeAudio(inputFile, { numSpeakers: 6 });

const tokenCount = getTokenCount("gpt-5-nano", transcription.text ?? "");
console.log("Transcript token count: ", tokenCount);

fs.writeFileSync(
  `src/output/${new Date().toISOString()}-transcription.txt`,
  transcription.text ?? ""
);
