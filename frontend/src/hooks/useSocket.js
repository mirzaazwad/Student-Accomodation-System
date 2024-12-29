import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SOCKET_URI, {
      autoConnect: false,
    });

    socket.on("connect", () => {
      setConnected(true);
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    socket.on("connect_error", (err) => {
      setError(err.message);
    });

    setSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, []);

  return { socket, connected, error };
};
