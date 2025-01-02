import { useNavigate } from "react-router-dom";

const ChatUserCard = ({
  id,
  username,
  profilePicture,
  userType,
  onClick,
  active,
}) => {
  const navigate = useNavigate();
  return (
    <div
      className={`w-11/12 p-2 bg-white rounded-lg shadow-md mx-2 my-4 cursor-pointer ${
        active && "bg-primary-light"
      }`}
      onClick={() => {
        navigate(`/chat?id=${id}`);
        onClick && onClick();
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img
            src={profilePicture ? profilePicture : "/profile-picture.png"}
            className="w-16 h-16 rounded-full p-4"
          />
          <div className="flex flex-col">
            <div className="text-sm font-semibold">{username}</div>
            <div
              className={`text-xs text-white ${
                userType === "student"
                  ? "bg-primary p-1 rounded-lg"
                  : "bg-green-600 p-1 rounded-lg"
              }`}
            >
              {userType}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatUserCard;
