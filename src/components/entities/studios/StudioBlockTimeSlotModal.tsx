import { useState } from 'react';
import LockClockIcon from '@mui/icons-material/LockClock';
import { MuiDateTimePicker, Button } from '@components/index';
import { Dialog } from '@mui/material';
import { splitDateTime } from '@utils/index';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { reserveStudioTimeSlots } from '@services/booking-service';

interface StudioBlockModalProps {
  studioId: string;
  studioAvailability: any; // Replace with your studio availability type
}

export const StudioBlockModal: React.FC<StudioBlockModalProps> = ({ studioId, studioAvailability }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedHours, setSelectedHours] = useState<number>(1);
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation('common');

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
      return toast.error('Please select a date and time');
    }

    const { bookingDate, startTime } = splitDateTime(selectedDate.toString());
    if (!bookingDate || !startTime) {
      return toast.error('Please select a valid date and time');
    }

    const closingTime = studioAvailability?.times[0]?.end;
    if (!closingTime) {
      return toast.error('Studio closing time is unavailable');
    }

    const startDateTime = dayjs(`${bookingDate} ${startTime}`, 'DD/MM/YYYY HH:mm');
    const endDateTime = startDateTime.add(selectedHours, 'hour');
    const closingDateTime = dayjs(`${bookingDate} ${closingTime}`, 'DD/MM/YYYY HH:mm');

    if (endDateTime.isAfter(closingDateTime)) {
      return toast.error('Selected hours exceed the studio closing time. Please adjust your booking.');
    }

    try {
      setIsLoading(true);

      await reserveStudioTimeSlots({
        studioId,
        bookingDate,
        startTime,
        hours: selectedHours
      });

      toast.success('Studio time slots blocked successfully');
      setIsOpen(false);
      setSelectedDate(null);
      setSelectedHours(1);
      setReason('');
    } catch (error) {
      toast.error('Failed to block studio time slots');
      console.error('Error blocking time slots:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="block-time-button" title="Block Studio Time">
        <LockClockIcon className="clock-icon" />
      </button>

      <Dialog open={isOpen} onClose={() => !isLoading && setIsOpen(false)} className="block-time-modal">
        <div className="modal-content">
          <h2>{t('studio.block_time')}</h2>

          <div className="hour-selection-container">
            <div>
              <span className="hour-label">{t('common.hours')}:</span>
              <span className="hour-value">{selectedHours}</span>
            </div>
            <div className="button-group">
              <button className="control-button minus" onClick={handleDecrement} disabled={isLoading}>
                −
              </button>
              <button className="control-button plus" onClick={handleIncrement} disabled={isLoading}>
                +
              </button>
            </div>
          </div>

          <MuiDateTimePicker value={selectedDate} onChange={handleDateChange} studioAvailability={studioAvailability} />

          <input
            type="text"
            placeholder={t('studio.block_reason')}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="reason-input"
            disabled={isLoading}
          />

          <div className="modal-actions">
            <Button onClick={() => setIsOpen(false)} className="cancel-button" disabled={isLoading}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleBlockTime} className="block-button" disabled={!selectedDate || isLoading}>
              {isLoading ? t('common.blocking') : t('studio.block_time')}
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
};
