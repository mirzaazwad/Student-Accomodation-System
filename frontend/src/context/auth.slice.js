import { createSlice } from "@reduxjs/toolkit";

const getRefreshToken = () => {
  if (localStorage.getItem("refresh") !== null) {
    return localStorage.getItem("refresh");
  }
  return "";
};

const getAccessToken = () => {
  if (localStorage.getItem("access") !== null) {
    return localStorage.getItem("access");
  }
  return "";
};

const initialAuthState = {
  auth: false,
  refresh: getRefreshToken(),
  access: getAccessToken(),
  user: {},
};

export const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    setAuthStatus: (state, action) => {
      state.auth = action.payload;
    },
    setRefreshToken: (state, action) => {
      state.refresh = action.payload;
      localStorage.setItem("refresh", action.payload);
    },
    setAccessToken: (state, action) => {
      state.access = action.payload;
      localStorage.setItem("access", action.payload);
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setVerificationEmail: (state, action) => {
      state.verificationEmail = action.payload;
    },
    logout: (state) => {
      state.auth = false;
      state.refresh = "";
      state.access = "";
      localStorage.clear();
    },
  },
});

export const authActions = authSlice.actions;
export const authReducer = authSlice.reducer;
