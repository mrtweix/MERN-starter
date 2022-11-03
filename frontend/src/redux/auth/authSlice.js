import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: null,
  refreshToken: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentils: (state, action) => {
      const { user, accessToken } = action.payload;
      state.user = user;
      state.token = accessToken;
    },
    logout: (state, action) => {
      state.user = null;
      state.token = null;
    }
  }
});

export const authActions = authSlice.actions;
export const authSelector = state => state.auth;

export default authSlice.reducer;
