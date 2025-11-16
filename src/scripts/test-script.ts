// import fs from "fs";
// import { transcribeAudio } from "~/lib/el-labs-utils";
// import {
//   createTranscription,
//   generateNotes,
//   getTimestampString,
//   getTokenCount,
// } from "~/lib/utils";
// import { Player } from "~/types";
// // import { transcribeAudio } from "~/lib/openai-utils";

// const inputFile = "src/input/audio.mp3";
// // const transcription = await transcribeAudio(inputFile);

// const outputDir = "src/output";
// const party: Player[] = [
//   {
//     name: "Sam",
//     playerName: "Sam",
//     type: "gm",
//   },
//   {
//     name: "Aemos",
//     playerName: "Jobie",
//     type: "player",
//   },
//   {
//     name: "Axowl",
//     playerName: "Dan",
//     type: "player",
//   },
//   {
//     name: "Minerva",
//     playerName: "Ashley",
//     type: "player",
//   },
//   {
//     name: "Selina",
//     playerName: "Leah",
//     type: "player",
//   },
//   {
//     name: "Varkesh",
//     playerName: "Tom",
//     type: "player",
//   },
// ];

// async function main() {
//   const timestamp = getTimestampString();
//   // const transcription = await createTranscription(inputFile);
//   // const transcriptionFile = `${outputDir}/${timestamp}-transcription.txt`;
//   // fs.writeFileSync(transcriptionFile, transcription.text ?? "");
//   // console.log("Transcription saved: ", transcriptionFile);

//   const loadTranscript = fs.readFileSync(
//     "src/output/2025-11-10T23:59:01.353Z-transcription.txt",
//     "utf8"
//   );

//   const notes = await generateNotes(loadTranscript, party);
//   const notesFile = `${outputDir}/${timestamp}-notes.md`;
//   fs.writeFileSync(notesFile, notes);
//   console.log("Notes saved: ", notesFile);
// }

// main();
