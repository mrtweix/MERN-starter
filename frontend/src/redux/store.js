import { configureStore } from '@reduxjs/toolkit';
import authApi, { apiSlice } from './auth/authApi';
import authSlice from './auth/authSlice';

const store = configureStore({
  reducer: {
    [authApi.reducerPath]: apiSlice.reducer,
    auth: authSlice
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(authApi.middleware),
  devTools: true
});

export default store;
