import { Timestamp } from "firebase/firestore";

export interface Article {
  id: string;
  slug: string;
  originalUrl: string;
  titleEn: string;
  titleHe: string;
  summaryHe: string;
  bodyHe: string;
  bodyEn: string;
  category: string;
  imageUrl: string | null;
  publishedAt: Timestamp;
  fetchedAt: Timestamp;
  translatedAt: Timestamp;
}

export interface RedditPost {
  id: string;
  subreddit: string;
  titleEn: string;
  titleHe: string;
  summaryHe: string;
  selfTextEn: string;
  url: string;
  externalUrl: string | null;
  score: number;
  numComments: number;
  author: string;
  createdUtc: number;
  fetchedAt: Timestamp;
  curated: boolean;
  pinned: boolean;
}

export interface Tip {
  id: string;
  titleHe: string;
  contentHe: string;
  category: "prompting" | "api" | "claude-code" | "general";
  difficulty: "beginner" | "intermediate" | "advanced";
  order: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  published: boolean;
}

export interface ReleaseNote {
  id: string;
  titleEn: string;
  titleHe: string;
  summaryHe: string;
  bodyHe: string;
  type: "model" | "api" | "pricing" | "feature";
  sourceUrl: string;
  version: string | null;
  publishedAt: Timestamp;
  fetchedAt: Timestamp;
}

export interface FetchLog {
  id: string;
  type: "news" | "reddit" | "releases";
  trigger: "cron" | "manual";
  triggeredBy: string | null;
  startedAt: Timestamp;
  completedAt: Timestamp;
  newItems: number;
  errors: string[];
  status: "success" | "partial" | "failed";
}

export interface AdminRecord {
  uid: string;
  email: string;
  addedAt: Timestamp;
}
