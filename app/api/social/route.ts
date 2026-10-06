import { NextRequest, NextResponse } from "next/server";
import { mockItems } from "@/lib/mock";

// Mock social API (allowed by the assignment): posts are generated per hashtag/category.
export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams;
  const cats = (p.get("categories") ?? "").split(",").filter(Boolean);
  return NextResponse.json(mockItems("social", cats, Number(p.get("page") ?? 1), p.get("q") ?? "", 4));
}
