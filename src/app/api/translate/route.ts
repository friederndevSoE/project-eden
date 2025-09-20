import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({
  apiKey: process.env.GOOGLE_AI_API_KEY as string,
});

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json(
        { message: "Text content is required" },
        { status: 400 }
      );
    }

    const prompt = `Translate everything in the following English content to Vietnamese. Preserve all original line breaks and paragraphs. Do not add any extra commentary or formatting.
    Text to translate:
    ---
    ${text}
    ---
    Translated text:`;
    const result = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ parts: [{ text: prompt }] }],
    });

    const translatedText = result.text;

    return NextResponse.json({ translatedText }, { status: 200 });
  } catch (error) {
    console.error("Translation failed:", error);
    return NextResponse.json(
      { message: "Translation failed", error: (error as Error).message },
      { status: 500 }
    );
  }
}
