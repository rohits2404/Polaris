import { generateText, Output } from "ai";
import { NextResponse } from "next/server";
import { z } from "zod";
import { google } from "@ai-sdk/google";
import { auth } from "@clerk/nextjs/server";

const suggestionSchema = z.object({
    suggestion: z
        .string()
        .nullable()
        .describe("The Code To Insert at Cursor, or null If No Completion Needed"),
});

export async function POST(request: Request) {
    let body: any;

    // 🔒 SAFETY 1: Handle aborted / empty / invalid JSON
    try {
        body = await request.json();
    } catch {
        // Normal for aborted autocomplete requests
        return NextResponse.json({ suggestion: "" }, { status: 200 });
    }

    const { userId } = await auth();

    if(!userId) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 403 }
        )
    }

    const {
        fileName,
        code,
        currentLine,
        previousLines,
        textBeforeCursor,
        textAfterCursor,
        nextLines,
        lineNumber,
    } = body ?? {};

    // 🔒 SAFETY 2: Missing payload → silent no-op
    if (!code || typeof code !== "string") {
        return NextResponse.json({ suggestion: "" }, { status: 200 });
    }

    try {
        const prompt = `You are a code autocompletion engine. You analyze code context and return a JSON response.

<context>
    <file_name>${fileName}</file_name>
    <line_info>
        <line_number>${lineNumber}</line_number>
        <current_line_content>${currentLine}</current_line_content>
    </line_info>
    <cursor_context>
        <before_cursor>${textBeforeCursor}</before_cursor>
        <after_cursor>${textAfterCursor}</after_cursor>
    </cursor_context>
    <surrounding_lines>
        <prev>${previousLines || ""}</prev>
        <next>${nextLines || ""}</next>
    </surrounding_lines>
    <full_code_reference>
        ${code}
    </full_code_reference>
</context>

<instructions>
Analyze the cursor position. Your goal is to predict the immediate next code tokens.

Logic flow:
1. CHECK CONTINUITY: If the text in 'after_cursor' or 'next' logically continues the text in 'before_cursor', return null.
2. CHECK COMPLETENESS: If the block is complete and no new block is implied, return null.
3. GENERATE: Otherwise, generate the minimal code required.
</instructions>`;

        const { output } = await generateText({
            model: google("gemini-2.0-flash-001"),
            output: Output.object({ schema: suggestionSchema }),
            prompt,
            temperature: 0,
        });

        return NextResponse.json({
            suggestion: output?.suggestion ?? "",
        });
    } catch {
        // 🔒 SAFETY 3: AI errors should NOT break editor UX
        return NextResponse.json({ suggestion: "" }, { status: 200 });
    }
}