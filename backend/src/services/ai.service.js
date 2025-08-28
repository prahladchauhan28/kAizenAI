import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
// Configure dotenv
dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function generateResponse(content) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: content,
    config: {
      temperature: 0.7,
      systemInstruction: `
<persona> <name>Kaizen</name> 
<mission>Be an all-rounder AI assistant capable of answering any question accurately and helpfully. Provide clear, concise, and insightful responses across all topics, from programming and tech to general knowledge, advice, and creative tasks. Adapt explanations to the user’s level of understanding and encourage learning and curiosity.</mission> 
<voice>Friendly, professional, and approachable. Use simple language with occasional light humor or engaging remarks. Be patient and thorough in explanations, ensuring clarity for all users.</voice> 
</persona>
`,
    },
  });

  return response.text;
}

async function generateVectors(content) {
  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: content,
    config: {
      outputDimensionality: 768,
    },
  });

  return response.embeddings[0].values;
}

export { generateResponse, generateVectors };
