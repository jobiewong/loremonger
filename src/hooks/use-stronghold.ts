import { Client, Stronghold } from "@tauri-apps/plugin-stronghold";
import { useEffect, useState } from "react";
import { initStronghold } from "~/lib/stronghold";

interface StrongholdObject {
  stronghold: Stronghold;
  client: Client;
}

export function useStronghold() {
  const [strongholdData, setStrongholdData] = useState<StrongholdObject | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function init() {
      try {
        setIsLoading(true);
        setError(null);
        const result = await initStronghold();
        setStrongholdData(result);
      } catch (err) {
        console.error("Failed to initialize Stronghold:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);

  return {
    stronghold: strongholdData?.stronghold,
    client: strongholdData?.client,
    isLoading,
    error,
  };
}
