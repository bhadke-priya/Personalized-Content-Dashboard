import { NextRequest, NextResponse } from "next/server";
import { mockItems, CTA } from "@/lib/mock";
import { ContentItem } from "@/lib/types";

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams;
  const cats = (p.get("categories") ?? "").split(",").filter(Boolean);
  const page = Number(p.get("page") ?? 1);
  const q = p.get("q") ?? "";
  const key = process.env.NEWS_API_KEY; // server-side only, never exposed to the browser
  if (!key) return NextResponse.json(mockItems("news", cats, page, q));
  try {
    const category = cats[0] ?? "general";
    const url = q
      ? `https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&pageSize=6&page=${page}`
      : `https://newsapi.org/v2/top-headlines?category=${category}&language=en&pageSize=6&page=${page}`;
    const r = await fetch(url, { headers: { "X-Api-Key": key }, next: { revalidate: 300 } });
    if (!r.ok) throw new Error(String(r.status));
    const data = await r.json();
    const items: ContentItem[] = (data.articles ?? []).map((a: any, i: number) => ({
      id: `news-${page}-${i}-${a.url}`, type: "news", title: a.title ?? "Untitled",
      description: a.description ?? "", image: a.urlToImage ?? "https://picsum.photos/600/340",
      url: a.url, category, cta: CTA.news,
    }));
    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: "News API failed" }, { status: 502 });
  }
}
