"use client";
import { motion } from "framer-motion";
import { ContentItem } from "@/lib/types";

interface Props { item: ContentItem; favorite: boolean; onFavorite: (i: ContentItem) => void }

export default function ContentCard({ item, favorite, onFavorite }: Props) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} whileHover={{ scale: 1.01 }}
      className="flex gap-4 rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-800"
      data-testid="content-card"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={item.image} alt="" loading="lazy" className="h-28 w-40 shrink-0 rounded-lg object-cover" />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
          {item.type} · {item.category}
        </span>
        <h3 className="line-clamp-2 font-semibold">{item.title}</h3>
        <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{item.description}</p>
        <div className="mt-auto flex items-center gap-2 pt-2">
          <a href={item.url} target="_blank" rel="noopener noreferrer"
             className="rounded-md bg-indigo-600 px-3 py-1 text-sm text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400">
            {item.cta}
          </a>
          <button onClick={() => onFavorite(item)} aria-pressed={favorite}
                  aria-label={favorite ? `Remove ${item.title} from favorites` : `Add ${item.title} to favorites`}
                  className="rounded-md px-2 py-1 text-xl hover:bg-slate-100 dark:hover:bg-slate-700">
            {favorite ? "★" : "☆"}
          </button>
        </div>
      </div>
    </motion.article>
  );
}
