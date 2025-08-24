// Import the Pinecone library
import { Pinecone } from "@pinecone-database/pinecone";

// Initialize a Pinecone client with your API key
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

// Create a dense index with integrated embedding
const ChatAppIndex = pc.Index("chat-gpt");

async function createChatMemory({ vectors, metadata, message_id }) {
  await ChatAppIndex.upsert([
    {
      id: message_id,
      values: vectors,
      metadata,
    },
  ]);
}

async function queryMemory({ queryVectors, limit = 5, metadata }) {
  const data = await ChatAppIndex.query({
    vector: queryVectors,
    topK: limit,
    filter: metadata ? { metadata } : undefined,
    includeMetadata: true,
  });
  return data.matches;
}


export { createChatMemory, queryMemory };