"use client";
import { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "@/store";
import { hydrate } from "@/store/preferencesSlice";

const KEY = "dashboard-preferences";

export default function Providers({ children }: { children: React.ReactNode }) {
  const ref = useRef<AppStore>();
  if (!ref.current) ref.current = makeStore();
  const store = ref.current;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) store.dispatch(hydrate(JSON.parse(saved)));
    } catch { /* corrupted storage: fall back to defaults */ }
    return store.subscribe(() => {
      const { categories, darkMode, favorites, order } = store.getState().preferences;
      document.documentElement.classList.toggle("dark", darkMode);
      try { localStorage.setItem(KEY, JSON.stringify({ categories, darkMode, favorites, order })); } catch {}
    });
  }, [store]);

  return <Provider store={store}>{children}</Provider>;
}
