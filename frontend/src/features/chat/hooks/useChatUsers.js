import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { axios } from "../../../utils/RequestHandler";

export const useChatUsers = (id) => {
  const [error, setError] = useState("");
  const user = useSelector((state) => state.auth.user);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/message");
      const modifiedSessions = response.data.sessions.map((session) => {
        const chatUser =
          session.users[0].id === user.id ? session.users[1] : session.users[0];
        return {
          id: chatUser.id,
          username: chatUser.username,
          userType: chatUser.userType,
          profilePicture: chatUser.profilePicture,
        };
      });
      console.log(response.data.sessions);
      setSessions(modifiedSessions);
    } catch (error) {
      setError(error.response.data.message || "Failed to fetch sessions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sessions && sessions.length > 0) {
      const currentSessionId = [user.id, id].sort().join("-");
      const activeIndex = sessions.map((session, index) => {
        if (session._id === currentSessionId) {
          return index;
        }
      });
      setActiveIndex(activeIndex);
    } else {
      fetchSessions();
    }
  }, [sessions, id]);

  return { sessions, loading, error, activeIndex, setActiveIndex };
};
