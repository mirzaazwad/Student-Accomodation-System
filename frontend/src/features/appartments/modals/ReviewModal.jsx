import { Rating } from "react-simple-star-rating";
import PopupModal from "../../../components/PopupModal";
import PrimaryButton from "../../../components/input/PrimaryButton";
import { useState } from "react";

const ReviewModal = () => {
  const [value, setValue] = useState(0);
  return (
    <PopupModal title={"Review"}>
      <div className="w-full h-full">
        <div className="w-full p-4">
          <Rating
            initialValue={value}
            onClick={(e) => setValue(e.target.value)}
            showTooltip
          />
        </div>
        <div className="w-full p-4">
          <textarea
            className="w-full h-32 p-4 bg-gray-100 border-2 border-gray-300 rounded-lg focus:outline-none focus:bg-white focus:border-primary"
            placeholder="Write your review here..."
          ></textarea>
        </div>
        <PrimaryButton label="Submit" className="w-full">
          ADD REVIEW
        </PrimaryButton>
      </div>
    </PopupModal>
  );
};

export default ReviewModal;
