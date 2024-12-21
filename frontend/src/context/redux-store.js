import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./slices/auth.slice";

const appReducer = combineReducers({
  auth: authReducer,
});

export const appStore = configureStore({
  reducer: appReducer,
});
