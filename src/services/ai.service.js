import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';

// Configure dotenv
dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function generateResponse(content) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: content,
  });

  return response.text;
}

async function generateVectors(content)
{
  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: content,
    config: {
      outputDimensionality: 768
    },
  });

  return response.embeddings[0].values;
}


export { generateResponse, generateVectors };
