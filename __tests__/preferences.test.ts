import reducer, { initialState, toggleCategory, toggleFavorite, setOrder, hydrate } from "@/store/preferencesSlice";
import { interleave } from "@/store/api";
import { applyOrder } from "@/components/Feed";
import { mockItems } from "@/lib/mock";

const item = mockItems("news", ["sports"], 1)[0];

describe("preferences slice", () => {
  it("toggles categories on and off", () => {
    const on = reducer(initialState, toggleCategory("health"));
    expect(on.categories).toContain("health");
    expect(reducer(on, toggleCategory("health")).categories).not.toContain("health");
  });
  it("adds and removes favorites", () => {
    const a = reducer(initialState, toggleFavorite(item));
    expect(a.favorites[item.id]).toBeDefined();
    expect(reducer(a, toggleFavorite(item)).favorites[item.id]).toBeUndefined();
  });
  it("hydrates saved state but always closes settings", () => {
    expect(reducer(initialState, hydrate({ darkMode: true, settingsOpen: true })).settingsOpen).toBe(false);
  });
  it("stores card order", () => {
    expect(reducer(initialState, setOrder(["b", "a"])).order).toEqual(["b", "a"]);
  });
});

describe("helpers", () => {
  it("interleaves sources and tolerates empty lists", () => {
    const n = mockItems("news", ["sports"], 1, "", 2), m = mockItems("movie", ["sports"], 1, "", 2);
    expect(interleave([n, [], m]).map((i) => i.type)).toEqual(["news", "movie", "news", "movie"]);
    expect(interleave([])).toEqual([]);
  });
  it("applies saved order, unknown ids last", () => {
    const items = mockItems("news", ["sports"], 1, "", 3);
    expect(applyOrder(items, [items[2].id])[0].id).toBe(items[2].id);
  });
  it("search returns empty list for no match (empty state)", () => {
    expect(mockItems("news", ["sports"], 1, "zzzz-nothing")).toEqual([]);
  });
});
