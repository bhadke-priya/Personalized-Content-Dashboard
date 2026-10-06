import { configureStore } from "@reduxjs/toolkit";
import preferences from "./preferencesSlice";
import { api } from "./api";

export const makeStore = () =>
  configureStore({
    reducer: { preferences, [api.reducerPath]: api.reducer },
    middleware: (gdm) => gdm().concat(api.middleware),
  });
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
