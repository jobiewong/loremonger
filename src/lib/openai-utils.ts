import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { toast } from "sonner";
import { getRecord } from "~/lib/stronghold";
import { calculateCost, getStrongholdStore } from "~/lib/utils";
import { Player } from "~/types";

let cachedApiKey: string | null = null;
let apiKeyPromise: Promise<string> | null = null;
let cachedOpenAIClient: OpenAI | null = null;

async function getCachedOpenaiApiKey() {
  if (cachedApiKey) {
    return cachedApiKey;
  }
  if (!apiKeyPromise) {
    const toastId = toast.loading("Loading OpenAI API key...");
    apiKeyPromise = (async () => {
      const store = await getStrongholdStore();
      const apiKey = await getRecord(store, "openai-api-key");
      cachedApiKey = apiKey;
      apiKeyPromise = null;
      toast.success("OpenAI API key loaded", { id: toastId });
      return apiKey;
    })().catch((error) => {
      apiKeyPromise = null;
      throw error;
    });
  }
  return apiKeyPromise;
}

export async function getOpenAIClient() {
  if (cachedOpenAIClient) {
    return cachedOpenAIClient;
  }
  const apiKey = await getCachedOpenaiApiKey();
  cachedOpenAIClient = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
  return cachedOpenAIClient;
}

export function resetOpenAICache() {
  cachedOpenAIClient = null;
  cachedApiKey = null;
}

export async function getChatCompletion(
  messages: ChatCompletionMessageParam[]
) {
  const openai = await getOpenAIClient();
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages,
  });
  return completion.choices[0].message.content;
}

export async function generateNotes(transcript: string, characters: Player[]) {
  const toastId = toast.loading("Generating notes...");
  try {
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

    const { tokens, cost } = calculateCost(transcript, "gpt-5-nano");
    console.log("🚀 ~ generateNotes ~ tokens:", tokens, cost);

    console.log("Generating notes...");
    const { text, usage } = await generateText({
      model: openai("gpt-5-nano"),
      system: systemPrompt,
      prompt: `Here is the session transcript you should use to generate the notes:
    ${transcript}`,
    });

    console.log("Notes generated");
    console.log("Usage: ", JSON.stringify(usage, null, 2));
    toast.success("Notes generated", { id: toastId });

    return text;
  } catch (error) {
    console.error("🚀 ~ generateNotes ~ error:", error);
    toast.error("Error generating notes", {
      description: error instanceof Error ? error.message : "Unknown error",
      id: toastId,
    });
    return null;
  }
}
