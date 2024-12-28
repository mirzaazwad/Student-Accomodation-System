import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./slices/auth.slice";
import { modalReducer } from "./slices/modal.slice";
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
