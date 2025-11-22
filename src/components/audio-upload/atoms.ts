import { atom } from "jotai";

export type Status = "idle" | "loading" | "success" | "error";

export interface Progress {
  timestamp: Date;
  message: string;
  tag: string;
  status?: Status;
}

export const progressLogsAtom = atom<Progress[]>([]);
