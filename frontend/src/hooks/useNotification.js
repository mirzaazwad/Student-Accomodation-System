import { useSocket } from "./useSocket";

export const useNotification = () => {
  const { socket } = useSocket();

  const handleNotification = (data) => {
    socket.emit("notification", data);
  };

  return { handleNotification };
};
