import { GoogleGenAI, Type } from "@google/genai";
import { Table, Column } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Constants for models
const MODEL_FAST = 'gemini-2.5-flash';

export const generateSqlFromNl = async (
  prompt: string,
  tables: Table[]
): Promise<{ sql: string; explanation: string }> => {
  if (!apiKey) throw new Error("API Key not found");

  const schemaDescription = tables.map(t => 
    `Table: ${t.name} (${t.description || ''})
     Columns: ${t.columns.map(c => `${c.name} (${c.type})`).join(', ')}`
  ).join('\n\n');

  const systemInstruction = `
    You are a SQL expert. Your job is to translate natural language queries into standard SQL.
    
    Rules:
    1. Use ONLY the tables and columns provided in the schema.
    2. Return valid SQL compatible with standard PostgreSQL/MySQL syntax.
    3. Provide a brief explanation of what the query does.
    
    Schema:
    ${schemaDescription}
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_FAST,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sql: { type: Type.STRING, description: "The generated SQL query" },
            explanation: { type: Type.STRING, description: "A short explanation of the query logic" }
          },
          required: ["sql", "explanation"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    return JSON.parse(text);
  } catch (error) {
    console.error("AI SQL Gen Error:", error);
    return { sql: "-- Error generating SQL", explanation: "Failed to contact AI service." };
  }
};

export const analyzeTableData = async (table: Table): Promise<{ summary: string; trends: string[]; insights: string[] }> => {
  if (!apiKey) throw new Error("API Key not found");

  // Take a sample of the data (max 20 rows) to avoid huge context
  const sampleRows = table.rows.slice(0, 20);
  const dataStr = JSON.stringify(sampleRows);

  const systemInstruction = `
    You are a Senior Data Analyst. Analyze the provided JSON dataset representing a database table: "${table.name}".
    
    Tasks:
    1. Summarize the nature of the data.
    2. Identify key trends or patterns (e.g., common roles, high value orders, stock levels).
    3. Provide actionable business insights.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_FAST,
      contents: `Here is the table data sample:\n${dataStr}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            trends: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            insights: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            }
          },
          required: ["summary", "trends", "insights"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    return JSON.parse(text);
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return { 
      summary: "Analysis unavailable.", 
      trends: ["Could not fetch trends."], 
      insights: ["Check API key and try again."] 
    };
  }
};

export const generateMockRows = async (table: Table, count: number): Promise<any[]> => {
  if (!apiKey) throw new Error("API Key not found");

  const schemaStr = `Table: ${table.name}, Columns: ${table.columns.map(c => `${c.name} (${c.type})`).join(', ')}`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_FAST,
      contents: `Generate ${count} realistic mock rows for this table. Return valid JSON array.`,
      config: {
        systemInstruction: `You are a data generator. Schema: ${schemaStr}. Return ONLY a JSON array of objects. Ensure data types match.`,
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.OBJECT, properties: {} } // allowing dynamic object
        }
      }
    });
    
    const text = response.text;
    if (!text) return [];
    return JSON.parse(text);
  } catch (e) {
    console.error("Mock Data Gen Error", e);
    return [];
  }
};
