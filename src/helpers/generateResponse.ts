import { GoogleGenerativeAI } from "@google/generative-ai";

const configuration = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);


function cleanJsonResponse(text: string): string {
  return text.replace(/```json|```/g, "").trim();
}

export const generateResponse = async (prompt: string) => {
  try {
      const modelId = "gemini-1.5-flash";
  const model = configuration.getGenerativeModel({
    model: modelId,
    generationConfig: {
      temperature: 0,
      maxOutputTokens: 8192,
      responseMimeType: "application/json",
    },
  });

    const chat = model.startChat({});
    const result = await chat.sendMessage(prompt);
    const response = result.response;
    const cleaned = cleanJsonResponse(response.text());
    return JSON.parse(cleaned);
  } catch (err) {
    console.error(err);
    return { status: "error", message: "Failed to process response" };
  }
};