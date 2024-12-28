import { Rating } from "react-simple-star-rating";

const ReviewCard = ({ name, comment, rating, createdAt }) => {
  return (
    <div className="w-full flex flex-col justify-start items-start mx-4 my-4">
      <div className="w-full text-xl font-semibold p-4 bg-primary text-white w-full rounded-t-lg flex flex-row justify-between">
        <h1>{name}</h1>
        <p className="text-sm">
          {createdAt.toDateString() + " at " + createdAt.toLocaleTimeString()}
        </p>
      </div>
      <p className="text-gray-600 p-4">{comment}</p>
      <div className="w-full flex flex-row justify-end items-end p-4 bg-gray-200 rounded-b-lg">
        <Rating initialValue={rating} showTooltip readonly />
      </div>
    </div>
  );
};

export default ReviewCard;
