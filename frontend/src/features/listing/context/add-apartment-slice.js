import { createSlice } from "@reduxjs/toolkit";

const initialAddApartmentState = {
  roomType: undefined,
  location: undefined,
  minPrice: 0,
  maxPrice: 200000,
  set: false,
  runQuery: true,
};

export const addApartmentSlice = createSlice({
  name: "addApartment",
  initialState: initialAddApartmentState,
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

export const addApartmentActions = addApartmentSlice.actions;
export const addApartmentReducer = addApartmentSlice.reducer;
