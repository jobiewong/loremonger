import fs from "fs";
import { getTokenCount } from "~/lib/utils";

const model = "gpt-5-nano";
const text = fs.readFileSync(
  "src/output/2025-11-10T23:59:01.353Z-transcription.txt",
  "utf8"
);

const tokenCount = getTokenCount(model, text);
console.log("Token count: ", tokenCount.toLocaleString());
