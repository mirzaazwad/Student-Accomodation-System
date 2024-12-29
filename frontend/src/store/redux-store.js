import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { authReducer } from "../context/auth.slice";
import { modalReducer } from "../context/modal.slice";
import { reviewReducer } from "./slices/review-slice";
import { filterReducer } from "./slices/filter-slice";

const appReducer = combineReducers({
  auth: authReducer,
  modal: modalReducer,
  review: reviewReducer,
  filter: filterReducer,
});

export const appStore = configureStore({
  reducer: appReducer,
});
