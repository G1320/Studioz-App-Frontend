import React, { createContext, useContext, useState, ReactNode } from 'react';
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
    throw new Error('useReservationModal must be used within a ReservationModalProvider');
  }
  return context;
};

// Provider Component
interface ReservationModalProviderProps {
  children: ReactNode;
}

export const ReservationModalProvider: React.FC<ReservationModalProviderProps> = ({ children }) => {
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  const openReservationModal = (reservation: Reservation) => {
    setSelectedReservation(reservation);
  };

  const closeReservationModal = () => {
    setSelectedReservation(null);
  };

  return (
    <ReservationModalContext.Provider value={{ selectedReservation, openReservationModal, closeReservationModal }}>
      {children}
      <GenericModal open={!!selectedReservation} onClose={closeReservationModal} className="reservation-modal">
        {selectedReservation && <ReservationDetails reservationId={selectedReservation._id} />}
      </GenericModal>
    </ReservationModalContext.Provider>
  );
};

