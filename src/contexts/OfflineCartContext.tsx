import { createContext, useState, useContext, ReactNode } from 'react';
import { getLocalOfflineCart } from '@/services';
import { Cart } from '@/types/index';

interface OfflineCartContextType {
  offlineCart: Cart;
  setOfflineCart: React.Dispatch<React.SetStateAction<Cart>>;
}

interface OfflineCartProviderProps {
  children: ReactNode;
}

const OfflineCartContext = createContext<OfflineCartContextType | undefined>(undefined);

export const OfflineCartProvider: React.FC<OfflineCartProviderProps> = ({ children }) => {
  const [offlineCart, setOfflineCart] = useState<Cart>(getLocalOfflineCart() || { items: [] });
  return <OfflineCartContext.Provider value={{ offlineCart, setOfflineCart }}>{children}</OfflineCartContext.Provider>;
};

export const useOfflineCartContext = (): OfflineCartContextType => {
  const context = useContext(OfflineCartContext);
  if (context === undefined) {
    throw new Error('useOfflineCartContext must be used within an OfflineCartProvider');
  }
  return context;
};
