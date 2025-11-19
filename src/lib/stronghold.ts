import { appDataDir } from "@tauri-apps/api/path";
import { Client, Store, Stronghold } from "@tauri-apps/plugin-stronghold";

async function getMachineId(): Promise<string> {
  const dataDir = await appDataDir();
  return dataDir;
}

async function deriveVaultPassword(): Promise<string> {
  const machineId = await getMachineId();
  const appName = "loremonger-app";
  return `${appName}-${machineId}`;
}

export const initStronghold = async () => {
  const vaultPath = `${await appDataDir()}/vault.hold`;
  const vaultPassword = await deriveVaultPassword();
  const stronghold = await Stronghold.load(vaultPath, vaultPassword);

  let client: Client;
  const clientName = "loremonger-app";

  console.log("loading client...");
  try {
    client = await stronghold.loadClient(clientName);
    console.log("client loaded");
  } catch {
    console.log("client not found, creating...");
    client = await stronghold.createClient(clientName);
  }

  return {
    stronghold,
    client,
  };
};

export async function insertRecord(store: Store, key: string, value: string) {
  const data = Array.from(new TextEncoder().encode(value));
  await store.insert(key, data);
}

export async function getRecord(store: any, key: string): Promise<string> {
  const data = await store.get(key);
  return new TextDecoder().decode(new Uint8Array(data));
}
