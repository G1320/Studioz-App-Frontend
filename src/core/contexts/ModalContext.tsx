import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Item } from 'src/types/index';
import { GenericModal } from '@shared/components';
import { ItemDetails } from '@features/entities/items/components/ItemDetails';
import { getStudioById } from '@shared/services/studio-service';
import { preloadImage } from '@shared/utils/preloadUtils';

// Define types for the context
interface ModalContextType {
  selectedItemId: string | null;
  loadingItemId: string | null;
  loadingStudioId: string | null;
  openModal: (item: Item | string) => void;
  closeModal: () => void;
  setLoadingStudioId: (studioId: string | null) => void;
}

// Create the context
const ModalContext = createContext<ModalContextType | undefined>(undefined);

// Default noop functions for when context is not available
const defaultContextValue: ModalContextType = {
  selectedItemId: null,
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [loadingItemId, setLoadingItemId] = useState<string | null>(null);
  const [loadingStudioId, setLoadingStudioId] = useState<string | null>(null);

  // Get itemId from URL query params
  const selectedItemId = searchParams.get('item');

  const openModal = useCallback(
    async (itemOrId: Item | string) => {
      // Support both Item object and itemId string
      const itemId = typeof itemOrId === 'string' ? itemOrId : itemOrId._id;
      const item = typeof itemOrId === 'string' ? null : itemOrId;

      // Set loading state on the clicked item
      setLoadingItemId(itemId);

      try {
        // Fetch studio data to get cover image URL for preloading
        const studioId = item?.studioId;
        if (studioId) {
          const studioData = await getStudioById(studioId);
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

      // Clear loading and update URL to open modal
      setLoadingItemId(null);

      // Update URL with item param (preserves other params)
      setSearchParams(
        (prev) => {
          prev.set('item', itemId);
          return prev;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const closeModal = useCallback(() => {
    // Remove item param from URL (preserves other params)
    setSearchParams(
      (prev) => {
        prev.delete('item');
        return prev;
      },
      { replace: true }
    );
  }, [setSearchParams]);

  // Track previous pathname to detect actual navigation (not initial mount/refresh)
  const prevPathnameRef = useRef(location.pathname);

  // Close modal when pathname changes (navigation to different page)
  useEffect(() => {
    // Only close modal if pathname actually changed (not on initial mount)
    if (prevPathnameRef.current !== location.pathname && selectedItemId) {
      closeModal();
    }
    // Update ref to current pathname
    prevPathnameRef.current = location.pathname;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <ModalContext.Provider
      value={{ selectedItemId, loadingItemId, loadingStudioId, openModal, closeModal, setLoadingStudioId }}
    >
      {children}
      <GenericModal open={!!selectedItemId} onClose={closeModal} className="item-modal">
        {selectedItemId && <ItemDetails itemId={selectedItemId} />}
      </GenericModal>
    </ModalContext.Provider>
  );
};
