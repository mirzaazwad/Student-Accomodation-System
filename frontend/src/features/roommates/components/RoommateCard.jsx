import { FaCheck, FaHouseUser, FaPaperPlane } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import IconButton from "../../../components/input/IconButton";
import ProfilePicture from "../../../components/input/ProfilePicture";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axios } from "../../../utils/RequestHandler";
import LoadingComponent from "../../../components/LoadingComponent";

const RoommateCard = ({ request, showAccept }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const fetchSession = async (receiverId) => {
    setLoading(true);
    try {
      await axios.post(`/message/session`, {
        receiverId,
      });
      navigate(`/chat?id=${receiverId}`);
    } catch (error) {
      setError(error.response.data.message || "Failed to create session");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <div className="w-full p-4 bg-white mt-12">
      <div className="w-full rounded-lg shadow-lg flex flex-col">
        {error && (
          <div className="w-full bg-red-200 text-red-800 p-4 text-center font-semibold">
            {error}
          </div>
        )}
        <div className="w-full flex flex-row justify-start items-start">
          <div className="w-1/4 h-full flex flex-col items-center justify-center">
            <ProfilePicture src={request.profilePicture} disabled={true} />
          </div>
          <div className="w-3/4">
            <h1 className="text-lg font-semibold">{request.username}</h1>
            <h2 className="text-md font-semibold">
              Address: {request.location.address}
            </h2>
            <h2 className="text-lg font-semibold">Preferences: </h2>
            <p className="text-gray-600">
              Cleanliness: {request.roommateProfile.preferences.cleanliness}
            </p>
            <p className="text-gray-600">
              Lifestyle: {request.roommateProfile.preferences.lifestyle}
            </p>
            <p className="text-gray-600">
              Gender: {request.roommateProfile.preferences.gender}
            </p>
            <p className="text-gray-600">
              Budget: {request.roommateProfile.budget.minRent} -{" "}
              {request.roommateProfile.budget.maxRent}
            </p>
          </div>
        </div>
        <div className="w-full flex flex-row justify-end items-end px-4 py-2">
          {showAccept && (
            <>
              <IconButton label="Accept" className="mr-2">
                <FaCheck />
              </IconButton>
              <IconButton label="Reject" className="mr-2">
                <MdClose />
              </IconButton>
            </>
          )}
          <IconButton
            label="View Apartment"
            className="mr-2"
            onClick={() => navigate(`/appartments/${request.appartmentId}`)}
          >
            <FaHouseUser />
          </IconButton>
          <IconButton
            label="Send Message"
            onClick={() => fetchSession(request.id)}
          >
            <FaPaperPlane />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default RoommateCard;
