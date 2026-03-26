import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface ArticleTranslation {
  titleHe: string;
  summaryHe: string;
  bodyHe: string;
}

interface RedditTranslation {
  titleHe: string;
  summaryHe: string;
}

export async function translateArticle(
  title: string,
  body: string
): Promise<ArticleTranslation> {
  const message = await client.messages.create({
    model: "claude-sonnet-4-6-20250514",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: `You are a professional Hebrew translator specializing in technology content.

Translate the following English article to Hebrew. Guidelines:
- Use natural, fluent Hebrew - not literal translation
- Maintain technical terms in English where commonly used in Hebrew tech discourse (e.g., API, token, prompt, Claude, model, fine-tuning)
- Keep brand names in English (Anthropic, Claude, Sonnet, Opus, Haiku)
- Also provide a concise 2-3 sentence Hebrew summary

Title: ${title}

Body:
${body}

Respond in JSON format only:
{
  "titleHe": "Hebrew translated title",
  "summaryHe": "2-3 sentence Hebrew summary",
  "bodyHe": "Full Hebrew translation of the body"
}`,
      },
    ],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text : "";

  // Extract JSON from response (handle potential markdown code blocks)
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to parse translation response");
  }

  return JSON.parse(jsonMatch[0]) as ArticleTranslation;
}

export async function translateRedditPost(
  title: string,
  selfText: string
): Promise<RedditTranslation> {
  const message = await client.messages.create({
    model: "claude-sonnet-4-6-20250514",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `Translate this Reddit post to Hebrew. Keep technical terms and brand names in English.

Title: ${title}
${selfText ? `\nContent:\n${selfText.slice(0, 2000)}` : ""}

Respond in JSON format only:
{
  "titleHe": "Hebrew translated title",
  "summaryHe": "1-2 sentence Hebrew summary of the post"
}`,
      },
    ],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text : "";

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to parse Reddit translation response");
  }

  return JSON.parse(jsonMatch[0]) as RedditTranslation;
}
