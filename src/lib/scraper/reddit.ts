export interface RedditPostRaw {
  id: string;
  subreddit: string;
  title: string;
  selftext: string;
  url: string;
  permalink: string;
  score: number;
  numComments: number;
  author: string;
  createdUtc: number;
  isLink: boolean;
}

const USER_AGENT = "AnthropicIL/1.0 (Hebrew Anthropic news aggregator)";

export async function fetchSubredditPosts(
  subreddit: string,
  limit: number = 25,
  sort: "hot" | "new" | "top" = "hot"
): Promise<RedditPostRaw[]> {
  const url = `https://www.reddit.com/r/${subreddit}/${sort}.json?limit=${limit}`;

  const res = await fetch(url, {
    headers: { "User-Agent": USER_AGENT },
  });

  if (!res.ok) {
    throw new Error(
      `Failed to fetch r/${subreddit}: ${res.status} ${res.statusText}`
    );
  }

  const data = await res.json();
  const posts: RedditPostRaw[] = [];

  for (const child of data.data.children) {
    const d = child.data;
    if (d.stickied) continue; // skip pinned mod posts

    posts.push({
      id: d.id,
      subreddit: d.subreddit,
      title: d.title,
      selftext: d.selftext || "",
      url: d.url,
      permalink: `https://www.reddit.com${d.permalink}`,
      score: d.score,
      numComments: d.num_comments,
      author: d.author,
      createdUtc: d.created_utc,
      isLink: !d.is_self,
    });
  }

  return posts;
}

export async function fetchMultipleSubreddits(
  subreddits: string[],
  limit: number = 25,
  minScore: number = 10
): Promise<RedditPostRaw[]> {
  const allPosts: RedditPostRaw[] = [];

  for (const sub of subreddits) {
    try {
      const posts = await fetchSubredditPosts(sub, limit);
      allPosts.push(...posts.filter((p) => p.score >= minScore));
    } catch (err) {
      console.error(`Error fetching r/${sub}:`, err);
    }
  }

  // Sort by score descending
  return allPosts.sort((a, b) => b.score - a.score);
}
