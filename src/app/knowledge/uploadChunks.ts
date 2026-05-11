// src/knowledge/uploadChunks.ts
// Run ONE time only to push all chunks to Pinecone
// Command: npx ts-node src/knowledge/uploadChunks.ts

import * as dotenv from 'dotenv'
dotenv.config()

import { Pinecone } from '@pinecone-database/pinecone'
import OpenAI from 'openai'
import chunks from './chunks'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! })

// ── Custom metadata type for our chunks ───────────────────────

type ChunkPineconeMetadata = {
  source: string
  section: string
  phase: string
  topic: string
  text: string
  goal: string        // stored as comma-separated string
  level: string       // stored as comma-separated string
  intensityRange?: string
  frequency?: number
}

// ── Embed text using OpenAI ───────────────────────────────────

async function embedText(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text
  })
  return response.data[0].embedding
}

// ── Upload all chunks ─────────────────────────────────────────

async function uploadChunks(): Promise<void> {
  // Pinecone v7 — target index by name directly
  const index = pinecone.index<ChunkPineconeMetadata>(
    process.env.PINECONE_INDEX_NAME!
  )

  console.log(`Starting upload of ${chunks.length} chunks to Pinecone...`)

  for (const chunk of chunks) {
    try {
      const values = await embedText(chunk.text)

      // Build clean metadata object
      // Pinecone only supports string | number | boolean in metadata
      const metadata: ChunkPineconeMetadata = {
        source:  chunk.metadata.source,
        section: chunk.metadata.section,
        phase:   chunk.metadata.phase,
        topic:   chunk.metadata.topic,
        text:    chunk.text,

        // Convert arrays to comma-separated strings
        goal: Array.isArray(chunk.metadata.goal)
          ? chunk.metadata.goal.join(',')
          : String(chunk.metadata.goal),

        level: Array.isArray(chunk.metadata.level)
          ? chunk.metadata.level.join(',')
          : String(chunk.metadata.level),
      }

      // Only add optional fields if they exist
      if (chunk.metadata.intensityRange !== undefined) {
        metadata.intensityRange = chunk.metadata.intensityRange
      }
      if (chunk.metadata.frequency !== undefined) {
        metadata.frequency = chunk.metadata.frequency
      }

      // ── Pinecone v7 syntax ────────────────────────────────
      // upsert takes { records: [...] } not a plain array
      await index.upsert({
        records: [
          {
            id: chunk.id,
            values,
            metadata
          }
        ]
      })

      console.log(`✓ Uploaded: ${chunk.id}`)

      // Small delay to avoid hitting OpenAI rate limits
      await new Promise(r => setTimeout(r, 300))

    } catch (error) {
      console.error(`✗ Failed: ${chunk.id}`, error)
    }
  }

  console.log('\nAll chunks uploaded successfully.')
  console.log('You do not need to run this script again unless chunks.ts changes.')
}

uploadChunks()