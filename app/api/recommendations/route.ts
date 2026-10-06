import { NextRequest, NextResponse } from "next/server";
import { mockItems, CTA } from "@/lib/mock";
import { ContentItem } from "@/lib/types";

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams;
  const cats = (p.get("categories") ?? "").split(",").filter(Boolean);
  const page = Number(p.get("page") ?? 1);
  const q = p.get("q") ?? "";
  const trending = p.get("trending") === "1";
  const key = process.env.TMDB_API_KEY;
  if (!key) return NextResponse.json(mockItems("movie", cats, page, q));
  try {
    const url = q
      ? `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(q)}&page=${page}&api_key=${key}`
      : `https://api.themoviedb.org/3/${trending ? "trending/movie/day" : "movie/popular"}?page=${page}&api_key=${key}`;
    const r = await fetch(url, { next: { revalidate: 600 } });
    if (!r.ok) throw new Error(String(r.status));
    const data = await r.json();
    const items: ContentItem[] = (data.results ?? []).slice(0, 6).map((m: any) => ({
      id: `movie-${m.id}`, type: "movie", title: m.title, description: m.overview ?? "",
      image: m.backdrop_path ? `https://image.tmdb.org/t/p/w500${m.backdrop_path}` : "https://picsum.photos/600/340",
      url: `https://www.themoviedb.org/movie/${m.id}`, category: "entertainment", cta: CTA.movie,
    }));
    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: "Recommendations API failed" }, { status: 502 });
  }
}
