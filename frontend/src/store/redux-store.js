import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { authReducer } from "../context/auth.slice";
import { modalReducer } from "../context/modal.slice";
import { reviewReducer } from "../features/appartments/context/review-slice";
import { filterReducer } from "../features/appartments/context/filter-slice";

const appReducer = combineReducers({
  auth: authReducer,
  modal: modalReducer,
  review: reviewReducer,
  filter: filterReducer,
});

export const appStore = configureStore({
  reducer: appReducer,
});
