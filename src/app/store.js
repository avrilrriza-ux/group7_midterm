import { configureStore } from "@reduxjs/toolkit";
import { animalsApi } from "../api/animalsApi";

export const store = configureStore({
  reducer: {
    [animalsApi.reducerPath]: animalsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(animalsApi.middleware),
});