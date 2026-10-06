import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { ContentItem } from "@/lib/types";

export interface FeedArgs { categories: string[]; page: number; q: string; trending?: boolean }

async function getJson(path: string, a: FeedArgs): Promise<ContentItem[]> {
  const qs = new URLSearchParams({ categories: a.categories.join(","), page: String(a.page), q: a.q, trending: a.trending ? "1" : "0" });
  const r = await fetch(`/api/${path}?${qs}`);
  if (!r.ok) throw new Error(`${path} failed (${r.status})`);
  return r.json();
}

/** Merge the 3 sources, interleaved. One failing source never breaks the whole feed. */
export function interleave(lists: ContentItem[][]): ContentItem[] {
  const out: ContentItem[] = [];
  const max = Math.max(0, ...lists.map((l) => l.length));
  for (let i = 0; i < max; i++) lists.forEach((l) => l[i] && out.push(l[i]));
  return out;
}

export const api = createApi({
  reducerPath: "api",
  baseQuery: fakeBaseQuery<string>(),
  endpoints: (b) => ({
    getFeed: b.query<ContentItem[], FeedArgs>({
      async queryFn(args) {
        const results = await Promise.allSettled(["news", "recommendations", "social"].map((p) => getJson(p, args)));
        const ok = results.filter((r): r is PromiseFulfilledResult<ContentItem[]> => r.status === "fulfilled");
        if (!ok.length) return { error: "All content sources failed. Please retry." };
        return { data: interleave(ok.map((r) => r.value)) };
      },
    }),
  }),
});
export const { useGetFeedQuery } = api;
