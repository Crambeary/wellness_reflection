import { configureStore } from '@reduxjs/toolkit';
import wellnessReducer from './wellnessSlice';
import { formPersistenceMiddleware } from './formPersistenceMiddleware';

export const store = configureStore({
  reducer: {
    wellness: wellnessReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(formPersistenceMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
