import { useSearchParams } from "react-router-dom";
import ChatUsers from "../components/ChatUsers";
import ChatWindow from "../components/ChatWindow";

const ChatPage = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  return (
    <div className="w-full flex flex-row flex-grow h-screen overflow-hidden">
      <ChatUsers id={id} />
      <ChatWindow id={id} />
    </div>
  );
};

export default ChatPage;
