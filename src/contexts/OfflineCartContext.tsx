import React, { createContext, useState, useContext,ReactNode } from 'react';
import { getLocalOfflineCart } from '../services/cart-service';
import Cart from '../../../shared/types/cart';

interface OfflineCartContextType {
  offlineCartContext: Cart;
  setOfflineCartContext: React.Dispatch<React.SetStateAction<Cart>>;
}

interface OfflineCartProviderProps {
  children: ReactNode;
}

const OfflineCartContext = createContext<OfflineCartContextType | undefined>(undefined);

export const OfflineCartProvider: React.FC<OfflineCartProviderProps> = ({ children }) => {
  const [offlineCartContext, setOfflineCartContext] = useState<Cart>(
    getLocalOfflineCart() || { items: [] } 
  );
  return (
    <OfflineCartContext.Provider value={{ offlineCartContext, setOfflineCartContext }}>
      {children}
    </OfflineCartContext.Provider>
  );
};

export const useOfflineCartContext = (): OfflineCartContextType => {
  const context = useContext(OfflineCartContext);
  if (context === undefined) {
    throw new Error('useOfflineCartContext must be used within an OfflineCartProvider');
  }
  return context;
};