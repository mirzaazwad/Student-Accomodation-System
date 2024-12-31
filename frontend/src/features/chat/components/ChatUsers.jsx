import ChatUserCard from "./ChatUserCard";
import LoadingComponent from "../../../components/LoadingComponent";
import { useChatUsers } from "../hooks/useChatUsers";

const ChatUsers = ({ id }) => {
  const { sessions, loading, error, activeIndex, setActiveIndex } =
    useChatUsers(id);

  if (loading) return <LoadingComponent />;

  return (
    <div className="lg:w-1/5 w-1/6 max-w-[58px] lg:max-w-full h-full overflow-auto bg-gray-200">
      {error && <div className="text-red-500">{error}</div>}
      {sessions &&
        sessions.map((session, index) => {
          return (
            <ChatUserCard
              key={index}
              id={session.id}
              username={session.username}
              userType={session.userType}
              profilePicture={session.profilePicture}
              onClick={() => setActiveIndex(index)}
              active={activeIndex === index}
            />
          );
        })}
    </div>
  );
};

export default ChatUsers;
