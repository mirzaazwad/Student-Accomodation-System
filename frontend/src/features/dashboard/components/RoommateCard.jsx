import ProfilePicture from "../../../components/input/ProfilePicture";

const RoommateCard = ({ roommate }) => {
  return (
    <div className="w-full h-fit p-4 flex-shrink-0 flex flex-row items-center gap-4 rounded-lg shadow-md justify-start items-start">
      <div className="w-1/4 flex flex-col items-center justify-center">
        <ProfilePicture src={roommate.profilePicture} disabled={true} />
      </div>
      <div className="w-3/4 flex flex-col items-start justify-start">
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
    </div>
  );
};

export default RoommateCard;
