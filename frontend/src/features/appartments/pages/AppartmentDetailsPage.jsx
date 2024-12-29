import MapSearch from "../../../components/Map";
import { useAppartmentDetails } from "../hooks/useAppartmentDetails";
import LoadingComponent from "../../../components/LoadingComponent";
import { useParams } from "react-router-dom";
import ReviewCard from "../components/ReviewCard";
import AddReviewButton from "../../../components/input/AddReviewButton";
import { openModal } from "../../../utils/ModalHelper";
import { modalActions, modalTypes } from "../../../context/modal.slice";
import { useDispatch } from "react-redux";

const AppartmentDetailsPage = () => {
  const id = useParams().id;
  const { error, loading, appartment, selectedAddress, reviews } =
    useAppartmentDetails(id);
  const dispatch = useDispatch();

  if (loading) {
    return <LoadingComponent />;
  }
  if (error) {
    return (
      <div className="w-full lg:mx-4 my-6 p-4 bg-white justify-center items-center flex flex-col">
        <div className="font-semibold w-full m-4 p-4 bg-red-200 text-red-800 border border-red-800 text-center">
          {error}
        </div>
      </div>
    );
  }
  return (
    <div className="w-full lg:mx-4 my-6 p-4 bg-white justify-center items-center flex flex-col">
      <div className="w-full flex flex-col lg:flex-row">
        <div className="w-full lg:mx-4 lg:h-[350px] md:w-3/4 lg:w-1/2 flex flex-col gap-4 rounded-lg shadow-md my-4">
          <h1 className="text-2xl font-bold mx-4 px-4 py-2">
            Landlord Details
          </h1>
          <div className="w-full mx-4 lg:h-[350px] md:w-3/4 lg:w-1/2 flex md:flex-row flex-col items-center gap-4">
            <div className="w-1/2 flex flex-col items-center justify-center">
              <img
                src={
                  appartment.landlord?.profilePicture ?? "/profile-picture.png"
                }
                alt="avatar"
                className="w-[200px] h-[200px] rounded-full"
              />
            </div>
            <div className="w-1/2 flex flex-col items-start justify-start">
              <h1 className="text-2xl font-semibold">
                {appartment.landlord?.username}
              </h1>
              <h2 className="text-lg font-semibold">
                {appartment.landlord?.email}
              </h2>
            </div>
          </div>
        </div>
        {selectedAddress && (
          <div className="w-full lg:mx-4 lg:h-[350px] md:w-3/4 lg:w-1/2 px-4 py-2 bg-white rounded-lg shadow-md my-4">
            <h1 className="text-2xl font-semibold">Apartment Location</h1>
            <div className="w-full flex flex-col">
              <MapSearch
                onAddressSelect={(value) => {
                  console.log(value);
                }}
                currentPosition={selectedAddress.position}
                zoom={13}
              />
              <div className="w-full flex flex-col items-start justify-start">
                <h1 className="text-md font-semibold">
                  Address: {selectedAddress.address}
                </h1>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="w-full flex flex-col lg:flex-row my-4">
        <div className="w-full lg:mx-4 lg:h-[350px] md:w-3/4 lg:w-1/2 px-4 py-2 bg-white rounded-lg shadow-md my-4">
          <h1 className="text-2xl font-bold mx-4 px-4 py-2">
            Appartment Details
          </h1>
          <h1 className="text-xl font-semibold">{appartment.title}</h1>
          <p className="text-gray-600">{appartment.description}</p>
          <p className="text-gray-600">Rent: {appartment.rent} BDT</p>
          <p className="text-gray-600">Room Type: {appartment.roomType}</p>
          <p className="text-gray-600">
            Amenities:{" "}
            {appartment.amenities.length > 0
              ? appartment.amenities.join(", ")
              : "None"}
          </p>
          <p
            className={`text-white ${
              appartment?.availabilityStatus === "Available"
                ? "bg-green-600"
                : "bg-blue-600"
            } px-4 py-1 rounded-lg my-4`}
          >
            {appartment?.availabilityStatus}
          </p>
        </div>
        <div className="w-full lg:mx-4 lg:h-[350px] md:w-3/4 lg:w-1/2 px-4 py-2 bg-white flex flex-row justify-center items-center gap-4 overflow-x-scroll rounded-lg shadow-md my-4">
          {appartment.images && (
            <img
              src={`${import.meta.env.VITE_APP_API_URL}/${
                appartment.images[0]
              }`}
              alt="appartment"
              className="w-fit h-48 object-cover rounded-lg"
            />
          )}
        </div>
      </div>
      <div className="w-full lg:mx-4 px-4 py-2 bg-white rounded-lg shadow-md my-4 flex flex-col justify-start items-start">
        <div className="w-full flex flex-row justify-between px-4">
          <h1 className="text-2xl font-semibold my-4">Reviews</h1>
          <AddReviewButton
            onClick={() => {
              dispatch(
                modalActions.setModalData({
                  id: id,
                })
              );
              openModal(modalTypes.REVIEW);
            }}
          />
        </div>
        <div className="w-full flex flex-col justify-center items-center">
          <div className="w-full m-4 shadow-md rounded-lg">
            {reviews &&
              reviews.map((review, index) => (
                <ReviewCard
                  key={index}
                  name={review.student.username}
                  comment={review.comment}
                  rating={review.rating}
                  createdAt={new Date(review.createdAt)}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppartmentDetailsPage;
