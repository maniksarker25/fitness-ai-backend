// src/knowledge/uploadChunks.ts
// Run only when chunks.ts changes.
// Command: npm run seed:chunks

import * as dotenv from 'dotenv';
dotenv.config();

import { Pinecone, type RecordMetadata } from '@pinecone-database/pinecone';
import OpenAI from 'openai';
import AppError from '../error/appError';
import chunks, { type Chunk, type Goal, type Level } from './chunks';

const requiredEnv = [
  'OPENAI_API_KEY',
  'PINECONE_API_KEY',
  'PINECONE_INDEX_NAME',
] as const;

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new AppError(500, `Missing required environment variable: ${key}`);
  }
}

const openaiApiKey = process.env.OPENAI_API_KEY as string;
const pineconeApiKey = process.env.PINECONE_API_KEY as string;
const pineconeIndexName = process.env.PINECONE_INDEX_NAME as string;

const openai = new OpenAI({ apiKey: openaiApiKey });
const pinecone = new Pinecone({ apiKey: pineconeApiKey });

const EMBEDDING_MODEL = 'text-embedding-3-small';
const UPSERT_BATCH_SIZE = 25;

type ChunkPineconeMetadata = {
  source: string;
  section: string;
  phase: string;
  topic: string;
  text: string;
  goal: string[];
  level: string[];
  intensityRange?: string;
  frequency?: number;
} & RecordMetadata;

type ChunkRecord = {
  id: string;
  values: number[];
  metadata: ChunkPineconeMetadata;
};

const toArray = <T extends string>(value: T | T[]): string[] =>
  Array.isArray(value) ? value : [value];

const buildSearchText = (chunk: Chunk): string => {
  const goal = toArray<Goal>(chunk.metadata.goal).join(', ');
  const level = toArray<Level>(chunk.metadata.level).join(', ');

  return [
    `TOPIC: ${chunk.metadata.topic}`,
    `SOURCE: ${chunk.metadata.source}`,
    `SECTION: ${chunk.metadata.section}`,
    `GOAL: ${goal}`,
    `LEVEL: ${level}`,
    `PHASE: ${chunk.metadata.phase}`,
    chunk.text,
  ].join('\n');
};

const buildMetadata = (chunk: Chunk): ChunkPineconeMetadata => {
  const metadata: ChunkPineconeMetadata = {
    source: chunk.metadata.source,
    section: chunk.metadata.section,
    phase: chunk.metadata.phase,
    topic: chunk.metadata.topic,
    text: chunk.text,
    goal: toArray<Goal>(chunk.metadata.goal),
    level: toArray<Level>(chunk.metadata.level),
  };

  if (chunk.metadata.intensityRange !== undefined) {
    metadata.intensityRange = chunk.metadata.intensityRange;
  }

  if (chunk.metadata.frequency !== undefined) {
    metadata.frequency = chunk.metadata.frequency;
  }

  return metadata;
};

async function embedText(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: text,
  });

  return response.data[0].embedding;
}

const buildRecords = async (items: Chunk[]): Promise<ChunkRecord[]> => {
  const records: ChunkRecord[] = [];

  for (const chunk of items) {
    records.push({
      id: chunk.id,
      values: await embedText(buildSearchText(chunk)),
      metadata: buildMetadata(chunk),
    });
  }

  return records;
};

async function uploadChunks(): Promise<void> {
  const index = pinecone.index<ChunkPineconeMetadata>(pineconeIndexName);

  console.log(`Starting upload of ${chunks.length} chunks to Pinecone...`);

  let uploaded = 0;
  const failed: string[] = [];

  for (let i = 0; i < chunks.length; i += UPSERT_BATCH_SIZE) {
    const batch = chunks.slice(i, i + UPSERT_BATCH_SIZE);

    try {
      const records = await buildRecords(batch);
      await index.upsert({ records });

      uploaded += records.length;
      console.log(
        `Uploaded batch ${Math.floor(i / UPSERT_BATCH_SIZE) + 1}: ${records
          .map((record) => record.id)
          .join(', ')}`,
      );

      await new Promise((resolve) => setTimeout(resolve, 300));
    } catch (error) {
      const ids = batch.map((chunk) => chunk.id);
      failed.push(...ids);
      console.error(`Failed batch containing: ${ids.join(', ')}`, error);
    }
  }

  if (failed.length > 0) {
    throw new Error(
      `Uploaded ${uploaded}/${chunks.length} chunks. Failed chunk ids: ${failed.join(', ')}`,
    );
  }

  console.log(`\nAll ${uploaded} chunks uploaded successfully.`);
  console.log(
    'You do not need to run this script again unless chunks.ts changes.',
  );
}

uploadChunks().catch((error) => {
  console.error('Chunk upload failed:', error);
  process.exit(1);
});
