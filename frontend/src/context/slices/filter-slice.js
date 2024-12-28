import { createSlice } from "@reduxjs/toolkit";

const initialReviewState = {
  roomType: undefined,
  location: undefined,
  minPrice: 0,
  maxPrice: 200000,
  set: false,
  runQuery: true,
};

export const filterSlice = createSlice({
  name: "filter",
  initialState: initialReviewState,
  reducers: {
    setRoomType: (state, action) => {
      state.roomType = action.payload;
    },
    setLocation: (state, action) => {
      state.location = action.payload;
    },
    setMinPrice: (state, action) => {
      state.minPrice = action.payload;
    },
    setMaxPrice: (state, action) => {
      state.maxPrice = action.payload;
    },
    clear: (state) => {
      state.roomType = "any";
      state.location = undefined;
      state.minPrice = 0;
      state.maxPrice = 200000;
      state.set = false;
    },
    setFilter: (state) => {
      state.set = true;
      state.runQuery = true;
    },
    queryRun: (state) => {
      state.runQuery = false;
    },
    setQueryRun: (state) => {
      state.runQuery = true;
    },
  },
});

export const filterActions = filterSlice.actions;
export const filterReducer = filterSlice.reducer;
