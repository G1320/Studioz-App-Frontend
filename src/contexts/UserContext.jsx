import React, { createContext, useState, useContext } from 'react';
import { getLocalUser } from '../services/user-service';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(getLocalUser());

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

export const useUserContext = () => useContext(UserContext);
