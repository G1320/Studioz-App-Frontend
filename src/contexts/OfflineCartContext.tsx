import { createContext, useState, useContext, ReactNode } from 'react';
import { getLocalOfflineCart } from '@services/index';
import { Cart } from '@models/index';

interface OfflineCartContextType {
  offlineCart: Cart;
  setOfflineCartContext: React.Dispatch<React.SetStateAction<Cart>>;
}

interface OfflineCartProviderProps {
  children: ReactNode;
}

const OfflineCartContext = createContext<OfflineCartContextType | undefined>(undefined);

export const OfflineCartProvider: React.FC<OfflineCartProviderProps> = ({ children }) => {
  const [offlineCart, setOfflineCartContext] = useState<Cart>(getLocalOfflineCart() || { items: [] });
  return (
    <OfflineCartContext.Provider value={{ offlineCart, setOfflineCartContext }}>{children}</OfflineCartContext.Provider>
  );
};

export const useOfflineCartContext = (): OfflineCartContextType => {
  const context = useContext(OfflineCartContext);
  if (context === undefined) {
    throw new Error('useOfflineCartContext must be used within an OfflineCartProvider');
  }
  return context;
};
