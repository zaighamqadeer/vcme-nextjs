import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function getVibeFeedback(prompt: string, userResponse: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a strict but encouraging Vibe Coding mentor. A student was asked to write a prompt for this task: "${prompt}".
      They wrote: "${userResponse}".
      
      Evaluate their prompt out of 10. A good prompt must be specific, clear, and actionable.
      If they just write "prompt", "do it", or something extremely vague, give them a low score (e.g., 1-3) and fail them.
      If it's decent but missing details, give them a 4-6.
      If it's good, give them a 7-10.
      Only pass them if the score is 6 or higher.
      Provide a brief, encouraging feedback (max 2 sentences) explaining the rating and how to improve.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            rating: { type: Type.NUMBER, description: "Score out of 10" },
            feedback: { type: Type.STRING, description: "Brief feedback and improvement tips" },
            pass: { type: Type.BOOLEAN, description: "True if score is 6 or higher" }
          },
          required: ["rating", "feedback", "pass"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      rating: 5,
      feedback: "We couldn't evaluate your prompt right now, but try to be as specific as possible!",
      pass: true
    };
  }
}

export async function getHint(taskPrompt: string, userResponse: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `A student is struggling with a Vibe Coding task.
      Task: "${taskPrompt}"
      Their last attempt: "${userResponse}"
      
      Provide a helpful hint or a better way to phrase their prompt. 
      Be brief (max 2 sentences). Don't give the full answer if possible, but guide them.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Hint Error:", error);
    return "Try to be more specific about the features and layout you want!";
  }
}
