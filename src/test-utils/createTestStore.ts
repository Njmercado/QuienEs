import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from '../store/apiSlice'

/**
 * Creates a fresh Redux store per test with the RTK Query api slice.
 * Use this instead of the app store to avoid cross-test cache pollution.
 */
export function createTestStore() {
  return configureStore({
    reducer: {
      [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }).concat(apiSlice.middleware),
  })
}

export type TestStore = ReturnType<typeof createTestStore>
