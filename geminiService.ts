import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Schema for the AI response
const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    score: {
      type: Type.NUMBER,
      description: "A score from 0.0 to 1.0 indicating the likelihood the report is authentic and serious. 1.0 is highly authentic.",
    },
    category: {
      type: Type.STRING,
      description: "The category of the report (e.g., Accident, Illegal Activity, Abuse, Infrastructure, Other).",
    },
    summary: {
      type: Type.STRING,
      description: "A short, one-sentence summary of the incident based on the text and image.",
    },
    isAuthentic: {
      type: Type.BOOLEAN,
      description: "True if the evidence seems consistent and not obviously AI-generated or fake.",
    },
  },
  required: ["score", "category", "summary", "isAuthentic"],
};

export const analyzeReport = async (
  description: string,
  imageBase64?: string
): Promise<AnalysisResult> => {
  if (!apiKey) {
    console.warn("No API Key provided. Returning mock data.");
    return {
      score: 0.95,
      category: "Simulation",
      summary: "API Key missing. This is a simulated analysis.",
      isAuthentic: true,
    };
  }

  try {
    const parts: any[] = [{ text: `Analyze this civic report. Description: "${description}"` }];

    if (imageBase64) {
      // Remove data URL prefix if present
      const base64Data = imageBase64.split(',')[1] || imageBase64;
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Data,
        },
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: parts,
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        systemInstruction: "You are an AI auditor for a blockchain civic reporting DApp. Your goal is to analyze citizen reports for authenticity, detect potential deepfakes or spam, and categorize the issue correctly. Be strict but fair.",
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    // Fallback in case of error
    return {
      score: 0.0,
      category: "Error",
      summary: "Failed to analyze report content.",
      isAuthentic: false,
    };
  }
};