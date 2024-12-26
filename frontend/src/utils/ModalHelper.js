import { appStore } from "../context/redux-store.js";
import { modalActions } from "../context/slices/modal.slice.js";

export const closeModal = () => {
  appStore.dispatch(modalActions.closeModal());
  appStore.dispatch(modalActions.setSelectedModal(""));
};

export const openModal = (selectedType) => {
  appStore.dispatch(modalActions.setSelectedModal(selectedType));
  appStore.dispatch(modalActions.openModal());
};
