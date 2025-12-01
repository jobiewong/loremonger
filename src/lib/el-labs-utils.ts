import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { type SpeechToTextChunkResponseModel } from "@elevenlabs/elevenlabs-js/api";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";
import { getCachedOpenaiApiKey } from "~/lib/openai-utils";
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

export async function transcribeAudio(
  file: File,
  numSpeakers: number | undefined,
  onError: (error: Error) => void
) {
  try {
    const store = await getStrongholdStore();
    const transcriptionService = await getRecord(
      store,
      "transcription-service"
    );
    if (transcriptionService === "elevenlabs") {
      toast.info("Transcribing audio with Elevenlabs");
      const elevenlabs = await getElevenlabsClient();
      const transcription = await elevenlabs.speechToText.convert({
        file: file.stream(),
        modelId: "scribe_v1",
        tagAudioEvents: true,
        languageCode: "eng",
        diarize: true,
        numSpeakers,
      });

      return transcription as SpeechToTextChunkResponseModel;
    } else {
      toast.info("Transcribing audio with OpenAI");
      console.log("Using OpenAI for transcription");
      const arrayBuffer = await file.arrayBuffer();
      const audioData = Array.from(new Uint8Array(arrayBuffer));

      if (audioData.length === 0) {
        throw new Error("Audio file is empty");
      }

      const apiKey = await getCachedOpenaiApiKey();

      if (!apiKey) {
        throw new Error("OpenAI API key is not configured");
      }

      try {
        const transcription = await invoke<{ text: string }>(
          "transcribe_audio",
          {
            request: {
              audio_data: audioData,
              api_key: apiKey,
            },
          }
        );
        return { text: transcription.text } as { text: string };
      } catch (invokeError) {
        let errorMessage = "Error transcribing audio";
        if (invokeError instanceof Error) {
          errorMessage = invokeError.message;
        } else if (typeof invokeError === "string") {
          errorMessage = invokeError;
        } else if (
          invokeError &&
          typeof invokeError === "object" &&
          "message" in invokeError
        ) {
          errorMessage = String(invokeError.message);
        }
        console.error("Transcription error details:", invokeError);
        throw new Error(errorMessage);
      }
    }
  } catch (error) {
    console.error("🚀 ~ transcribeAudio ~ error:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : typeof error === "string"
          ? error
          : "Error transcribing audio";
    onError(new Error(errorMessage));
    throw error; // Re-throw to allow caller to handle
  }
}
