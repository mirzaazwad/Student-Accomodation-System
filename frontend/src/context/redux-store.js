import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./slices/auth.slice";
import { modalReducer } from "./slices/modal.slice";

const appReducer = combineReducers({
  auth: authReducer,
  modal: modalReducer,
});

export const appStore = configureStore({
  reducer: appReducer,
});
