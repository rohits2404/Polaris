import { generateText } from "ai";
import { inngest } from "./client";
import { createOpenAI } from "@ai-sdk/openai";

const groq = createOpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});

export const demoGenerate = inngest.createFunction(
    {
        id: "demo-generate",
        triggers: [{ event: "demo/generate" }],
    },
    async ({ step }) => {
        await step.run("generate-text", async () => {
            return await generateText({
                model: groq("openai/gpt-oss-20b"),
                prompt: "Write a vegetarian lasagna recipe for 4 people.",
            });
        });
    }
);