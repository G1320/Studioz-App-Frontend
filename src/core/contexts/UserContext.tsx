import { createContext, useState, useContext, ReactNode } from 'react';
import { getLocalUser } from '@shared/services/index';
import { User } from 'src/types/index';

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  updateSubscription: (subscriptionId: string | null, status: string) => void;
}

interface UserProviderProps {
  children: ReactNode;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState(getLocalUser());

  const updateSubscription = (subscriptionId: string | null, status: string) => {
    setUser((currentUser: any) => {
      if (!currentUser) return null;

      const updatedUser = {
        ...currentUser,
        subscriptionId,
        subscriptionStatus: status
      };

      // Update local storage
      localStorage.setItem('user', JSON.stringify(updatedUser));

      return updatedUser;
    });
  };

  return <UserContext.Provider value={{ user, setUser, updateSubscription }}>{children}</UserContext.Provider>;
};

export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
