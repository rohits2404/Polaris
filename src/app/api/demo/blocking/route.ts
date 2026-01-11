import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export async function POST() {
    const response = await generateText({
        model: google("gemini-2.5-flash-lite"),
        prompt: "Write a Vegetarian Lasagna Recipe for 4 People",
        experimental_telemetry: {
            isEnabled: true,
            recordInputs: true,
            recordOutputs: true
        }
    })
    return Response.json({ response })
}