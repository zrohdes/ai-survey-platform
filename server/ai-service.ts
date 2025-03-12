import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

type GenerateQuestionsInput = {
  topic: string;
  numQuestions?: number;
  types?: Array<'multiple_choice' | 'text' | 'rating'>;
};

export async function generateSurveyQuestions({
  topic,
  numQuestions = 5,
  types = ['multiple_choice', 'text', 'rating'],
}: GenerateQuestionsInput) {
  try {
    const prompt = `Create ${numQuestions} survey questions about "${topic}". Mix different question types from: ${types.join(', ')}. Format as JSON array with fields: id, text, type, and options (for multiple choice). Return ONLY the JSON, no other text.`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }]}],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      },
      safetySettings: [
        {
          category: HarmCategory.HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    });

    const response = await result.response;
    const text = response.text();
    const questions = JSON.parse(text);
    return Array.isArray(questions) ? questions : questions.questions;
  } catch (error: any) {
    throw new Error(`Failed to generate survey questions: ${error.message}`);
  }
}

export async function analyzeSurveyResponses(responses: any[]) {
  try {
    const prompt = `Analyze these survey responses and provide insights: ${JSON.stringify(
      responses,
    )}. Return JSON with sentiment (object with positive, neutral, negative counts), trends (array of strings), and recommendations (array of strings). Return ONLY the JSON, no other text.`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }]}],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      },
    });

    const response = await result.response;
    return JSON.parse(response.text());
  } catch (error: any) {
    throw new Error(`Failed to analyze survey responses: ${error.message}`);
  }
}
