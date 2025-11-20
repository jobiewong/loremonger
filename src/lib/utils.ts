import { documentDir } from "@tauri-apps/api/path";
import { save } from "@tauri-apps/plugin-dialog";
import { create } from "@tauri-apps/plugin-fs";
import { Store } from "@tauri-apps/plugin-stronghold";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { encoding_for_model, type TiktokenModel } from "tiktoken";
import { v7 as uuidv7 } from "uuid";
import { initStronghold } from "~/lib/stronghold";

let strongholdStorePromise: Promise<Store> | null = null;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

export function getGpt5NanoCost(tokens: number) {
  return tokens * GPT_5_NANO_COST_PER_TOKEN;
}

export function calculateCost(text: string, model: TiktokenModel) {
  const tokens = getTokenCount(model, text);
  const cost = getGpt5NanoCost(tokens);
  return {
    tokens,
    cost,
  };
}

export async function getStrongholdStore() {
  if (!strongholdStorePromise) {
    strongholdStorePromise = (async () => {
      const { client } = await initStronghold();
      return client.getStore();
    })().catch((error) => {
      strongholdStorePromise = null;
      throw error;
    });
  }
  return strongholdStorePromise;
}

export async function saveFileWithPrompt(file: File) {
  const documentsDir = await documentDir();
  const defaultPath = `${documentsDir}/${file.name}`;

  const path = await save({
    filters: [
      {
        name: "Markdown filter",
        extensions: ["mdx", "md", "txt"],
      },
    ],
    defaultPath,
  });

  if (path) {
    const content = new Uint8Array(await file.arrayBuffer());
    const fileRef = await create(path);
    await fileRef.write(content);
    await fileRef.close();
  }
}

export function generateId() {
  return uuidv7();
}
