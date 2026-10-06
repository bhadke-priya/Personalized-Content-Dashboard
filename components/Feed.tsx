"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd";
import { useDispatch, useSelector } from "react-redux";
import { useGetFeedQuery } from "@/store/api";
import { setOrder, toggleFavorite } from "@/store/preferencesSlice";
import type { AppDispatch, RootState } from "@/store";
import { ContentItem } from "@/lib/types";
import ContentCard from "./ContentCard";

export function applyOrder(items: ContentItem[], order: string[]): ContentItem[] {
  const idx = new Map(order.map((id, i) => [id, i]));
  return [...items].sort((a, b) => (idx.get(a.id) ?? 1e9) - (idx.get(b.id) ?? 1e9));
}

export default function Feed({ query }: { query: string }) {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, favorites, order, section } = useSelector((s: RootState) => s.preferences);
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<ContentItem[]>([]);
  const trending = section === "trending";
  const cacheKey = `${categories.join(",")}|${query}|${trending}`;

  // reset pagination whenever the query inputs change
  useEffect(() => { setPage(1); setItems([]); }, [cacheKey]);

  const { data, isFetching, error, refetch } = useGetFeedQuery({ categories, page, q: query, trending },
    { skip: section === "favorites" });

  useEffect(() => {
    if (!data) return;
    setItems((prev) => {
      const seen = new Set(prev.map((i) => i.id));
      return [...prev, ...data.filter((i) => !seen.has(i.id))];
    });
  }, [data]);

  // infinite scroll sentinel
  const sentinel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinel.current;
    if (!el || section === "favorites") return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting && !isFetching && !error) setPage((p) => p + 1); });
    io.observe(el);
    return () => io.disconnect();
  }, [isFetching, error, section]);

  const visible = useMemo(() => {
    const base = section === "favorites"
      ? Object.values(favorites).filter((i) => (i.title + i.description).toLowerCase().includes(query.toLowerCase()))
      : trending ? items.slice(0, 12) : items;
    return applyOrder(base, order);
  }, [items, favorites, order, section, trending, query]);

  const onDragEnd = (r: DropResult) => {
    if (!r.destination) return;
    const ids = visible.map((i) => i.id);
    const [moved] = ids.splice(r.source.index, 1);
    ids.splice(r.destination.index, 0, moved);
    dispatch(setOrder(ids));
  };

  if (error && !items.length && section !== "favorites")
    return (
      <div role="alert" className="rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-950 dark:text-red-300">
        {String(error)} <button onClick={refetch} className="underline">Retry</button>
      </div>
    );

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="feed">
          {(p) => (
            <div ref={p.innerRef} {...p.droppableProps} className="space-y-3" data-testid="feed">
              {visible.map((item, i) => (
                <Draggable key={item.id} draggableId={item.id} index={i}>
                  {(d) => (
                    <div ref={d.innerRef} {...d.draggableProps} {...d.dragHandleProps}>
                      <ContentCard item={item} favorite={!!favorites[item.id]} onFavorite={(x) => dispatch(toggleFavorite(x))} />
                    </div>
                  )}
                </Draggable>
              ))}
              {p.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {!visible.length && !isFetching && (
        <p className="py-10 text-center text-slate-500">
          {section === "favorites" ? "No favorites yet — tap ☆ on a card." : "No content found. Try other categories or a different search."}
        </p>
      )}
      {isFetching && <div className="mx-auto my-6 h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" role="status" aria-label="Loading" />}
      <div ref={sentinel} className="h-4" />
    </>
  );
}
