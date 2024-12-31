import { useEffect, useState } from "react";
import { axios } from "../../../utils/RequestHandler";
import IconButton from "../../../components/input/IconButton";
import Input from "../../../components/input/Input";
import { FaPaperPlane } from "react-icons/fa";
import Message from "./Message";
import LoadingComponent from "../../../components/LoadingComponent";
import { useSocket } from "../../../hooks/useSocket";
import { useSelector } from "react-redux";

const ChatWindow = ({ id }) => {
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

  if (loading) return <LoadingComponent />;

  if (!id) {
    return <div className="flex-grow lg:w-4/5 w-5/6 flex flex-col"></div>;
  }

  return (
    <div className="flex-grow lg:w-4/5 w-5/6 flex flex-col">
      <div className="flex-grow flex-col-reverse flex overflow-y-auto scrollbar-thin px-4 py-2 bg-gray-100 bg-opacity-50 rounded-lg">
        {messages &&
          messages.map((message, index) => (
            <Message
              key={index}
              message={message.message}
              id={message.id}
              createdAt={message.createdAt}
              username={""}
              userType={""}
            />
          ))}
      </div>
      <div className="w-full flex flex-row items-center space-x-1 p-4 bg-primary-dark">
        <Input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
        />
        <IconButton
          type="button"
          onClick={handleSendMessage}
          disabled={loading}
          label={loading ? "Sending..." : "Send"}
          className="ml-2 mr-1 my-2 text-white bg-sky-400 hover:bg-sky-500 hover:scale-105 cursor-pointer font-bold md:text-md text-sm rounded-md px-2 py-2 transition duration-300"
        >
          <FaPaperPlane />
        </IconButton>
      </div>
    </div>
  );
};

export default ChatWindow;
