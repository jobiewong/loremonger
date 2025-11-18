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
