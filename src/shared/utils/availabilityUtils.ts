import dayjs, { Dayjs } from 'dayjs';
import { Item, Studio } from 'src/types/index';
import { Duration, AdvanceBookingRequired } from 'src/types/item';
import { DayOfWeek, StudioAvailability } from 'src/types/studio';

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
 */
export function isStudioOpenOnDay(date: Dayjs, studioAvailability?: StudioAvailability): boolean {
  if (!studioAvailability?.days?.length) {
    return true; // If no days configured, assume all days open
  }

  const dayName = date.locale('en').format('dddd') as DayOfWeek;
  return studioAvailability.days.includes(dayName);
}

/**
 * Get the opening and closing times for a specific day
 */
export function getStudioTimesForDay(date: Dayjs, studioAvailability?: StudioAvailability): { start: string; end: string } | null {
  if (!studioAvailability?.days?.length || !studioAvailability?.times?.length) {
    return null; // No schedule configured
  }

  const dayName = date.locale('en').format('dddd') as DayOfWeek;
  const dayIndex = studioAvailability.days.indexOf(dayName);
  
  if (dayIndex === -1) {
    return null; // Studio closed on this day
  }

  return studioAvailability.times[dayIndex] || null;
}

/**
 * Get the closing hour for a specific day (as number)
 */
export function getClosingHourForDay(date: Dayjs, studioAvailability?: StudioAvailability): number {
  const times = getStudioTimesForDay(date, studioAvailability);
  if (!times?.end) {
    return 24; // Default to midnight if no closing time
  }
  
  const endHour = parseInt(times.end.split(':')[0]);
  // Handle 23:59 as effectively 24:00 (midnight)
  if (times.end === '23:59') {
    return 24;
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
 */
export function generateHoursFromTimeRanges(times?: { start: string; end: string }[]): string[] {
  if (!times || times.length === 0) {
    // Default 24-hour availability
    return Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);
  }

  const hours: string[] = [];

  for (const range of times) {
    const startHour = parseInt(range.start?.split(':')[0] || '0');
    // Handle 23:59 as effectively 24:00 (allow booking at 23:00)
    const endHour = range.end === '23:59' ? 24 : parseInt(range.end?.split(':')[0] || '24');

    for (let hour = startHour; hour < endHour; hour++) {
      const slot = `${String(hour).padStart(2, '0')}:00`;
      if (!hours.includes(slot)) {
        hours.push(slot);
      }
    }
  }

  hours.sort();
  return hours.length > 0 ? hours : Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);
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
  return hour2 - hour1 === 1;
}

/**
 * Get maximum consecutive hours available from a start time
 */
export function getMaxConsecutiveHours(startSlot: string, availableSlots: string[]): number {
  const sortedSlots = [...availableSlots].sort();
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
