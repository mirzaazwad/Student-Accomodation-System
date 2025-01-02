import IconButton from "../../../components/input/IconButton";
import Input from "../../../components/input/Input";
import { FaPaperPlane } from "react-icons/fa";
import Message from "./Message";
import LoadingComponent from "../../../components/LoadingComponent";
import { useChatWindow } from "../hooks/useChatWindow";

const ChatWindow = ({ id }) => {
  const { text, setText, loading, messages, handleSendMessage } =
    useChatWindow(id);

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
              username={message.username}
              userType={message.userType}
              profilePicture={message.profilePicture}
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
