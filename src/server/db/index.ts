import { invoke } from "@tauri-apps/api/core";
import { drizzle } from "drizzle-orm/sqlite-proxy";
import * as schema from "./schema";

type Row = {
  columns: string[];
  values: string[];
};
const db = drizzle(
  async (sql, params, method) => {
    try {
      const rows = await invoke<Row[]>("run_sql", {
        query: { sql, params },
      });
      if (rows.length === 0 && method === "get") {
        return {} as { rows: string[] };
      }
      return method === "get"
        ? { rows: rows[0].values }
        : { rows: rows.map((r) => r.values) };
    } catch (e: unknown) {
      console.error("Error from sqlite proxy server: ", e);
      return { rows: [] };
    }
  },
  {
    schema,
    logger: true,
  }
);

export default db;
