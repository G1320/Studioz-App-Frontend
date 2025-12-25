import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Reservation } from 'src/types/index';
import { GenericModal } from '@shared/components';
import { ReservationDetails } from '@features/entities/reservations/components/ReservationDetails';

// Define types for the context
interface ReservationModalContextType {
  selectedReservation: Reservation | null;
  openReservationModal: (reservation: Reservation) => void;
  closeReservationModal: () => void;
}

// Create the context
const ReservationModalContext = createContext<ReservationModalContextType | undefined>(undefined);

// Custom hook to use the context
export const useReservationModal = () => {
  const context = useContext(ReservationModalContext);
  if (!context) {
    // Return a no-op fallback instead of throwing
    // This allows ReservationCard to work in contexts where the provider isn't available
    return {
      selectedReservation: null,
      openReservationModal: () => {
        console.warn('ReservationModalProvider is not available. Cannot open reservation modal.');
      },
      closeReservationModal: () => {}
    };
  }
  return context;
};

// Provider Component
interface ReservationModalProviderProps {
  children: ReactNode;
}

export const ReservationModalProvider: React.FC<ReservationModalProviderProps> = ({ children }) => {
  const location = useLocation();
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  const openReservationModal = (reservation: Reservation) => {
    setSelectedReservation(reservation);
  };

  const closeReservationModal = () => {
    setSelectedReservation(null);
  };

  // Close modal when navigation occurs
  useEffect(() => {
    if (selectedReservation) {
      closeReservationModal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <ReservationModalContext.Provider value={{ selectedReservation, openReservationModal, closeReservationModal }}>
      {children}
      <GenericModal open={!!selectedReservation} onClose={closeReservationModal} className="reservation-modal">
        {selectedReservation && <ReservationDetails reservationId={selectedReservation._id} />}
      </GenericModal>
    </ReservationModalContext.Provider>
  );
};

