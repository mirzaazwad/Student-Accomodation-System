import { Rating } from "react-simple-star-rating";

const ReviewCard = ({ name, comment, rating, createdAt }) => {
  return (
    <div className="w-full flex flex-col justify-start items-start">
      <div className="w-full text-xl font-semibold bg-primary text-white rounded-t-lg flex lg:flex-row flex-col lg:justify-between justify-center">
        <h1 className="p-4">{name}</h1>
        <div className="text-sm lg:p-4 lg:m-4">
          {createdAt.toDateString() + " at " + createdAt.toLocaleTimeString()}
        </div>
      </div>
      <p className="text-gray-600 p-4">{comment}</p>
      <div className="w-full flex flex-row justify-end items-end p-4 bg-gray-200 rounded-b-lg">
        <Rating initialValue={rating} showTooltip readonly />
      </div>
    </div>
  );
};

export default ReviewCard;
