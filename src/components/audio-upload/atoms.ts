import { atom } from "jotai";

export type Status = "idle" | "loading" | "success" | "error";

export const isLoadingAtom = atom<boolean>(false);
export const isSuccessAtom = atom<boolean>(false);

export interface Progress {
  timestamp: Date;
  message: string;
  tag: string;
  status?: Status;
}

export const progressLogsAtom = atom<Progress[]>([]);
