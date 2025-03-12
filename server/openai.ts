import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a survey creation expert. Generate thoughtful survey questions based on the given topic.",
        },
        {
          role: "user",
          content: `Create ${numQuestions} survey questions about "${topic}". Mix different question types from: ${types.join(', ')}. Format as JSON array with fields: id, text, type, and options (for multiple choice).`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content);
    return result.questions;
  } catch (error) {
    throw new Error(`Failed to generate survey questions: ${error.message}`);
  }
}

export async function analyzeSurveyResponses(responses: any[]) {
  try {
    const response = await openai
      .chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a data analysis expert. Analyze the survey responses and provide insights.",
          },
          {
            role: "user",
            content: `Analyze these survey responses and provide key insights: ${JSON.stringify(
              responses,
            )}. Return as JSON with sentiment, trends, and recommendations fields.`,
          },
        ],
        response_format: { type: "json_object" },
      });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    throw new Error(`Failed to analyze survey responses: ${error.message}`);
  }
}
