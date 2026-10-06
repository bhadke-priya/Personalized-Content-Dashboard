# Personalized Content Dashboard

Next.js 14 (App Router) · TypeScript · Redux Toolkit + RTK Query · Tailwind CSS · Framer Motion · @hello-pangea/dnd

## Run
```bash
npm install
cp .env.example .env.local   # optional: add NEWS_API_KEY / TMDB_API_KEY
npm run dev                  # http://localhost:3000
npm test                     # unit tests (Jest)
npm run e2e                  # Cypress (start `npm run dev` first)
```
Without API keys the Next.js route handlers return deterministic mock data, so the app works out of the box.

## Features
- Personalized feed merging News (NewsAPI), Recommendations (TMDB) and a mock Social API
- Category settings, dark mode, favorites, card order — persisted to localStorage
- Sidebar sections: Personalized Feed, Trending, Favorites
- Debounced search (400 ms), infinite scroll, drag-and-drop reordering
- Loading spinners, error + retry state, empty states, Framer Motion transitions
- Accessible: labelled controls, `aria-pressed`, keyboard-focusable, visible focus rings

## Architecture
- `app/api/*` — server-side proxies; **API keys stay on the server**, never in the browser bundle
- `store/preferencesSlice.ts` — preferences, favorites, order, UI section
- `store/api.ts` — RTK Query `getFeed`; uses `Promise.allSettled` so one failing source doesn't break the feed
- `components/Providers.tsx` — hydrates/persists state in `useEffect` (avoids SSR hydration mismatch)
- `__tests__/` unit tests, `cypress/e2e/` critical flows (search, favorites, dark mode)

## Not included (optional bonus items)
Authentication, WebSocket/SSE real-time updates, i18n.
