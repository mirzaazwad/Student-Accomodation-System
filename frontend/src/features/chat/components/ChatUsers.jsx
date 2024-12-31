import { useEffect, useState } from "react";
import ChatUserCard from "./ChatUserCard";
import { useSelector } from "react-redux";
import { axios } from "../../../utils/RequestHandler";
import LoadingComponent from "../../../components/LoadingComponent";

const ChatUsers = ({ id }) => {
  const [error, setError] = useState("");
  const [intervalId, setIntervalId] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const fetchSessions = async () => {
    try {
      const response = await axios.get("/message");
      setSessions(response.data.sessions);
    } catch (error) {
      setError(error.response.data.message || "Failed to fetch sessions");
    } finally {
      setLoading(false);
    }
  };

  const polling = () => {
    const intervalId = setInterval(fetchSessions, 20000);
    setIntervalId(intervalId);
  };

  useEffect(() => {
    polling();
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (sessions.length > 0) {
      const currentSessionId = [user.id, id].sort().join("-");
      const activeIndex = sessions.map((session, index) => {
        if (session._id === currentSessionId) {
          return index;
        }
      });
      setActiveIndex(activeIndex);
    }
  }, [sessions]);

  if (loading) return <LoadingComponent />;

  return (
    <div className="lg:w-1/5 w-1/6 max-w-[58px] lg:max-w-full h-full overflow-auto bg-gray-200">
      {error && <div className="text-red-500">{error}</div>}
      {sessions &&
        sessions.map((session, index) => {
          const currentUser =
            session.users[0].id === user.id
              ? session.users[1]
              : session.users[0];
          return (
            <ChatUserCard
              key={session.id}
              id={currentUser.id}
              username={currentUser.username}
              userType={currentUser.userType}
              profilePicture={currentUser.profilePicture}
              onClick={() => setActiveIndex(index)}
              active={activeIndex === index}
            />
          );
        })}
    </div>
  );
};

export default ChatUsers;
