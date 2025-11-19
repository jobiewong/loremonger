import { atom } from "jotai";

export type Status = "idle" | "loading" | "success" | "error";

interface Progress {
  transcribe: Status;
  generateNotes: Status;
  cleanUp: Status;
}

export const statusAtom = atom<Progress>({
  transcribe: "idle",
  generateNotes: "idle",
  cleanUp: "idle",
});

export const processingFileAtom = atom<string | null>(null);
export const transcriptStatsAtom = atom<{
  tokens: number;
  wordCount: number;
  cost: number;
} | null>(null);
