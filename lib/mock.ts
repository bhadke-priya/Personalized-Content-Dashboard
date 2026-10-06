import { ContentItem, ContentType } from "./types";

const img = (seed: string) => `https://picsum.photos/seed/${seed}/600/340`;
const CTA: Record<ContentType, string> = { news: "Read More", movie: "Play Now", social: "View Post" };

/** Deterministic mock generator so pagination and search behave consistently. */
export function mockItems(type: ContentType, categories: string[], page: number, q = "", size = 6): ContentItem[] {
  const cats = categories.length ? categories : ["technology"];
  const out: ContentItem[] = [];
  for (let i = 0; i < size; i++) {
    const n = (page - 1) * size + i;
    const category = cats[n % cats.length];
    const label = { news: "Headline", movie: "Recommended title", social: "#" + category + " post" }[type];
    out.push({
      id: `mock-${type}-${category}-${n}`,
      type,
      title: `${label} #${n + 1}: ${category}`,
      description: `Sample ${type} content about ${category}. Add API keys in .env.local for live data.`,
      image: img(`${type}${category}${n}`),
      url: "https://example.com",
      category,
      cta: CTA[type],
    });
  }
  const s = q.trim().toLowerCase();
  return s ? out.filter((x) => (x.title + x.description).toLowerCase().includes(s)) : out;
}
export { CTA };
