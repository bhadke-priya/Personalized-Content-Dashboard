export type ContentType = "news" | "movie" | "social";
export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  description: string;
  image: string;
  url: string;
  category: string;
  cta: string; // "Read More" | "Play Now" | "View Post"
}
export const CATEGORIES = ["technology", "sports", "business", "entertainment", "health", "science"] as const;
