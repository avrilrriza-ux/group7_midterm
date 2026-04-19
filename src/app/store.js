import { configureStore } from "@reduxjs/toolkit";
import { animalsApi } from "../api/animalsApi";
import favoritesReducer from "./favoritesSlice";

export const store = configureStore({
  reducer: {
    [animalsApi.reducerPath]: animalsApi.reducer,
    favorites: favoritesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(animalsApi.middleware),
});