import "dotenv/config";

import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import OpenAI from "openai";
import path from "path";

const MAX_FILE_SIZE_MB = 25;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024; // 25MB in bytes

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Get the duration of an audio file in seconds
 */
export async function getAudioDuration(filePath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        reject(err);
        return;
      }
      const duration = metadata.format.duration;
      if (duration === undefined) {
        reject(new Error("Could not determine audio duration"));
        return;
      }
      resolve(duration);
    });
  });
}

/**
 * Split an audio file into chunks that are under 25MB
 */
export async function splitAudioFile(
  inputPath: string,
  outputDir: string,
  targetSizeBytes: number
): Promise<string[]> {
  const stats = fs.statSync(inputPath);
  const fileSize = stats.size;

  if (fileSize <= targetSizeBytes) {
    return [inputPath];
  }

  const duration = await getAudioDuration(inputPath);

  const sizeRatio = fileSize / targetSizeBytes;
  const numChunks = Math.ceil(sizeRatio);
  const chunkDuration = duration / numChunks;

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const chunkPaths: string[] = [];
  const baseName = path.basename(inputPath, path.extname(inputPath));
  const ext = path.extname(inputPath);

  for (let i = 0; i < numChunks; i++) {
    const startTime = i * chunkDuration;
    const chunkPath = path.join(outputDir, `${baseName}_chunk_${i + 1}${ext}`);

    await new Promise<void>((resolve, reject) => {
      ffmpeg(inputPath)
        .setStartTime(startTime)
        .setDuration(chunkDuration)
        .output(chunkPath)
        .on("end", () => {
          chunkPaths.push(chunkPath);
          resolve();
        })
        .on("error", (err) => {
          reject(err);
        })
        .run();
    });
  }

  return chunkPaths;
}

/**
 * Transcribe an audio file, splitting it into chunks if necessary
 */
export async function transcribeAudio(
  filePath: string,
  model: string = "gpt-4o-transcribe",
  responseFormat: string = "text",
  prompt: string = ""
): Promise<string> {
  const stats = fs.statSync(filePath);
  const fileSize = stats.size;

  // If file is under 25MB, transcribe directly
  if (fileSize <= MAX_FILE_SIZE_BYTES) {
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model,
      response_format: responseFormat as any,
      prompt,
    });
    return typeof transcription === "string"
      ? transcription
      : String(transcription);
  }

  console.log(
    `File size (${(fileSize / 1024 / 1024).toFixed(
      2
    )}MB) exceeds ${MAX_FILE_SIZE_MB}MB limit. Splitting into chunks...`
  );

  const tempDir = path.join(path.dirname(filePath), ".chunks");
  const chunkPaths = await splitAudioFile(
    filePath,
    tempDir,
    MAX_FILE_SIZE_BYTES
  );

  console.log(`Split into ${chunkPaths.length} chunks. Transcribing...`);

  const transcriptions: string[] = [];
  for (let i = 0; i < chunkPaths.length; i++) {
    console.log(`Transcribing chunk ${i + 1}/${chunkPaths.length}...`);
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(chunkPaths[i]),
      model,
      response_format: responseFormat as any,
      prompt,
    });
    const transcriptionText =
      typeof transcription === "string" ? transcription : String(transcription);
    transcriptions.push(transcriptionText);
  }

  for (const chunkPath of chunkPaths) {
    if (chunkPath !== filePath && fs.existsSync(chunkPath)) {
      fs.unlinkSync(chunkPath);
    }
  }
  if (fs.existsSync(tempDir)) {
    try {
      fs.rmdirSync(tempDir);
    } catch (err) {}
  }

  return transcriptions.join("\n\n");
}
