import { createSlice } from "@reduxjs/toolkit";

const initialReviewState = {
  reviews: [],
};

export const reviewSlice = createSlice({
  name: "review",
  initialState: initialReviewState,
  reducers: {
    setReviews: (state, action) => {
      state.reviews = action.payload;
    },
    addReview: (state, action) => {
      state.reviews.push(action.payload);
    },
    removeReview: (state, action) => {
      state.reviews = state.reviews.filter(
        (review) => review._id !== action.payload
      );
    },
  },
});

export const reviewActions = reviewSlice.actions;
export const reviewReducer = reviewSlice.reducer;
