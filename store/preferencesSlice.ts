import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ContentItem } from "@/lib/types";

export type Section = "feed" | "trending" | "favorites";
export interface PreferencesState {
  categories: string[];
  darkMode: boolean;
  favorites: Record<string, ContentItem>;
  order: string[]; // user-defined card order (ids)
  section: Section;
  settingsOpen: boolean;
}
export const initialState: PreferencesState = {
  categories: ["technology", "sports", "business"],
  darkMode: false,
  favorites: {},
  order: [],
  section: "feed",
  settingsOpen: false,
};

const slice = createSlice({
  name: "preferences",
  initialState,
  reducers: {
    hydrate: (s, a: PayloadAction<Partial<PreferencesState>>) => ({ ...s, ...a.payload, settingsOpen: false }),
    toggleCategory: (s, a: PayloadAction<string>) => {
      s.categories = s.categories.includes(a.payload)
        ? s.categories.filter((c) => c !== a.payload)
        : [...s.categories, a.payload];
    },
    toggleDark: (s) => { s.darkMode = !s.darkMode; },
    toggleFavorite: (s, a: PayloadAction<ContentItem>) => {
      if (s.favorites[a.payload.id]) delete s.favorites[a.payload.id];
      else s.favorites[a.payload.id] = a.payload;
    },
    setOrder: (s, a: PayloadAction<string[]>) => { s.order = a.payload; },
    setSection: (s, a: PayloadAction<Section>) => { s.section = a.payload; },
    setSettingsOpen: (s, a: PayloadAction<boolean>) => { s.settingsOpen = a.payload; },
  },
});
export const { hydrate, toggleCategory, toggleDark, toggleFavorite, setOrder, setSection, setSettingsOpen } = slice.actions;
export default slice.reducer;
