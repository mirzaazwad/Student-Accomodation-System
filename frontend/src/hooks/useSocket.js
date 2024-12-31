import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export const useSocket = () => {
  const socket = io(`${import.meta.env.VITE_SOCKET_URI}`);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to socket server");
      setConnected(true);
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    socket.on("connect_error", (err) => {
      console.error(err);
      setError(err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return { socket, connected, error };
};
