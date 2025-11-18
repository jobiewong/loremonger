import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { type SpeechToTextChunkResponseModel } from "@elevenlabs/elevenlabs-js/api";
import { toast } from "sonner";
import { getRecord } from "~/lib/stronghold";
import { getStrongholdStore } from "~/lib/utils";

let cachedApiKey: string | null = null;
let apiKeyPromise: Promise<string> | null = null;
let cachedElevenlabsClient: ElevenLabsClient | null = null;

async function getCachedElevenlabsApiKey() {
  if (cachedApiKey) {
    return cachedApiKey;
  }
  if (!apiKeyPromise) {
    const toastId = toast.loading("Loading Elevenlabs API key...");
    apiKeyPromise = (async () => {
      const store = await getStrongholdStore();
      const apiKey = await getRecord(store, "elevenlabs-api-key");
      cachedApiKey = apiKey;
      apiKeyPromise = null;
      toast.success("Elevenlabs API key loaded", { id: toastId });
      return apiKey;
    })().catch((error) => {
      apiKeyPromise = null;
      throw error;
    });
  }
  return apiKeyPromise;
}

export async function getElevenlabsClient() {
  if (cachedElevenlabsClient) {
    return cachedElevenlabsClient;
  }
  const apiKey = await getCachedElevenlabsApiKey();
  cachedElevenlabsClient = new ElevenLabsClient({
    apiKey,
  });
  return cachedElevenlabsClient;
}

export function resetOpenAICache() {
  cachedElevenlabsClient = null;
  cachedApiKey = null;
}

export async function transcribeAudio(file: File) {
  const toastId = toast.loading("Transcribing audio...");
  try {
    const elevenlabs = await getElevenlabsClient();
    const transcription = await elevenlabs.speechToText.convert({
      file: file.stream(),
      modelId: "scribe_v1",
      tagAudioEvents: true,
      languageCode: "eng",
      diarize: true,
    });

    toast.success("Transcription complete", { id: toastId });
    return transcription as SpeechToTextChunkResponseModel;
  } catch (error) {
    console.error("🚀 ~ transcribeAudio ~ error:", error);
    toast.error("Error transcribing audio", {
      description: error instanceof Error ? error.message : "Unknown error",
      id: toastId,
    });
    return null;
  }
}
