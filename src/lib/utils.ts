import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import fs from "fs";
import { encoding_for_model, type TiktokenModel } from "tiktoken";
import { transcribeAudio } from "~/lib/el-labs-utils";
import { Player } from "~/types";

const GPT_5_NANO_COST_PER_TOKEN = 0.05 / 1000000;

export function getTimestampString() {
  const date = new Date();
  return date.toISOString();
}

export function getEncoding(model: TiktokenModel) {
  return encoding_for_model(model);
}

export function getTokenCount(model: TiktokenModel, text: string) {
  const encoding = getEncoding(model);
  return encoding.encode(text).length;
}

export async function createTranscription(inputFile: string) {
  const timestamp = getTimestampString();

  const transcription = await transcribeAudio(inputFile, { numSpeakers: 6 });

  return transcription;
}

export async function generateNotes(transcript: string, characters: Player[]) {
  const systemPrompt = `
  You are a helpful assistant that generates session notes for a Dungeons and Dragons game. Your goal is to capture the important details of the session. Write summary descriptions of characters and places in the session, as well as a timeline of events. Bear in mind that the transcript is a real-time transcription of the session, so it may contain some errors and typos on names. Try to correct the transcription where possible without making assumptions.
  The players consist of the following characters: 
  ${characters
    .filter((character) => character.type === "player")
    .map((character) => `${character.name} (${character.playerName})`)
    .join("\n")}
  The Dungeon Master(s) are ${characters
    .filter((character) => character.type === "gm")
    .map((character) => character.playerName)
    .join(", ")}
  The notes should be in markdown format with bold/italic/table/list/quote formatting where appropriate. Do not include any other text than the notes. Use a neutral tone and keep it concise while retaining important details.
  The notes should include the following sections:
  # Session Notes: (date)
  ## Session Summary
  ## Characters
  ### Players
  ### NPCs
  ## Locations
  ## Timeline of Events
  ## Summary
  ### Story Hooks
  ### Key Clues, Lore, & Items of Interest
  ### Next Steps
  `;

  const tokenCount = getTokenCount("gpt-5-nano", transcript);
  console.log("Transcript token count: ", tokenCount.toLocaleString());

  console.log("Generating notes...");
  const { text, usage } = await generateText({
    model: openai("gpt-5-nano"),
    system: systemPrompt,
    prompt: `Here is the session transcript you should use to generate the notes:
    ${transcript}`,
  });

  console.log("Notes generated");
  console.log("Usage: ", JSON.stringify(usage, null, 2));
  console.log(
    "Total Cost: $",
    ((usage?.totalTokens ?? 0) * GPT_5_NANO_COST_PER_TOKEN).toFixed(6)
  );

  return text;
}
