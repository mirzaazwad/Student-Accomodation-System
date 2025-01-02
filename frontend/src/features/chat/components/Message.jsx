import { useSelector } from "react-redux";

const Message = ({
  id,
  message,
  username,
  profilePicture,
  userType,
  createdAt,
}) => {
  const user = useSelector((state) => state.auth.user);
  const isSender = user.id === id;

  return (
    <div
      className={`w-full flex p-4 ${
        isSender ? "justify-end items-end" : "justify-start items-start"
      }`}
    >
      <div className="w-fit min-w-[72px] h-fit">
        <div className="flex items-end flex-col">
          <div className="text-xs text-gray-500 mb-1">{username}</div>
          <div className={`w-full flex flex-shrink-0`}>
            <img
              src={profilePicture ? profilePicture : "/profile-picture.png"}
              className={`w-8 h-8 rounded-full m-4 border-2 ${
                userType === "student" ? "border-primary" : "border-green-600"
              }`}
            />
            <div
              className={`flex items-start justify-start p-4 h-12 rounded-lg ${
                isSender ? "bg-primary text-white" : "bg-gray-300 text-black"
              }`}
            >
              {message}
            </div>
          </div>
          <div className="text-xs text-gray-500">
            {new Date(createdAt).toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
