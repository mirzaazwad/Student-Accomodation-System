import { useState } from "react";

const ReviewSection = ({ reviews = [], onAddReview, onDeleteReview }) => {
  const [newReview, setNewReview] = useState("");

  const handleAddReview = () => {
    if (!newReview.trim()) return; // Prevent adding empty reviews
    onAddReview(newReview);
    setNewReview("");
  };

  return (
    <div className="w-full mt-6">
      <h2 className="text-xl font-semibold mb-4">Reviews</h2>

      {/* Reviews List */}
      <div className="flex flex-col gap-4">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div
              key={review.id}
              className="flex justify-between items-center p-4 bg-gray-100 rounded shadow"
            >
              <p className="text-gray-700">{review.text}</p>
              <button
                onClick={() => onDeleteReview(review.id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No reviews available</p>
        )}
      </div>

      {/* Add New Review */}
      <div className="mt-6">
        <textarea
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
          placeholder="Write a review..."
          className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
        <button
          onClick={handleAddReview}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Add Review
        </button>
      </div>
    </div>
  );
};

export default ReviewSection;
