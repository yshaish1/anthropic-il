import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatHebrewDate(date: Date): string {
  return new Intl.DateTimeFormat("he-IL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function timeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "עכשיו";
  if (diffMins < 60) return `לפני ${diffMins} דקות`;
  if (diffHours < 24) return `לפני ${diffHours} שעות`;
  if (diffDays < 7) return `לפני ${diffDays} ימים`;
  return formatHebrewDate(date);
}
