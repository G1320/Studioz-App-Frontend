export const formatBookingDate = (date: string | Date | undefined): string => {
  if (!date) return 'No date available';

  return new Date(date)
    .toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
    .replace(/:\d{2}$/, ':00');
};

interface SplitDateTimeResult {
  bookingDate: string;
  startTime: string;
}

export const splitDateTime = (dateTime: Date | string | null): SplitDateTimeResult => {
  if (!dateTime) {
    return { bookingDate: '', startTime: '' };
  }

  const dateObj = typeof dateTime === 'string' ? new Date(dateTime) : dateTime;

  const bookingDate = dateObj.toLocaleDateString('en-GB'); // "20/10/2024"
  const startTime = dateObj.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false }); // "14:00"

  return { bookingDate, startTime };
};
