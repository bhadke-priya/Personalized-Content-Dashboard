"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { CATEGORIES } from "@/lib/types";
import { useDebounce } from "@/hooks/useDebounce";
import { Section, setSection, setSettingsOpen, toggleCategory, toggleDark } from "@/store/preferencesSlice";
import type { AppDispatch, RootState } from "@/store";
import Feed from "./Feed";

const NAV: { id: Section; label: string }[] = [
  { id: "feed", label: "Personalized Feed" }, { id: "trending", label: "Trending" }, { id: "favorites", label: "Favorites" },
];

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { section, categories, darkMode, settingsOpen, favorites } = useSelector((s: RootState) => s.preferences);
  const [search, setSearch] = useState("");
  const q = useDebounce(search, 400);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur dark:border-slate-700 dark:bg-slate-800/90">
        <h1 className="text-lg font-bold">Content Dashboard</h1>
        <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search news, movies, posts…"
               aria-label="Search content"
               className="mx-auto w-full max-w-md rounded-lg border border-slate-300 bg-white px-3 py-1.5 dark:border-slate-600 dark:bg-slate-700" />
        <button onClick={() => dispatch(toggleDark())} aria-label="Toggle dark mode" className="rounded-md px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-700">
          {darkMode ? "☀️" : "🌙"}
        </button>
        <button onClick={() => dispatch(setSettingsOpen(!settingsOpen))} aria-expanded={settingsOpen} className="rounded-md px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-700">
          ⚙️ Settings
        </button>
        <div className="hidden h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white sm:flex" title="Account">U</div>
      </header>

      <div className="mx-auto flex max-w-6xl flex-col gap-6 p-4 md:flex-row">
        <nav aria-label="Sections" className="flex gap-2 md:w-52 md:flex-col">
          {NAV.map((n) => (
            <button key={n.id} onClick={() => dispatch(setSection(n.id))} aria-current={section === n.id}
                    className={`rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                      section === n.id ? "bg-indigo-600 text-white" : "hover:bg-slate-200 dark:hover:bg-slate-700"}`}>
              {n.label}{n.id === "favorites" && ` (${Object.keys(favorites).length})`}
            </button>
          ))}
        </nav>

        <main className="min-w-0 flex-1">
          <AnimatePresence>
            {settingsOpen && (
              <motion.section initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                              className="mb-4 overflow-hidden rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800" aria-label="Preferences">
                <h2 className="mb-2 font-semibold">Favorite categories</h2>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((c) => (
                    <label key={c} className={`cursor-pointer rounded-full border px-3 py-1 text-sm capitalize ${
                      categories.includes(c) ? "border-indigo-600 bg-indigo-600 text-white" : "border-slate-300 dark:border-slate-600"}`}>
                      <input type="checkbox" className="sr-only" checked={categories.includes(c)} onChange={() => dispatch(toggleCategory(c))} />
                      {c}
                    </label>
                  ))}
                </div>
              </motion.section>
            )}
          </AnimatePresence>
          <motion.div key={section} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="mb-3 text-xl font-semibold">{NAV.find((n) => n.id === section)?.label}</h2>
            <Feed query={q} />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
