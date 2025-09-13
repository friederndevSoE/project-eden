import "dotenv/config"; // this loads .env.local automatically
import { GoogleGenerativeAI } from "@google/generative-ai";

// Read API key from environment
const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function run() {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const result = await model.generateContent("Hello from Gemini 2.5 Flash!");
  console.log(result.response.text());
}

run();
