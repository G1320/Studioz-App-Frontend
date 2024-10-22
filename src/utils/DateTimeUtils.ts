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

export const splitDateTime = (dateTime: string): SplitDateTimeResult => {
  const [bookingDate, startTime] = dateTime.split(' ');
  return { bookingDate, startTime };
};
