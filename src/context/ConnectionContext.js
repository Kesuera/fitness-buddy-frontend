import React, { useState, useEffect, createContext } from 'react';
import NetInfo from '@react-native-community/netinfo';

export const ConnectionContext = createContext();

export const ConnectionProvider = ({ children }) => {
  const [connection, setConnection] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setConnection(state.isConnected);
    });
    return () => {
      unsubscribe;
    };
  }, []);

  return (
    <ConnectionContext.Provider
      value={{
        connection,
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
};
