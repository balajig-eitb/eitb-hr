import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, ResumeAnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const modelId = 'gemini-2.5-flash';

export const generateJobDescription = async (title: string, skills: string, experience: string): Promise<string> => {
  try {
    const prompt = `
      Act as a senior HR specialist. Write a compelling and professional job description for a "${title}" position.
      
      Requirements:
      - Key Skills: ${skills}
      - Experience Level: ${experience}
      
      Structure the response with markdown:
      1. Role Overview
      2. Key Responsibilities (bullet points)
      3. Required Qualifications (bullet points)
      4. Why Join Us
      
      Keep the tone professional yet inviting.

     OUTPUT RULES (MANDATORY):
        - Return ONLY the job description.
        - Do NOT include explanations, confirmations, greetings, or apologies.
        - Do NOT mention AI, prompts, or the generation process.
        - Do NOT wrap the output in quotes or markdown.
        - If constraints are violated, regenerate silently.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });

    return response.text || "Failed to generate content.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "An error occurred while communicating with the AI service. Please check your API key.";
  }
};

export const analyzeCandidate = async (candidate: Candidate): Promise<string> => {
  try {
    const prompt = `
      You are an expert HR Recruiter. Analyze this candidate profile for the role of ${candidate.role}.
      
      Candidate Name: ${candidate.name}
      Experience: ${candidate.experience} years
      Skills: ${candidate.skills.join(', ')}
      
      Provide a brief 3-sentence summary evaluating their potential fit and suggest 2 key technical interview questions to ask them.
      Format:
      **Assessment:** [Your text here]
      
      **Interview Questions:**
      1. [Question 1]
      2. [Question 2]
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });

    return response.text || "Could not analyze candidate.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI analysis unavailable.";
  }
};

export const parseResume = async (resumeText: string): Promise<ResumeAnalysisResult | null> => {
  try {
    const prompt = `

            SYSTEM INSTRUCTION:
              You are a resume analyzer.

            TASK:
              Analyze the following resume text.
              Extract the candidate's name, email, list of technical skills, education summary,
              years of experience, a professional summary, key strengths, potential weaknesses,
              and give a match score (0–100) assuming a general tech role.
              Education must be returned as an array.
              Each item must be one education record.
              Do not return education as a single string.
                  
            OUTPUT RULES (MANDATORY):
                    - Return ONLY the resume analysis.
                    - Do NOT include greetings, confirmations, explanations, or apologies.
                    - Do NOT say "Here is", "Sure", or "I will".
                    - Do NOT mention AI, prompts, or the analysis process.
                    - Do NOT wrap the output in quotes or markdown.
                    - Do NOT ask follow-up questions.
                    - Use clear, professional language.
                    - If any rule is violated, regenerate silently.
      `;
    
    const response = await ai.models.generateContent({
      model: modelId,
      contents: [
        { text: prompt },
        { text: resumeText }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            email: { type: Type.STRING },
            skills: { type: Type.ARRAY, items: { type: Type.STRING } },
           education: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    degree: { type: Type.STRING },
                    field: { type: Type.STRING },
                    institution: { type: Type.STRING },
                    year: { type: Type.STRING }
                  },
                  required: ["degree", "institution"]
                }
              },
            experienceYears: { type: Type.NUMBER },
            summary: { type: Type.STRING },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
            matchScore: { type: Type.NUMBER }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as ResumeAnalysisResult;
    }
    return null;
  } catch (error) {
    console.error("Resume Parsing Error:", error);
    return null;
  }
};
