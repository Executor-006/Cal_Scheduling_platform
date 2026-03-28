const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Generate available time slots for a given date.
 *
 * @param {string} date - The date string (YYYY-MM-DD)
 * @param {number} duration - Event duration in minutes
 * @param {number} bufferTime - Buffer time between slots in minutes
 * @param {object} availability - { start_time, end_time } for that day
 * @param {Array} existingBookings - Confirmed bookings for that day
 * @param {string} userTimezone - The event owner's timezone
 * @param {string} bookerTimezone - The booker's timezone (for display)
 * @returns {Array} Available time slots
 */
function generateSlots(date, duration, bufferTime, availability, existingBookings, userTimezone, bookerTimezone) {
  if (!availability) return [];

  const { start_time, end_time } = availability;
  const buffer = bufferTime || 0;

  // Build the start and end times in the user's timezone
  const dayStart = dayjs.tz(`${date} ${start_time}`, userTimezone);
  const dayEnd = dayjs.tz(`${date} ${end_time}`, userTimezone);

  const now = dayjs();
  const slots = [];

  // Step size = duration + buffer for spacing between slot starts
  const stepSize = duration + buffer;

  let current = dayStart;
  while (current.add(duration, 'minute').isBefore(dayEnd) || current.add(duration, 'minute').isSame(dayEnd)) {
    const slotStart = current;
    const slotEnd = current.add(duration, 'minute');

    // Skip past slots
    if (slotStart.isBefore(now)) {
      current = current.add(stepSize, 'minute');
      continue;
    }

    // Check overlap with existing bookings (including buffer around bookings)
    const isBooked = existingBookings.some((booking) => {
      const bookingStart = dayjs(booking.start_time).subtract(buffer, 'minute');
      const bookingEnd = dayjs(booking.end_time).add(buffer, 'minute');
      return slotStart.isBefore(bookingEnd) && slotEnd.isAfter(bookingStart);
    });

    if (!isBooked) {
      slots.push({
        time: slotStart.tz(bookerTimezone).format('HH:mm'),
        utc: slotStart.utc().toISOString(),
      });
    }

    current = current.add(stepSize, 'minute');
  }

  return slots;
}

module.exports = { generateSlots };
