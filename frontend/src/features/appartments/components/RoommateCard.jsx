import ProfilePicture from "../../../components/input/ProfilePicture";
import IconButton from "../../../components/input/IconButton";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useState } from "react";

const RoommateCard = ({
  roommate,
  addRoommate,
  removeRoommate,
  selectedRoommates,
  isSelected,
}) => {
  const [isRequested, setIsRequested] = useState(false);
  if (
    selectedRoommates &&
    selectedRoommates.map((roommate) => roommate.id).includes(roommate.id)
  ) {
    return <></>;
  }
  return (
    <div className="w-[350px] h-[600px] p-4 flex-shrink-0 flex flex-col items-center gap-4 rounded-lg shadow-md justify-start items-start">
      <div className="w-full flex flex-col items-center justify-center">
        <ProfilePicture src={roommate.profilePicture} disabled={true} />
      </div>
      <div className="w-full flex flex-col items-start justify-start">
        <h1 className="text-xl font-semibold">{roommate.username}</h1>
        <h2 className="text-md font-semibold">
          Address: {roommate.location.address}
        </h2>
        <p className="text-gray-600">
          Cleanliness: {roommate.roommateProfile.preferences.cleanliness}
        </p>
        <p className="text-gray-600">
          Lifestyle: {roommate.roommateProfile.preferences.lifestyle}
        </p>
        <p className="text-gray-600">
          Social: {roommate.roommateProfile.preferences.gender}
        </p>
        <p className="text-gray-600">
          Budget: {roommate.roommateProfile.budget.minRent} -{" "}
          {roommate.roommateProfile.budget.maxRent}
        </p>
      </div>
      <div className="w-full flex flex-row items-center justify-center">
        {!isSelected && (
          <IconButton
            label={!isRequested ? "Add Roommate" : "Remove Roommate"}
            onClick={() => {
              setIsRequested(!isRequested);
              if (!isRequested) {
                addRoommate(roommate);
              } else {
                removeRoommate(roommate);
              }
            }}
          >
            {!isRequested ? <FaPlus /> : <FaTrash />}
          </IconButton>
        )}
      </div>
    </div>
  );
};

export default RoommateCard;
