import { useEffect, useState } from "react";
import { axios } from "../../../utils/RequestHandler";
import { useSocket } from "../../../hooks/useSocket";
import { useSelector } from "react-redux";

export const useChatWindow = (id) => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const { socket } = useSocket();
  const user = useSelector((state) => state.auth.user);

  const fetchMessages = async () => {
    if (!id) {
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(`/message/${id}`);
      setMessages([]);
      response.data.map((message) => {
        setMessages((prev) => [
          ...prev,
          {
            message: message.message,
            createdAt: message.createdAt,
            username: message.sender.username,
            userType: message.sender.userType,
            id: message.sender.id,
          },
        ]);
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    try {
      socket.emit("message", {
        content: {
          message: text,
          username: user.username,
          userType: user.userType,
          id: user.id,
        },
        sessionId: [id, user.id].sort().join("-"),
      });

      await axios.post(`/message/create`, {
        message: text,
        receiverId: id,
      });

      setText("");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!id) {
      return;
    }
    socket.on("message", (data) => {
      const sessionId = [id, user.id].sort().join("-");
      if (data.sessionId === sessionId) {
        setMessages((prev) => [
          {
            message: data.content.message,
            createdAt: new Date().toISOString(),
            username: data.content.username,
            userType: data.content.userType,
            id: data.content.id,
          },
          ...prev,
        ]);
      }
    });
    fetchMessages();
  }, [id]);

  return { text, setText, loading, messages, handleSendMessage };
};
