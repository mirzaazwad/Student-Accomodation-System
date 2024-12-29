import { Rating } from "react-simple-star-rating";
import PopupModal from "../../../components/PopupModal";
import PrimaryButton from "../../../components/input/PrimaryButton";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { modalActions } from "../../../context/modal.slice";
import { reviewActions } from "../context/review-slice";
import { axios } from "../../../utils/RequestHandler";

const ReviewModal = () => {
  const [reviewFormData, setReviewFormData] = useState({
    rating: 0,
    review: "",
  });
  const reviews = useSelector((state) => state.review.reviews);
  const id = useSelector((state) => state.modal.data.id);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [error, setError] = useState("");
  const handleChange = (e) => {
    setReviewFormData({ ...reviewFormData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/apartment/${id}/review`, {
        rating: reviewFormData.rating,
        comment: reviewFormData.review,
      });
      dispatch(
        reviewActions.setReviews([
          {
            rating: reviewFormData.rating,
            review: reviewFormData.review,
            student: user,
          },
          ...reviews,
        ])
      );
      dispatch(modalActions.closeModal());
    } catch (error) {
      setError(error.response.data.message || "Failed to add review");
    }
  };

  return (
    <PopupModal title={"Review"}>
      <form className="w-full h-full" onSubmit={handleSubmit}>
        {error && (
          <div className="w-full m-4 p-4 bg-red-200 text-red-800 border border-red-800 text-center">
            {error}
          </div>
        )}
        <div className="w-full p-4">
          <Rating
            initialValue={reviewFormData.value}
            onClick={(e) =>
              handleChange({
                target: { name: "rating", value: e },
              })
            }
            showTooltip
            required
          />
        </div>
        <div className="w-full p-4">
          <textarea
            name="review"
            id="review"
            className="w-full h-32 p-4 bg-gray-100 border-2 border-gray-300 rounded-lg focus:outline-none focus:bg-white focus:border-primary"
            placeholder="Write your review here..."
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <PrimaryButton type="submit" label="Submit" className="w-full">
          ADD REVIEW
        </PrimaryButton>
      </form>
    </PopupModal>
  );
};

export default ReviewModal;
