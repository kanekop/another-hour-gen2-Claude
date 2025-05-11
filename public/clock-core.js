/**
 * Another Hour (AH) Time SCore Concept for Main Clock and World Clock (23-hour cycle).
 * This factor scales real time to fit 24 hours of events into a 23-hour AH day.
 * For the first 23 real hours, time runs slightly faster.
 * The 24th real hour (23:00-00:00) is the "Another Hour".
 */

export const SCALE_AH = 24/23;

/**
 * Calculates the angles for analog clock hands and AH digital time components.
 * This function implements the 23-hour day cycle for the main clock and world clocks.
 *
 * @param {Date} date - The current real-time Date object.
 * @param {string} timezone - The IANA timezone string.
 * @returns {object} An object containing:
 * - {number} hourAngle - Angle for the hour hand.
 * - {number} minuteAngle - Angle for the minute hand.
 * - {number} secondAngle - Angle for the second hand.
 * - {number} ahHours - AH hours for digital display.
 * - {number} ahMinutes - AH minutes for digital display.
 * - {number} ahSeconds - AH seconds for digital display.
 */

export function getAngles(date, timezone) {
  const localTime = moment(date).tz(timezone);
  const hours = localTime.hours(); // Real local hours (0-23)
  const minutes = localTime.minutes(); // Real local minutes (0-59)
  const seconds = localTime.seconds(); // Real local seconds (0-59)
  const milliseconds = localTime.milliseconds(); // Real local milliseconds (0-999)
  
  // Determine if the current real local time is within the "Another Hour" period (23:00:00 to 23:59:59.999 real time).
  const isAHHour = hours === 23;
  
  // Calculate total milliseconds from the beginning of the day in real local time.
  const totalMs = ((hours * 3600 + minutes * 60 + seconds) * 1000 + milliseconds);

  // Scale the milliseconds for AH time calculation.
  // If it's the "Another Hour" (real 23:xx), time scaling is NOT applied to ms for AH digital display logic to correctly show 24.xx.
  // For the other 23 real hours, time is sped up by SCALE_AH.
  // However, for analog display during AH hour, this scaledMs is not directly used for hour hand calculation.
  const scaledMs = isAHHour ? totalMs : totalMs * SCALE_AH;
  
  // Convert scaled milliseconds back to AH hours, minutes, and seconds for digital display.
  let ahHours = Math.floor((scaledMs / (1000 * 3600)) % 24);
  const ahMinutes = Math.floor((scaledMs / (1000 * 60)) % 60);
  const ahSeconds = (scaledMs / 1000) % 60; // Keep fractional for potential smoother digital second display if needed later

  // Special handling for digital display during the "Another Hour":
  // Show AH hours as 24 (e.g., 24:15 instead of 00:15 of the next AH day during the real 23:xx hour).
  if (isAHHour) {
    ahHours = 24;
  }

  // Calculate analog hand angles:  
  // For analog display during AH hour, show hands at 0:00-1:00
  const hourAngle = isAHHour ? 
    ((minutes * 60 + seconds) * 30 / 3600) : // Map 23:00-24:00 to 0:00-1:00
    ahHours * 30 + (ahMinutes * 30 / 60);
    
  const minuteAngle = isAHHour ?
    (minutes * 6 + (seconds * 6 / 60)) : // Regular minutes during AH hour
    ahMinutes * 6 + (ahSeconds * 6 / 60);
    
  const secondAngle = isAHHour ?
    seconds * 6 : // Regular seconds during AH hour
    ahSeconds * 6;
  
  return { hourAngle, minuteAngle, secondAngle, ahHours, ahMinutes, ahSeconds };
}
