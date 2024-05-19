import React, { createContext, useState, useContext } from 'react';
import { getLocalOfflineCart } from '../services/cart-service';

const OfflineCartContext = createContext(null);

export const OfflineCartProvider = ({ children }) => {
  const [offlineCart, setOfflineCart] = useState(getLocalOfflineCart() || []);

  return (
    <OfflineCartContext.Provider value={{ offlineCart, setOfflineCart }}>
      {children}
    </OfflineCartContext.Provider>
  );
};

export const useOfflineCartContext = () => useContext(OfflineCartContext);
