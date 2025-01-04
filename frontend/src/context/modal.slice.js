import { createSlice } from "@reduxjs/toolkit";

const initialmodalState = {
  open: false,
  data: {},
  selectedModal: "",
};

export const modalTypes = {
  REVIEW: "REVIEW",
  FILTER: "FILTER",
  ADD_APARTMENT: "ADD_APARTMENT",
  EDIT_APARTMENT: "EDIT_APARTMENT",
  BOOKING: "BOOKING",
  EDIT_BOOKING: "EDIT_BOOKING",
};

export const modalSlice = createSlice({
  name: "modal",
  initialState: initialmodalState,
  reducers: {
    setModalData: (state, action) => {
      state.data = action.payload;
    },
    clearModalData: (state) => {
      state.data = {};
    },
    setSelectedModal: (state, action) => {
      state.selectedModal = action.payload;
    },
    openModal: (state) => {
      state.open = true;
    },
    closeModal: (state) => {
      state.open = false;
    },
  },
});

export const modalActions = modalSlice.actions;
export const modalReducer = modalSlice.reducer;
