import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
    },
    logout: (state, action) => {
      state.user = null;
      state.token = null;
    }
  }
});

export const authActions = authSlice.actions;
export const authSelector = (state) => state.auth;

export default authSlice.reducer;
