import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Item } from 'src/types/index';
import { getLocalModalOpen, setLocalModalOpen, getLocalSelectedItem, setLocalSelectedItem } from '@shared/services';
import { GenericModal } from '@shared/components';
import { ItemDetails } from '@features/entities';
import { getStudioById } from '@shared/services/studio-service';
import { preloadImage } from '@shared/utils/preloadUtils';

// Define types for the context
interface ModalContextType {
  selectedItem: Item | null;
  loadingItemId: string | null;
  loadingStudioId: string | null;
  openModal: (item: Item) => void;
  closeModal: () => void;
  setLoadingStudioId: (studioId: string | null) => void;
}

// Create the context
const ModalContext = createContext<ModalContextType | undefined>(undefined);

// Default noop functions for when context is not available
const defaultContextValue: ModalContextType = {
  selectedItem: null,
  loadingItemId: null,
  loadingStudioId: null,
  openModal: () => {
    console.warn('useModal: openModal called outside of ModalProvider');
  },
  closeModal: () => {
    console.warn('useModal: closeModal called outside of ModalProvider');
  },
  setLoadingStudioId: () => {
    console.warn('useModal: setLoadingStudioId called outside of ModalProvider');
  }
};

// Custom hook to use the context
// Returns safe defaults if used outside provider (handles HMR edge cases)
export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  // Return default value instead of throwing to handle HMR/Fast Refresh edge cases
  return context ?? defaultContextValue;
};

// Provider Component
interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const location = useLocation();
  const [selectedItem, setSelectedItem] = useState<Item | null>(() => {
    // Initialize state from localStorage
    const storedItem = getLocalSelectedItem();
    return storedItem;
  });
  const [loadingItemId, setLoadingItemId] = useState<string | null>(null);
  const [loadingStudioId, setLoadingStudioId] = useState<string | null>(null);

  const openModal = useCallback(async (item: Item) => {
    // Set loading state on the clicked item
    setLoadingItemId(item._id);

    try {
      // Fetch studio data to get cover image URL
      if (item.studioId) {
        const studioData = await getStudioById(item.studioId);
        const coverImageUrl = studioData?.currStudio?.coverImage;

        // Preload the cover image if available
        if (coverImageUrl) {
          await preloadImage(coverImageUrl);
        }
      }
    } catch (error) {
      // If fetching fails, still open the modal
      console.error('Error preloading modal data:', error);
    }

    // Clear loading and open modal
    setLoadingItemId(null);
    setSelectedItem(item);
    setLocalModalOpen(true);
    setLocalSelectedItem(item);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedItem(null);
    setLocalModalOpen(false);
    setLocalSelectedItem(null);
  }, []);

  useEffect(() => {
    // Synchronize state on component mount (e.g., page reload)
    const modalOpen = getLocalModalOpen();
    const storedItem = getLocalSelectedItem();
    if (modalOpen && storedItem) {
      setSelectedItem(storedItem);
    }
  }, []);

  // Close modal when navigation occurs
  useEffect(() => {
    if (selectedItem) {
      closeModal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <ModalContext.Provider value={{ selectedItem, loadingItemId, loadingStudioId, openModal, closeModal, setLoadingStudioId }}>
      {children}
      <GenericModal open={!!selectedItem} onClose={closeModal} className="item-modal">
        {selectedItem && <ItemDetails itemId={selectedItem._id} />}
      </GenericModal>
    </ModalContext.Provider>
  );
};
