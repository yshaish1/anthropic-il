import * as cheerio from "cheerio";

export interface ScrapedArticleListItem {
  slug: string;
  title: string;
  date: string;
  category: string;
  imageUrl: string | null;
}

export interface ScrapedArticleContent {
  title: string;
  body: string;
  imageUrl: string | null;
  date: string;
  category: string;
}

const BASE_URL = "https://www.anthropic.com";

export async function fetchArticleList(): Promise<ScrapedArticleListItem[]> {
  const res = await fetch(`${BASE_URL}/news`, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; AnthropicIL/1.0; +https://anthropic-il.vercel.app)",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch news listing: ${res.status}`);
  }

  const html = await res.text();
  const $ = cheerio.load(html);
  const articles: ScrapedArticleListItem[] = [];

  $('a[href^="/news/"]').each((_, el) => {
    const href = $(el).attr("href");
    if (!href || href === "/news" || href === "/news/") return;

    const slug = href.replace("/news/", "").replace(/\/$/, "");
    if (!slug || slug.includes("/")) return;

    const title = $(el).find("h3, h2, h4").first().text().trim() ||
      $(el).text().trim().split("\n")[0]?.trim() || "";
    const date = $(el).find("time").text().trim() ||
      $(el).find('[class*="date"]').text().trim() || "";
    const category = $(el).find('[class*="category"], [class*="tag"], [class*="subject"]').first().text().trim() || "";
    const img = $(el).find("img").first().attr("src") || null;
    const imageUrl = img && img.startsWith("/") ? `${BASE_URL}${img}` : img;

    if (title) {
      articles.push({ slug, title, date, category, imageUrl });
    }
  });

  // Deduplicate by slug
  const seen = new Set<string>();
  return articles.filter((a) => {
    if (seen.has(a.slug)) return false;
    seen.add(a.slug);
    return true;
  });
}

export async function fetchArticleContent(
  slug: string
): Promise<ScrapedArticleContent> {
  const res = await fetch(`${BASE_URL}/news/${slug}`, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; AnthropicIL/1.0; +https://anthropic-il.vercel.app)",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch article ${slug}: ${res.status}`);
  }

  const html = await res.text();
  const $ = cheerio.load(html);

  const title =
    $("article h1").first().text().trim() ||
    $("h1").first().text().trim() ||
    "";

  // Try multiple selectors for article body
  let body = "";
  const bodySelectors = [
    "article .post-text",
    "article .body-2",
    'article [class*="content"]',
    "article p",
    ".post-content",
    'main [class*="body"]',
  ];

  for (const selector of bodySelectors) {
    const elements = $(selector);
    if (elements.length > 0) {
      body = elements
        .map((_, el) => $(el).text().trim())
        .get()
        .filter(Boolean)
        .join("\n\n");
      if (body.length > 100) break;
    }
  }

  // Fallback: get all paragraphs in article or main
  if (body.length < 100) {
    body = $("article p, main p")
      .map((_, el) => $(el).text().trim())
      .get()
      .filter(Boolean)
      .join("\n\n");
  }

  const date =
    $("article time").text().trim() ||
    $('article [class*="date"]').first().text().trim() ||
    "";

  const category =
    $('article [class*="category"], article [class*="subject"]')
      .first()
      .text()
      .trim() || "";

  const imgEl =
    $("article img").first().attr("src") ||
    $('article [class*="hero"] img, article [class*="illustration"] img')
      .first()
      .attr("src") ||
    null;
  const imageUrl =
    imgEl && imgEl.startsWith("/") ? `${BASE_URL}${imgEl}` : imgEl;

  return { title, body, imageUrl, date, category };
}
