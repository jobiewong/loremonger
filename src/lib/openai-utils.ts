import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import { toast } from "sonner";
import { getRecord } from "~/lib/stronghold";
import { getStrongholdStore } from "~/lib/utils";
import { Player } from "~/types";

let cachedApiKey: string | null = null;
let apiKeyPromise: Promise<string> | null = null;
let cachedAIProvider: ReturnType<typeof createOpenAI> | null = null;

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

export async function getAIProvider() {
  if (cachedAIProvider) {
    return cachedAIProvider;
  }
  const apiKey = await getCachedOpenaiApiKey();
  cachedAIProvider = createOpenAI({ apiKey });
  return cachedAIProvider;
}

export async function generateNotes(
  transcript: string,
  dmName: string,
  players: Player[],
  debug: boolean = false
) {
  const aiClient = await getAIProvider();
  try {
    const debugPrompt = `You are a helpful assistant that generates session notes for a Dungeons and Dragons game. Right now, you will be given a debug transcript. Return the following text verbatim:
    # Debug Session Notes 

    ## Session Summary
    ${transcript}
    `;
    const systemPrompt = `
  You are a helpful assistant that generates session notes for a Dungeons and Dragons game. Your goal is to capture the important details of the session. Write summary descriptions of characters and places in the session, as well as a timeline of events. Bear in mind that the transcript is a real-time transcription of the session, so it may contain some errors and typos on names. Try to correct the transcription where possible without making assumptions.
  The players consist of the following characters: 
  ${players
    .map(
      (player) => `${player.characterName} (played by: ${player.playerName})`
    )
    .join("\n")}
  The Dungeon Master name is ${dmName}.

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

    const { text, usage } = await generateText({
      model: aiClient("gpt-5-nano"),
      system: debug ? debugPrompt : systemPrompt,
      prompt: `Here is the session transcript you should use to generate the notes:
    ${transcript}`,
    });

    console.log("Usage: ", JSON.stringify(usage, null, 2));

    return text;
  } catch (error) {
    console.error("🚀 ~ generateNotes ~ error:", error);
    return null;
  }
}
