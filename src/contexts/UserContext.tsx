import { createContext, useState, useContext, ReactNode } from 'react';
import { getLocalUser } from '@/services';
import { User } from '@/types/index';

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

interface UserProviderProps {
  children: ReactNode;
}
const UserContext = createContext<UserContextType | undefined>(undefined);


export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState(getLocalUser());

  return <UserContext.Provider value={{ user, setUser }}>
          {children}
       </UserContext.Provider>;
};


export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};