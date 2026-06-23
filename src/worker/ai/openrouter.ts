import type { AIPayload } from "../pipeline/payload";

const SYSTEM_PROMPT = `You are RepoVitals AI — a senior software architect and security expert reviewing a JavaScript/Node.js GitHub repository.

You will receive structured analysis data. Write a detailed, honest, mentor-like report.
Reference actual package names, folder names, and findings from the data.
Do not be generic. Be specific.

Your output must be a single valid JSON object with these exact keys:

{
  "architectureObservations": "2-4 sentences analyzing folder structure, project organization, separation of concerns, and whether patterns are used correctly.",
  "libraryChoices": "2-4 sentences evaluating whether the chosen npm packages are appropriate, modern, and well-maintained. Call out any surprising or problematic choices.",
  "securityFlags": "2-3 sentences summarizing the most critical security concerns based on the vulnerabilities and signals found.",
  "quickWins": [
    "Specific action 1 — reference actual package name or file",
    "Specific action 2",
    "Specific action 3",
    "Specific action 4",
    "Specific action 5"
  ],
  "mentorSummary": "3-4 sentences overall verdict. Be honest and constructive. Mention what was done well AND what needs improvement."
}

Return ONLY the JSON object. No markdown fences, no preamble, no explanation.`;

const MODELS = [
  "google/gemma-4-31b-it:free",
  "qwen/qwen3-coder:free",
  "google/gemini-3.5-flash",
  "deepseek/deepseek-r1",
  "meta-llama/llama-3.3-70b-instruct",
];

export async function streamFromOpenRouter(
  payload: AIPayload,
  apiKey: string
): Promise<ReadableStream> {
  let response: Response | null = null;
  let lastError: Error | null = null;

  for (const model of MODELS) {
    try {
      response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://repovitals.dev",
          "X-Title": "RepoVitals",
        },
        body: JSON.stringify({
          model: model,
          stream: true,
          max_tokens: 2000,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            {
              role: "user",
              content: `Analyze this repository and return your JSON report:\n\n${JSON.stringify(payload, null, 2)}`,
            },
          ],
        }),
      });

      if (response.ok && response.body) {
        // Successful response with a readable stream
        return response.body;
      } else {
        // Consume any error body to avoid leaks
        const errorText = await response.text();
        console.warn(`OpenRouter model ${model} failed: ${response.status} ${errorText}`);
        lastError = new Error(`OpenRouter model ${model} returned status ${response.status}: ${errorText}`);
      }
    } catch (e: any) {
      console.warn(`OpenRouter model ${model} threw error:`, e);
      lastError = e;
    }
  }

  throw lastError || new Error("Failed to contact OpenRouter with all models");
}

export function extractTokenFromOpenRouterChunk(chunk: string): string {
  // OpenRouter streams in OpenAI-compatible SSE format
  // Each chunk: "data: {...}\n\n"
  const lines = chunk.split("\n").filter(l => l.trim().startsWith("data: ") && !l.includes("[DONE]"));
  return lines
    .map(line => {
      try {
        const jsonStr = line.replace(/^data:\s*/, "").trim();
        if (!jsonStr) return "";
        const json = JSON.parse(jsonStr);
        return json.choices?.[0]?.delta?.content ?? "";
      } catch {
        return "";
      }
    })
    .join("");
}
