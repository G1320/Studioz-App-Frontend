import dayjs, { Dayjs } from 'dayjs';
import { Item, Studio } from 'src/types/index';
import { Duration, AdvanceBookingRequired } from 'src/types/item';
import { DayOfWeek, StudioAvailability } from 'src/types/studio';

// Day name mappings (English ↔ Hebrew)
const DAY_NAME_MAP: Record<string, DayOfWeek> = {
  // English
  Sunday: 'Sunday',
  Monday: 'Monday',
  Tuesday: 'Tuesday',
  Wednesday: 'Wednesday',
  Thursday: 'Thursday',
  Friday: 'Friday',
  Saturday: 'Saturday',
  // Hebrew
  'יום ראשון': 'Sunday',
  'יום שני': 'Monday',
  'יום שלישי': 'Tuesday',
  'יום רביעי': 'Wednesday',
  'יום חמישי': 'Thursday',
  'יום שישי': 'Friday',
  שבת: 'Saturday'
};

/**
 * Normalize a day name to English DayOfWeek
 */
/**
 * Find day index in studioAvailability.days, handling both English and Hebrew names
 */
function findDayIndex(dayName: DayOfWeek, days: DayOfWeek[]): number {
  // Direct match
  let idx = days.indexOf(dayName);
  if (idx !== -1) return idx;

  // Check if days array has Hebrew names - find corresponding Hebrew name
  const hebrewNames = Object.entries(DAY_NAME_MAP).filter(([key, val]) => val === dayName && key !== dayName);

  for (const [hebrewName] of hebrewNames) {
    idx = days.indexOf(hebrewName as DayOfWeek);
    if (idx !== -1) return idx;
  }

  return -1;
}

/**
 * Context object containing all data needed for availability calculations
 */
export interface AvailabilityContext {
  item: Item;
  studio?: Studio;
  selectedDate?: string; // Format: 'YYYY-MM-DD' or 'DD/MM/YYYY'
}

/**
 * Result of availability check for a specific date
 */
export interface DateAvailabilityResult {
  isBookable: boolean;
  availableSlots: string[];
  reason?: 'closed' | 'advance_booking' | 'no_slots' | 'min_duration';
}

/**
 * Result of time slot availability check
 */
export interface TimeSlotResult {
  slot: string;
  isAvailable: boolean;
  maxConsecutiveHours: number;
}

// ============================================================================
// DURATION HELPERS
// ============================================================================

/**
 * Convert a Duration to hours (for calculations)
 */
export function durationToHours(duration?: Duration): number {
  if (!duration?.value) return 0;

  switch (duration.unit) {
    case 'minutes':
      return duration.value / 60;
    case 'hours':
      return duration.value;
    case 'days':
      return duration.value * 24;
    default:
      return duration.value; // Default to hours
  }
}

/**
 * Convert a Duration to minutes
 */
export function durationToMinutes(duration?: Duration): number {
  if (!duration?.value) return 0;

  switch (duration.unit) {
    case 'minutes':
      return duration.value;
    case 'hours':
      return duration.value * 60;
    case 'days':
      return duration.value * 24 * 60;
    default:
      return duration.value * 60; // Default to hours
  }
}

/**
 * Add duration to a date
 */
export function addDuration(date: Date | Dayjs, duration: Duration | AdvanceBookingRequired): Dayjs {
  const d = dayjs(date);
  const value = duration.value || 0;

  switch (duration.unit) {
    case 'minutes':
      return d.add(value, 'minute');
    case 'hours':
      return d.add(value, 'hour');
    case 'days':
      return d.add(value, 'day');
    default:
      return d.add(value, 'hour');
  }
}

// ============================================================================
// DATE AVAILABILITY
// ============================================================================

/**
 * Get the minimum bookable date based on advance booking requirement
 */
export function getMinBookableDate(item: Item): Dayjs {
  const now = dayjs();

  if (item.advanceBookingRequired?.value) {
    return addDuration(now, item.advanceBookingRequired);
  }

  return now;
}

/**
 * Get bookable date range
 */
export function getBookableDateRange(item: Item): { minDate: Date; maxDate: Date } {
  const minDate = getMinBookableDate(item).toDate();
  const maxDate = dayjs().add(3, 'month').toDate(); // 3 months ahead

  return { minDate, maxDate };
}

/**
 * Check if a specific day of week is within studio operating days
 * Handles both English and Hebrew day names in the database
 */
export function isStudioOpenOnDay(date: Dayjs, studioAvailability?: StudioAvailability): boolean {
  if (!studioAvailability?.days?.length) {
    return true; // If no days configured, assume all days open
  }

  const dayName = date.locale('en').format('dddd') as DayOfWeek;
  return findDayIndex(dayName, studioAvailability.days) !== -1;
}

/**
 * Get the opening and closing times for a specific day
 * Handles both English and Hebrew day names in the database
 */
export function getStudioTimesForDay(
  date: Dayjs,
  studioAvailability?: StudioAvailability
): { start: string; end: string } | null {
  if (!studioAvailability?.days?.length || !studioAvailability?.times?.length) {
    return null; // No schedule configured
  }

  const dayName = date.locale('en').format('dddd') as DayOfWeek;
  const dayIndex = findDayIndex(dayName, studioAvailability.days);

  if (dayIndex === -1) {
    return null; // Studio closed on this day
  }

  return studioAvailability.times[dayIndex] || null;
}

/**
 * Get the closing hour for a specific day (as number)
 * For 24-hour operations (06:00-05:59), returns 30 (6am + 24 hours)
 */
export function getClosingHourForDay(date: Dayjs, studioAvailability?: StudioAvailability): number {
  const times = getStudioTimesForDay(date, studioAvailability);
  if (!times?.end) {
    return 30; // Default to 24-hour operation (6am to 6am)
  }

  const startHour = parseInt(times.start?.split(':')[0] || '0');
  const endHour = parseInt(times.end.split(':')[0]);

  // Handle legacy 24-hour format (00:00-23:59)
  if (times.end === '23:59') {
    return 24;
  }

  // Handle new 24-hour format (06:00-05:59)
  // When start is 06:00 and end is 05:59, it's a 24-hour operation
  if (times.start === '06:00' && times.end === '05:59') {
    return 30; // 6am + 24 hours (wraps to next day 6am)
  }

  // Handle wraparound cases (end < start means next day)
  if (endHour < startHour) {
    return endHour + 24; // e.g., 18:00-02:00 → closing at 26 (2am next day)
  }

  return endHour;
}

/**
 * Check if a date meets the advance booking requirement
 */
export function meetsAdvanceBookingRequirement(date: Dayjs, item: Item): boolean {
  if (!item.advanceBookingRequired?.value) {
    return true;
  }

  const minDate = getMinBookableDate(item);
  return date.isAfter(minDate) || date.isSame(minDate, 'day');
}

/**
 * Check if a specific date is bookable
 */
export function isDateBookable(date: Dayjs, context: AvailabilityContext): DateAvailabilityResult {
  const { item, studio } = context;

  // 1. Check studio operating days
  if (!isStudioOpenOnDay(date, studio?.studioAvailability)) {
    return { isBookable: false, availableSlots: [], reason: 'closed' };
  }

  // 2. Check advance booking requirement
  if (!meetsAdvanceBookingRequirement(date, item)) {
    return { isBookable: false, availableSlots: [], reason: 'advance_booking' };
  }

  // 3. Check if there are available slots
  const availableSlots = getAvailableSlotsForDate(date, context);

  if (availableSlots.length === 0) {
    return { isBookable: false, availableSlots: [], reason: 'no_slots' };
  }

  // 4. Check minimum booking duration can be satisfied
  const minHours = Math.ceil(durationToHours(item.minimumBookingDuration)) || 1;
  const hasEnoughConsecutive = availableSlots.some((slot) => {
    const consecutive = getMaxConsecutiveHours(slot, availableSlots);
    return consecutive >= minHours;
  });

  if (!hasEnoughConsecutive) {
    return { isBookable: false, availableSlots, reason: 'min_duration' };
  }

  return { isBookable: true, availableSlots };
}

// ============================================================================
// TIME SLOT AVAILABILITY
// ============================================================================

/**
 * Generate hour slots from studio time ranges
 * Handles wraparound for 24-hour operations (e.g., 06:00-05:59)
 */
export function generateHoursFromTimeRanges(times?: { start: string; end: string }[]): string[] {
  if (!times || times.length === 0) {
    // Default 24-hour availability starting from 06:00
    return Array.from({ length: 24 }, (_, i) => `${String((i + 6) % 24).padStart(2, '0')}:00`);
  }

  const hours: string[] = [];

  for (const range of times) {
    const startHour = parseInt(range.start?.split(':')[0] || '0');
    // Handle special end times
    let endHour: number;
    if (range.end === '23:59') {
      endHour = 24; // Allow booking at 23:00
    } else if (range.end === '05:59' && startHour === 6) {
      // 24-hour operation starting at 6am - generate all 24 hours
      endHour = 30; // 6am + 24 hours (wraps around)
    } else {
      endHour = parseInt(range.end?.split(':')[0] || '24');
    }

    // Check if this is a wraparound range (start > end in normal terms)
    if (startHour > endHour && endHour < 24) {
      // Wraparound: generate from start to midnight, then midnight to end
      // e.g., 18:00 to 06:00 → 18,19,20,21,22,23,00,01,02,03,04,05
      for (let hour = startHour; hour < 24; hour++) {
        const slot = `${String(hour).padStart(2, '0')}:00`;
        if (!hours.includes(slot)) hours.push(slot);
      }
      for (let hour = 0; hour < endHour; hour++) {
        const slot = `${String(hour).padStart(2, '0')}:00`;
        if (!hours.includes(slot)) hours.push(slot);
      }
    } else {
      // Normal range or extended range (endHour >= 24 for 24-hour ops)
      for (let hour = startHour; hour < endHour; hour++) {
        const normalizedHour = hour % 24;
        const slot = `${String(normalizedHour).padStart(2, '0')}:00`;
        if (!hours.includes(slot)) hours.push(slot);
      }
    }
  }

  // Sort in display order (06:00 first, then 07:00, ..., 23:00, 00:00, ..., 05:00)
  hours.sort((a, b) => {
    const hourA = parseInt(a.split(':')[0]);
    const hourB = parseInt(b.split(':')[0]);
    // Shift hours so 06 becomes 0, 07 becomes 1, etc.
    const shiftedA = (hourA - 6 + 24) % 24;
    const shiftedB = (hourB - 6 + 24) % 24;
    return shiftedA - shiftedB;
  });

  return hours.length > 0 ? hours : Array.from({ length: 24 }, (_, i) => `${String((i + 6) % 24).padStart(2, '0')}:00`);
}

/**
 * Get slots that should be blocked due to preparation time buffer
 */
export function getPreparationTimeBuffer(bookedSlots: string[], prepTime?: Duration): string[] {
  if (!prepTime?.value || bookedSlots.length === 0) {
    return [];
  }

  const bufferMinutes = durationToMinutes(prepTime);
  const bufferHours = Math.ceil(bufferMinutes / 60);
  const bufferedSlots: string[] = [];

  // Sort booked slots to find ranges
  const sorted = [...bookedSlots].sort();

  if (sorted.length === 0) return [];

  // Get first and last booked slot
  const firstSlot = sorted[0];
  const lastSlot = sorted[sorted.length - 1];

  const firstHour = parseInt(firstSlot.split(':')[0]);
  const lastHour = parseInt(lastSlot.split(':')[0]);

  // Block hours BEFORE the first booked slot
  for (let i = 1; i <= bufferHours; i++) {
    const bufferHour = firstHour - i;
    if (bufferHour >= 0) {
      bufferedSlots.push(`${String(bufferHour).padStart(2, '0')}:00`);
    }
  }

  // Block hours AFTER the last booked slot
  for (let i = 1; i <= bufferHours; i++) {
    const bufferHour = lastHour + 1 + i; // +1 because the slot itself takes an hour
    if (bufferHour < 24) {
      bufferedSlots.push(`${String(bufferHour).padStart(2, '0')}:00`);
    }
  }

  return bufferedSlots;
}

/**
 * Get available time slots for a specific date
 */
export function getAvailableSlotsForDate(date: Dayjs, context: AvailabilityContext): string[] {
  const { item, studio } = context;
  const dateStr = date.format('DD/MM/YYYY');

  // 1. Start with studio operating hours for this specific day
  const dayTimes = getStudioTimesForDay(date, studio?.studioAvailability);
  let availableSlots = dayTimes
    ? generateHoursFromTimeRanges([dayTimes])
    : generateHoursFromTimeRanges(studio?.studioAvailability?.times);

  // 2. Get item's availability for this date
  const itemDateAvail = item.availability?.find((a) => a.date === dateStr);

  if (itemDateAvail) {
    // Item has specific availability for this date - use those times
    availableSlots = availableSlots.filter((slot) => itemDateAvail.times.includes(slot));
  }
  // If no item availability entry exists, all studio hours are available

  // 3. Apply preparation time buffer if there are booked slots
  // (Booked slots are times NOT in the itemDateAvail.times array)
  if (item.preparationTime?.value && itemDateAvail) {
    const allStudioSlots = dayTimes
      ? generateHoursFromTimeRanges([dayTimes])
      : generateHoursFromTimeRanges(studio?.studioAvailability?.times);
    const bookedSlots = allStudioSlots.filter((slot) => !itemDateAvail.times.includes(slot));
    const bufferSlots = getPreparationTimeBuffer(bookedSlots, item.preparationTime);
    availableSlots = availableSlots.filter((slot) => !bufferSlots.includes(slot));
  }

  // 4. Check advance booking for same-day bookings
  const now = dayjs();
  if (date.isSame(now, 'day') && item.advanceBookingRequired?.value) {
    const minTime = addDuration(now, item.advanceBookingRequired);
    const minHour = minTime.hour();
    availableSlots = availableSlots.filter((slot) => {
      const slotHour = parseInt(slot.split(':')[0]);
      return slotHour >= minHour;
    });
  }

  // Note: Minimum booking duration filtering is NOT done here.
  // It's handled by shouldDisableTime which uses getMaxConsecutiveHours
  // to check if enough consecutive slots are available from each start time.
  // This allows the consecutive check to see ALL available slots up to closing.

  return availableSlots;
}

/**
 * Check if two time slots are consecutive (1 hour apart)
 */
export function areConsecutiveSlots(slot1: string, slot2: string): boolean {
  const hour1 = parseInt(slot1.split(':')[0]);
  const hour2 = parseInt(slot2.split(':')[0]);
  // Normal consecutive: 08:00 → 09:00
  if (hour2 - hour1 === 1) return true;
  // Midnight wraparound: 23:00 → 00:00
  if (hour1 === 23 && hour2 === 0) return true;
  return false;
}

/**
 * Get maximum consecutive hours available from a start time
 * Handles overnight ranges (e.g., 17:00-06:00) correctly
 */
export function getMaxConsecutiveHours(startSlot: string, availableSlots: string[]): number {
  if (!availableSlots.includes(startSlot)) return 0;

  // Sort slots in chronological order, handling midnight wraparound
  // Detect if this is an overnight range by checking if we have both late and early hours
  const hours = availableSlots.map((s) => parseInt(s.split(':')[0]));
  const hasLateHours = hours.some((h) => h >= 17);
  const hasEarlyHours = hours.some((h) => h < 6);
  const isOvernightRange = hasLateHours && hasEarlyHours;

  let sortedSlots: string[];
  if (isOvernightRange) {
    // For overnight ranges, sort so late hours come before early hours
    // e.g., 17, 18, 19, 20, 21, 22, 23, 00, 01, 02, 03, 04, 05
    sortedSlots = [...availableSlots].sort((a, b) => {
      const hourA = parseInt(a.split(':')[0]);
      const hourB = parseInt(b.split(':')[0]);
      // Shift hours: treat 00-05 as 24-29 for sorting
      const adjustedA = hourA < 6 ? hourA + 24 : hourA;
      const adjustedB = hourB < 6 ? hourB + 24 : hourB;
      return adjustedA - adjustedB;
    });
  } else {
    // For normal ranges, simple numeric sort
    sortedSlots = [...availableSlots].sort((a, b) => {
      return parseInt(a.split(':')[0]) - parseInt(b.split(':')[0]);
    });
  }

  const startIndex = sortedSlots.indexOf(startSlot);
  if (startIndex === -1) return 0;

  let consecutive = 1;

  for (let i = startIndex + 1; i < sortedSlots.length; i++) {
    if (areConsecutiveSlots(sortedSlots[i - 1], sortedSlots[i])) {
      consecutive++;
    } else {
      break;
    }
  }

  return consecutive;
}

/**
 * Filter slots that can accommodate minimum booking duration
 */
export function filterSlotsByMinimumDuration(availableSlots: string[], minHours: number): string[] {
  if (minHours <= 1) return availableSlots;

  return availableSlots.filter((slot) => {
    const consecutive = getMaxConsecutiveHours(slot, availableSlots);
    return consecutive >= minHours;
  });
}

/**
 * Get available time slots with metadata
 */
export function getTimeSlotsWithMetadata(date: Dayjs, context: AvailabilityContext): TimeSlotResult[] {
  const availableSlots = getAvailableSlotsForDate(date, context);
  const allStudioSlots = generateHoursFromTimeRanges(context.studio?.studioAvailability?.times);

  return allStudioSlots.map((slot) => {
    const isAvailable = availableSlots.includes(slot);
    const maxConsecutiveHours = isAvailable ? getMaxConsecutiveHours(slot, availableSlots) : 0;

    return {
      slot,
      isAvailable,
      maxConsecutiveHours
    };
  });
}

// ============================================================================
// DURATION CONSTRAINTS
// ============================================================================

/**
 * Get minimum bookable hours for an item
 */
export function getMinimumHours(item: Item): number {
  if (!item.minimumBookingDuration?.value) {
    return 1;
  }

  return Math.ceil(durationToHours(item.minimumBookingDuration));
}

/**
 * Get maximum bookable hours for an item at a specific start time
 */
export function getMaximumHours(startSlot: string, date: Dayjs, context: AvailabilityContext): number {
  const { item } = context;
  const availableSlots = getAvailableSlotsForDate(date, context);

  // Get consecutive available hours from start time
  const maxConsecutive = getMaxConsecutiveHours(startSlot, availableSlots);

  // Apply maxQuantityPerBooking cap if set
  if (item.maxQuantityPerBooking) {
    return Math.min(maxConsecutive, item.maxQuantityPerBooking);
  }

  return maxConsecutive;
}

/**
 * Validate if a booking request is valid
 */
export function validateBookingRequest(
  date: Dayjs,
  startSlot: string,
  hours: number,
  context: AvailabilityContext
): { valid: boolean; error?: string } {
  const { item } = context;

  // Check date is bookable
  const dateResult = isDateBookable(date, context);
  if (!dateResult.isBookable) {
    return { valid: false, error: `Date not available: ${dateResult.reason}` };
  }

  // Check start slot is available
  const availableSlots = dateResult.availableSlots;
  if (!availableSlots.includes(startSlot)) {
    return { valid: false, error: 'Selected time slot is not available' };
  }

  // Check minimum duration
  const minHours = getMinimumHours(item);
  if (hours < minHours) {
    return { valid: false, error: `Minimum booking is ${minHours} hour(s)` };
  }

  // Check maximum duration
  const maxHours = getMaximumHours(startSlot, date, context);
  if (hours > maxHours) {
    return { valid: false, error: `Maximum available hours from this time is ${maxHours}` };
  }

  // Check all required slots are available
  const requiredSlots = generateRequiredSlots(startSlot, hours);
  const allSlotsAvailable = requiredSlots.every((slot) => availableSlots.includes(slot));
  if (!allSlotsAvailable) {
    return { valid: false, error: 'Not all requested time slots are available' };
  }

  return { valid: true };
}

/**
 * Generate array of consecutive slots from a start time
 */
export function generateRequiredSlots(startSlot: string, hours: number): string[] {
  const startHour = parseInt(startSlot.split(':')[0]);
  const slots: string[] = [];

  for (let i = 0; i < hours; i++) {
    const hour = startHour + i;
    if (hour < 24) {
      slots.push(`${String(hour).padStart(2, '0')}:00`);
    }
  }

  return slots;
}

// ============================================================================
// PICKER HELPERS (for MUI DateTimePicker integration)
// ============================================================================

/**
 * Should disable date callback for MUI DateTimePicker
 */
export function createShouldDisableDate(context: AvailabilityContext) {
  return (date: Dayjs): boolean => {
    const result = isDateBookable(date, context);
    return !result.isBookable;
  };
}

/**
 * Should disable time callback for MUI DateTimePicker
 */
export function createShouldDisableTime(selectedDate: Dayjs | null, context: AvailabilityContext) {
  return (value: Dayjs, view: 'hours' | 'minutes' | 'seconds'): boolean => {
    if (view === 'minutes' || view === 'seconds') return false;
    if (!selectedDate) return true;

    const availableSlots = getAvailableSlotsForDate(selectedDate, context);
    const slotStr = value.format('HH:00');

    // Check if slot is available
    if (!availableSlots.includes(slotStr)) {
      return true;
    }

    // Check if slot can accommodate minimum duration
    const minHours = getMinimumHours(context.item);
    if (minHours > 1) {
      const maxConsecutive = getMaxConsecutiveHours(slotStr, availableSlots);
      if (maxConsecutive < minHours) {
        return true;
      }
    }

    return false;
  };
}
