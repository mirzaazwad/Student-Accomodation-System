import { createSlice } from "@reduxjs/toolkit";

const initialmodalState = {
  open: false,
  data: {},
  selectedModal: "",
};

export const modalTypes = {
  REVIEW: "REVIEW",
  FILTER: "FILTER",
};

export const modalSlice = createSlice({
  name: "modal",
  initialState: initialmodalState,
  reducers: {
    setModalData: (state, action) => {
      state.data = action.payload;
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
