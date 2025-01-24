import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Item } from 'src/types/index';
import {
  getLocalModalOpen,
  setLocalModalOpen,
  getLocalSelectedItem,
  setLocalSelectedItem
} from '@shared/services/index';

// Define types for the context
interface ModalContextType {
  selectedItem: Item | null;
  openModal: (item: Item) => void;
  closeModal: () => void;
}

// Create the context
const ModalContext = createContext<ModalContextType | null>(null);

// Custom hook to use the context
export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

// Provider Component
interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(() => {
    // Initialize state from localStorage
    const storedItem = getLocalSelectedItem();
    return storedItem;
  });

  const openModal = (item: Item) => {
    setSelectedItem(item);
    setLocalModalOpen(true);
    setLocalSelectedItem(item);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setLocalModalOpen(false);
    setLocalSelectedItem(null);
  };

  useEffect(() => {
    // Synchronize state on component mount (e.g., page reload)
    const modalOpen = getLocalModalOpen();
    const storedItem = getLocalSelectedItem();
    if (modalOpen && storedItem) {
      setSelectedItem(storedItem);
    }
  }, []);

  return <ModalContext.Provider value={{ selectedItem, openModal, closeModal }}>{children}</ModalContext.Provider>;
};
