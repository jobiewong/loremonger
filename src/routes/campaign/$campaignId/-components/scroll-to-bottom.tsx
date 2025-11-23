import { useAtomValue } from "jotai";
import { useEffect, useRef } from "react";
import {
  isLoadingAtom,
  isSuccessAtom,
  progressLogsAtom,
} from "~/components/audio-upload/atoms";

export function ScrollToBottom() {
  const spacerRef = useRef<HTMLDivElement>(null);
  const progressLogs = useAtomValue(progressLogsAtom);
  const isSuccess = useAtomValue(isSuccessAtom);
  const isLoading = useAtomValue(isLoadingAtom);

  useEffect(() => {
    if ((progressLogs.length > 0 && isLoading) || isSuccess) {
      spacerRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [progressLogs.length, isLoading, isSuccess]);

  return <div id="spacer" ref={spacerRef} className="w-full h-0" />;
}
