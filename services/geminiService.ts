import { GoogleGenAI, Type, Schema, Modality } from "@google/genai";
import { Task, UserSettings, DailyPlan, Priority, EnergyLevel } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const planSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    schedule: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          startTime: { type: Type.STRING, description: "Start time in HH:mm 24h format" },
          endTime: { type: Type.STRING, description: "End time in HH:mm 24h format" },
          title: { type: Type.STRING },
          type: { type: Type.STRING, enum: ["task", "break", "meeting", "buffer"] },
          priority: { type: Type.STRING, enum: ["High", "Medium", "Low"], nullable: true },
          reasoning: { type: Type.STRING, description: "Short explanation why this task was placed here" },
          energyContext: { type: Type.STRING, description: "Why it matches energy levels", nullable: true }
        },
        required: ["startTime", "endTime", "title", "type", "reasoning"]
      }
    },
    metrics: {
      type: Type.OBJECT,
      properties: {
        totalFocusHours: { type: Type.NUMBER },
        confidenceScore: { type: Type.NUMBER, description: "0 to 100 score of plan feasibility" },
        utilizationRate: { type: Type.NUMBER, description: "Percentage of work day used" }
      },
      required: ["totalFocusHours", "confidenceScore", "utilizationRate"]
    },
    deferredTasks: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          reason: { type: Type.STRING }
        },
        required: ["title", "reason"]
      }
    }
  },
  required: ["schedule", "metrics", "deferredTasks"]
};

export const generateDailyPlan = async (
  tasks: Task[], 
  settings: UserSettings,
  useThinking: boolean = false
): Promise<DailyPlan> => {
  
  const prompt = `
    You are an expert Productivity Assistant and Agile Coach.
    Create an optimal daily schedule based on the following inputs.
    
    Current Time: ${new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}
    
    User Settings:
    - Work Day: ${settings.workStart} to ${settings.workEnd}
    - Preferred Break Duration: ${settings.breakDuration} minutes
    
    Tasks List:
    ${JSON.stringify(tasks)}
    
    Scheduling Rules:
    1. Prioritize HIGH priority tasks during morning hours or high-energy blocks if possible.
    2. Group similar tasks to avoid context switching cost.
    3. Insert small buffer blocks (5-10 mins) between major heavy cognitive tasks.
    4. Ensure a break is taken around the middle of the work block.
    5. Do NOT schedule past the Work Day End time.
    6. If tasks cannot fit, move them to the 'deferredTasks' list with a polite reason.
    7. Provide a confidence score based on how realistic this plan is.
    
    Return the response strictly in JSON format matching the schema provided.
  `;

  // Select model based on mode
  const model = useThinking ? 'gemini-3-pro-preview' : 'gemini-2.5-flash-lite';

  try {
    const config: any = {
      responseMimeType: "application/json",
      responseSchema: planSchema,
    };

    // Apply Thinking Config only if using the Pro model (Thinking Mode)
    if (useThinking) {
      config.thinkingConfig = { thinkingBudget: 32768 };
      // Note: maxOutputTokens should NOT be set when using thinkingBudget
    } else {
      config.temperature = 0.3;
    }

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config
    });

    if (!response.text) {
      throw new Error("No response generated from AI");
    }

    const plan = JSON.parse(response.text) as DailyPlan;
    return plan;
  } catch (error) {
    console.error("Gemini Planning Error:", error);
    throw error;
  }
};

export const generatePlanSpeech = async (text: string): Promise<string | undefined> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-tts',
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  } catch (error) {
    console.error("TTS Generation Error:", error);
    throw error;
  }
};