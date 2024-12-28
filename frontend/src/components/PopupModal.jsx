import {
  Dialog,
  DialogBackdrop,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { closeModal } from "../utils/ModalHelper";
import { Fragment } from "react";
import { twMerge } from "tailwind-merge";
import { FiX } from "react-icons/fi";

const PopupModal = (props) => {
  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-scroll overflow-x-scroll"
        onClose={() => {
          if (props.closeCB) {
            props.closeCB();
          }
          closeModal();
        }}
        style={{
          zIndex: 1000,
        }}
      >
        <div className="min-h-screen px-4 text-center">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <DialogBackdrop className="fixed inset-0 bg-indigo-800/30 backdrop-blur-sm" />
          </TransitionChild>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div
              className={twMerge(
                "my-6 inline-block w-1/2 transform rounded-lg bg-slate-100 p-6 text-left align-middle shadow-xl transition-all duration-300",
                props.className
              )}
            >
              <DialogTitle className="mb-0">
                <div className="flex items-center justify-between shadow-b-md">
                  <span className="text-base font-semibold text-primary">
                    {props.title}
                  </span>
                  <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 hover:bg-slate-200 focus:outline-0 "
                    onClick={() => {
                      closeModal();
                    }}
                  >
                    <FiX size="16px" className="text-red-600" />
                  </button>
                </div>
              </DialogTitle>

              <div className="flex w-full flex-col items-stretch">
                {props.children}
              </div>
            </div>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};

export default PopupModal;
