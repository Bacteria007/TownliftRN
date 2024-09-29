import React, { createContext, useContext, useEffect, useState } from 'react';
import { createSocket } from '../utils/constants/ApiRoutes';
import { AppContext } from './AppContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useContext(AppContext); // Assuming AppContext provides user details

  useEffect(() => {
    if (user?.id && (!socket)) {
      const newSocket = createSocket(user.id);
      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
