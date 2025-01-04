import MapSearch from "../../../components/Map";
import { useAppartmentDetails } from "../hooks/useAppartmentDetails";
import LoadingComponent from "../../../components/LoadingComponent";
import { useParams } from "react-router-dom";
import ReviewCard from "../components/ReviewCard";
import { openModal } from "../../../utils/ModalHelper";
import { modalActions, modalTypes } from "../../../context/modal.slice";
import { useDispatch } from "react-redux";
import ProfilePicture from "../../../components/input/ProfilePicture";
import IconButton from "../../../components/input/IconButton";
import { FaBook, FaPlus, FaStar } from "react-icons/fa";
import { FiMessageCircle } from "react-icons/fi";

const AppartmentDetailsPage = () => {
  const id = useParams().id;
  const {
    error,
    loading,
    appartment,
    selectedAddress,
    reviews,
    addToFavorites,
    fetchSession,
  } = useAppartmentDetails(id);
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
    <div className="w-full lg:mx-4 my-6 p-4 bg-white justify-end items-end flex flex-col">
      <div className="w-full flex flex-row justify-end mx-4 my-2">
        <IconButton
          label="Add to Favorites"
          className="my-2 me-2"
          iconClassName={appartment.isFavorite ? "text-yellow-200" : ""}
          onClick={addToFavorites}
        >
          <FaStar />
        </IconButton>
        {!appartment.isBooked &&
          !appartment.isBookedByRoommate &&
          appartment.availabilityStatus === "Available" && (
            <IconButton
              label="Book This Apartment"
              className="my-2"
              onClick={() => {
                dispatch(
                  modalActions.setModalData({
                    id: id,
                  })
                );
                openModal(modalTypes.BOOKING);
              }}
            >
              <FaBook />
            </IconButton>
          )}
        {appartment.isBooked &&
          appartment.availabilityStatus === "Available" && (
            <IconButton
              label="View Booking Details"
              className="my-2"
              onClick={() => {
                dispatch(
                  modalActions.setModalData({
                    id: id,
                  })
                );
                openModal(modalTypes.EDIT_BOOKING);
              }}
            >
              <FaBook />
            </IconButton>
          )}
      </div>
      <div className="w-full flex flex-col lg:flex-row">
        <div className="w-full lg:mx-4 lg:h-[350px] md:w-3/4 lg:w-1/2 flex flex-col gap-4 rounded-lg shadow-md my-4">
          <h1 className="text-2xl font-bold mx-4 px-4 py-2">
            Landlord Details
          </h1>
          <div className="w-full mx-4 lg:h-[350px] md:w-3/4 lg:w-1/2 flex md:flex-row flex-col items-center gap-4">
            <ProfilePicture
              src={appartment.landlord?.profilePicture}
              disabled={true}
              isLandlord
            />
            <div className="w-1/2 flex flex-col items-start justify-start">
              <h1 className="text-2xl font-semibold">
                {appartment.landlord?.username}
              </h1>
              <h2 className="text-lg font-semibold mb-4">
                {appartment.landlord?.email}
              </h2>
              <IconButton
                label="Message"
                onClick={() => fetchSession(appartment.landlord.id)}
              >
                <FiMessageCircle />
              </IconButton>
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
            {appartment.amenities && appartment.amenities.length > 0
              ? appartment.amenities.join(", ")
              : "None"}
          </p>
        </div>
        <div className="w-full lg:mx-4 lg:h-[350px] md:w-3/4 lg:w-1/2 px-4 py-2 bg-white flex flex-row justify-center items-center gap-4 overflow-x-scroll rounded-lg shadow-md my-4">
          {appartment.images &&
            appartment.images.length > 0 &&
            appartment.images.map((image, index) => (
              <img
                src={image}
                key={index}
                alt="appartment"
                className="w-fit h-48 object-cover rounded-lg"
              />
            ))}
        </div>
      </div>
      <div className="w-full lg:mx-4 px-4 py-2 bg-white rounded-lg shadow-md my-4 flex flex-col justify-start items-start">
        <div className="w-full flex flex-row justify-between px-4">
          <h1 className="text-2xl font-semibold my-4">Reviews</h1>
          <IconButton
            onClick={() => {
              dispatch(
                modalActions.setModalData({
                  id: id,
                })
              );
              openModal(modalTypes.REVIEW);
            }}
            label={"Add Review"}
          >
            <FaPlus />
          </IconButton>
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
