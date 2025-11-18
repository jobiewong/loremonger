import { getRecord, initStronghold, insertRecord } from "~/lib/stronghold";

let bootstrapPromise: Promise<void> | null = null;

export function bootstrapStrongholdFromEnv() {
  if (!import.meta.env.DEV) {
    return;
  }

  if (bootstrapPromise) {
    return;
  }

  const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY?.trim();
  const elevenlabsApiKey = import.meta.env.VITE_ELEVENLABS_API_KEY?.trim();

  if (!openaiApiKey && !elevenlabsApiKey) {
    console.warn(
      "[bootstrap-stronghold] Missing VITE_OPENAI_API_KEY and VITE_ELEVENLABS_API_KEY in .env; skipping seed."
    );
    return;
  }

  bootstrapPromise = (async () => {
    try {
      const { client, stronghold } = await initStronghold();
      const store = client.getStore();
      let needsSave = false;

      // Seed OpenAI key
      if (openaiApiKey) {
        try {
          const existing = await getRecord(store, "openai-api-key");
          if (existing) {
            console.info(
              "[bootstrap-stronghold] Found existing OpenAI key; skipping seed."
            );
          } else {
            await insertRecord(store, "openai-api-key", openaiApiKey);
            needsSave = true;
            console.info("[bootstrap-stronghold] Seeded OpenAI key from .env.");
          }
        } catch (error) {
          console.error(
            "[bootstrap-stronghold] Failed to seed OpenAI key:",
            error
          );
        }
      }

      // Seed ElevenLabs key
      if (elevenlabsApiKey) {
        try {
          const existing = await getRecord(store, "elevenlabs-api-key");
          if (existing) {
            console.info(
              "[bootstrap-stronghold] Found existing ElevenLabs key; skipping seed."
            );
          } else {
            await insertRecord(store, "elevenlabs-api-key", elevenlabsApiKey);
            needsSave = true;
            console.info(
              "[bootstrap-stronghold] Seeded ElevenLabs key from .env."
            );
          }
        } catch (error) {
          console.error(
            "[bootstrap-stronghold] Failed to seed ElevenLabs key:",
            error
          );
        }
      }

      if (needsSave) {
        await stronghold.save();
      }
    } catch (error) {
      console.error(
        "[bootstrap-stronghold] Failed to seed API keys from .env:",
        error
      );
    } finally {
      bootstrapPromise = null;
    }
  })();
}
