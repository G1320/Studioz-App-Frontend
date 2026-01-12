import { useState } from 'react';
import LockClockIcon from '@mui/icons-material/LockClock';
import { MuiDateTimePicker, Button } from '@shared/components';
import { HourSelector } from '@features/entities/items/components/HourSelector';
import { Dialog } from '@mui/material';
import { splitDateTime } from '@shared/utils/index';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { reserveStudioTimeSlots } from '@shared/services/booking-service';
import { StudioAvailability } from 'src/types/studio';

interface StudioBlockModalProps {
  studioId: string;
  studioAvailability?: StudioAvailability;
  onClose?: () => void;
  open?: boolean;
}

export const StudioBlockModal: React.FC<StudioBlockModalProps> = ({ studioId, studioAvailability, onClose, open }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Use controlled open prop if provided, otherwise use internal state
  const isModalOpen = open !== undefined ? open : isOpen;
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedHours, setSelectedHours] = useState<number>(1);
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation(['common', 'studio']);

  const handleDateChange = (newDate: Date | null) => {
    setSelectedDate(newDate);
  };

  const handleIncrement = () => {
    setSelectedHours((prev) => prev + 1);
  };

  const handleDecrement = () => {
    setSelectedHours((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleBlockTime = async () => {
    if (!selectedDate) {
      return toast.error(t('studio:errors.select_date_time'));
    }

    const { bookingDate, startTime } = splitDateTime(selectedDate.toString());
    if (!bookingDate || !startTime) {
      return toast.error(t('studio:errors.invalid_date_time'));
    }

    const closingTime = studioAvailability?.times[0]?.end;
    if (!closingTime) {
      return toast.error(t('studio:errors.closing_time_unavailable'));
    }

    const startDateTime = dayjs(`${bookingDate} ${startTime}`, 'DD/MM/YYYY HH:mm');
    const endDateTime = startDateTime.add(selectedHours, 'hour');
    const closingDateTime = dayjs(`${bookingDate} ${closingTime}`, 'DD/MM/YYYY HH:mm');

    if (endDateTime.isAfter(closingDateTime)) {
      return toast.error(t('studio:errors.hours_exceed_closing'));
    }

    try {
      setIsLoading(true);

      await reserveStudioTimeSlots({
        studioId,
        bookingDate,
        startTime,
        hours: selectedHours
      });

      toast.success(t('studio:success.blocked_successfully'));
      if (open === undefined) {
        setIsOpen(false);
      }
      onClose?.();
      setSelectedDate(null);
      setSelectedHours(1);
      setReason('');
    } catch (error) {
      toast.error(t('studio:errors.block_failed'));
      console.error('Error blocking time slots:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      if (open === undefined) {
        setIsOpen(false);
      }
      onClose?.();
    }
  };

  // If onClose is provided, this is a controlled component - don't render the trigger button
  if (onClose !== undefined) {
    return (
      <Dialog open={isModalOpen} onClose={handleClose} className="block-time-modal">
        <div className="modal-content">
          <h2>{t('studio:block_time')}</h2>

          <HourSelector
            value={selectedHours}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
            min={1}
          />

          <MuiDateTimePicker value={selectedDate} onChange={handleDateChange} studioAvailability={studioAvailability} />

          <input
            type="text"
            placeholder={t('studio:block_reason')}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="reason-input"
            disabled={isLoading}
          />

          <div className="modal-actions">
            <Button onClick={handleClose} className="cancel-button" disabled={isLoading}>
              {t('common:cancel')}
            </Button>
            <Button onClick={handleBlockTime} className="block-button" disabled={!selectedDate || isLoading}>
              {isLoading ? t('studio:blocking') : t('studio:block_time')}
            </Button>
          </div>
        </div>
      </Dialog>
    );
  }

  // Default behavior: render trigger button
  return (
    <>
      <button onClick={() => setIsOpen(true)} className="block-time-button" title={t('studio:block_time')}>
        <LockClockIcon className="clock-icon" />
      </button>

      <Dialog open={isModalOpen} onClose={handleClose} className="block-time-modal">
        <div className="modal-content">
          <h2>{t('studio:block_time')}</h2>

          <HourSelector
            value={selectedHours}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
            min={1}
          />

          <MuiDateTimePicker value={selectedDate} onChange={handleDateChange} studioAvailability={studioAvailability} />

          <input
            type="text"
            placeholder={t('studio:block_reason')}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="reason-input"
            disabled={isLoading}
          />

          <div className="modal-actions">
            <Button onClick={handleClose} className="cancel-button" disabled={isLoading}>
              {t('common:cancel')}
            </Button>
            <Button onClick={handleBlockTime} className="block-button" disabled={!selectedDate || isLoading}>
              {isLoading ? t('studio:blocking') : t('studio:block_time')}
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
};
