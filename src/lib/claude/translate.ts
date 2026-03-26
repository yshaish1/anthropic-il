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
    model: "claude-sonnet-4-20250514",
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
    model: "claude-sonnet-4-20250514",
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

interface ArticleClassification {
  isRelease: boolean;
  type: "model" | "api" | "pricing" | "feature";
  version: string | null;
}

export async function classifyArticle(
  title: string,
  bodyPreview: string
): Promise<ArticleClassification> {
  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 256,
    messages: [
      {
        role: "user",
        content: `Analyze this Anthropic article and determine if it's a product release/update announcement.

Title: ${title}
Preview: ${bodyPreview.slice(0, 500)}

Classification rules:
- "model": Announces a new Claude model or model update (Claude 3.5 Sonnet, Opus, Haiku, etc.)
- "api": Announces API changes, new endpoints, SDK updates, developer tools
- "pricing": Announces pricing changes, new plans, cost updates
- "feature": Announces new product features, capabilities, tools (like Artifacts, Computer Use, etc.)
- If it's NOT a release (e.g. a blog post, policy paper, research, company news) → isRelease: false

Respond in JSON only:
{"isRelease": true/false, "type": "model"|"api"|"pricing"|"feature", "version": "version string or null"}`,
      },
    ],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text : "";
  const jsonMatch = text.match(/\{[\s\S]*?\}/);
  if (!jsonMatch) {
    return { isRelease: false, type: "feature", version: null };
  }

  return JSON.parse(jsonMatch[0]) as ArticleClassification;
}

interface GeneratedTip {
  titleHe: string;
  contentHe: string;
  category: "prompting" | "api" | "claude-code" | "general";
  difficulty: "beginner" | "intermediate" | "advanced";
}

export async function generateTips(
  existingTitles: string[]
): Promise<GeneratedTip[]> {
  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: `Generate 3 practical tips for using Claude AI. Write entirely in Hebrew (except technical terms that are commonly used in English like API, prompt, token, Claude Code, etc.).

Categories (pick a mix):
- "prompting": Tips for writing better prompts
- "api": Tips for using the Anthropic API
- "claude-code": Tips for using Claude Code (CLI tool)
- "general": General tips for getting the most out of Claude

Difficulties (pick a mix):
- "beginner": For new users
- "intermediate": For regular users
- "advanced": For power users/developers

${existingTitles.length > 0 ? `Avoid these existing topics:\n${existingTitles.join("\n")}` : ""}

Respond in JSON array only:
[
  {
    "titleHe": "כותרת בעברית",
    "contentHe": "תוכן מפורט בעברית - 3-5 משפטים עם דוגמאות פרקטיות",
    "category": "prompting",
    "difficulty": "beginner"
  }
]`,
      },
    ],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text : "";
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error("Failed to parse tips generation response");
  }

  return JSON.parse(jsonMatch[0]) as GeneratedTip[];
}
