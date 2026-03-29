import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

const groq = createOpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});

export async function POST() {
    const response = await generateText({
        model: groq("openai/gpt-oss-20b"),
        prompt: "Write a vegetarian lasagna recipe for 4 people.",
    });
    return Response.json({ response });
}