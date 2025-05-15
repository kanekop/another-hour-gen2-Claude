// public/clock-core.js

/**
 * Another Hour (AH) Time Core Concept for Main Clock and World Clock (23-hour cycle).
 * This factor scales real time to fit 24 hours of events into a 23-hour AH day.
 * For the first 23 real hours, time runs slightly faster.
 * The 24th real hour (23:00-00:00) is the "Another Hour".
 */
export const SCALE_AH = 24/23;

/**
 * Calculates the angles for analog clock hands and AH digital time components for the standard Main/World Clock.
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
  // ... (既存の getAngles 関数の実装はそのまま)
  // ... (念のため、Moment.jsの存在チェックはここにもあった方が良いかもしれません)
  if (typeof moment === 'undefined' || typeof moment.tz === 'undefined') {
    console.error("Moment.js and Moment Timezone are not loaded. Cannot calculate standard AH angles.");
    return { hourAngle: 0, minuteAngle: 0, secondAngle: 0, ahHours: 0, ahMinutes: 0, ahSeconds: 0 };
  }
  const localTime = moment(date).tz(timezone);
  const hours = localTime.hours(); // Real local hours (0-23)
  const minutes = localTime.minutes(); // Real local minutes (0-59)
  const seconds = localTime.seconds(); // Real local seconds (0-59)
  const milliseconds = localTime.milliseconds(); // Real local milliseconds (0-999)

  const isAHHour = hours === 23;
  const totalMs = ((hours * 3600 + minutes * 60 + seconds) * 1000 + milliseconds);
  const scaledMs = isAHHour ? totalMs : totalMs * SCALE_AH;

  let ahHours = Math.floor((scaledMs / (1000 * 3600)) % 24);
  const ahMinutes = Math.floor((scaledMs / (1000 * 60)) % 60);
  const ahSeconds = (scaledMs / 1000) % 60;

  if (isAHHour) {
    ahHours = 24;
  }

  const hourAngle = isAHHour ?
    ((minutes * 60 + seconds) * 30 / 3600) :
    (ahHours % 12) * 30 + (ahMinutes * 30 / 60); // Ensure ahHours for analog is 12h format

  const minuteAngle = isAHHour ?
    (minutes * 6 + (seconds * 6 / 60)) :
    ahMinutes * 6 + (ahSeconds * 6 / 60);

  const secondAngle = isAHHour ?
    seconds * 6 :
    ahSeconds * 6;

  return { hourAngle, minuteAngle, secondAngle, ahHours, ahMinutes, ahSeconds };
}


/**
 * Calculates the angles for analog clock hands, APH digital time components,
 * and AH sector details for the Personalized AH Clock.
 * This function implements a customizable APH day cycle.
 *
 * @param {Date} date - The current real-time Date object.
 * @param {string} timezone - The IANA timezone string.
 * @param {number} normalAphDayDurationMinutes - The duration of the "normal" part of the APH day in minutes (1 to 1439).
 * @returns {object} An object containing:
 * - {number} hourAngle - Angle for the hour hand (degrees).
 * - {number} minuteAngle - Angle for the minute hand (degrees).
 * - {number} secondAngle - Angle for the second hand (degrees).
 * - {number} aphHours - APH hours for digital display.
 * - {number} aphMinutes - APH minutes for digital display.
 * - {number} aphSeconds - APH seconds for digital display (can have decimals).
 * - {number} ahSectorStartAngleDegrees - Start angle for the AH sector on the analog dial (degrees, 0 at 12 o'clock, clockwise).
 * - {number} ahSectorSweepAngleDegrees - Sweep angle for the AH sector (degrees, max 360).
 * - {boolean} isPersonalizedAhPeriod - True if the current time is within the "Another Personalized Hour(s)" period.
 */
export function getCustomAhAngles(date, timezone, normalAphDayDurationMinutes) {
  if (typeof moment === 'undefined' || typeof moment.tz === 'undefined') {
    console.error("Moment.js and Moment Timezone are not loaded. Cannot calculate custom AH angles.");
    return {
      hourAngle: 0, minuteAngle: 0, secondAngle: 0,
      aphHours: 0, aphMinutes: 0, aphSeconds: 0,
      ahSectorStartAngleDegrees: 0, ahSectorSweepAngleDegrees: 0,
      isPersonalizedAhPeriod: false,
    };
  }

  normalAphDayDurationMinutes = Math.max(1, Math.min(normalAphDayDurationMinutes, (24 * 60) - 1));

  const localTime = moment(date).tz(timezone);
  const realHours = localTime.hours();
  const realMinutes = localTime.minutes();
  const realSeconds = localTime.seconds();
  const realMilliseconds = localTime.milliseconds();

  const realMillisecondsInDay = (realHours * 3600 + realMinutes * 60 + realSeconds) * 1000 + realMilliseconds;
  const normalAphDayDurationMs = normalAphDayDurationMinutes * 60 * 1000;

  const normalAphDayDurationHours = normalAphDayDurationMinutes / 60;
  const scaleFactor = 24 / normalAphDayDurationHours;

  let aphHoursDigital, aphMinutesDigital, aphSecondsFloat;
  const isPersonalizedAhPeriod = realMillisecondsInDay >= normalAphDayDurationMs;

  if (isPersonalizedAhPeriod) {
    aphHoursDigital = 24;
    const elapsedAphMsInPeriod = (realMillisecondsInDay - normalAphDayDurationMs) * scaleFactor;
    aphMinutesDigital = Math.floor((elapsedAphMsInPeriod / (60 * 1000)) % 60);
    aphSecondsFloat = (elapsedAphMsInPeriod / 1000) % 60;
  } else {
    const scaledMs = realMillisecondsInDay * scaleFactor;
    aphHoursDigital = Math.floor(scaledMs / (3600 * 1000));
    aphMinutesDigital = Math.floor((scaledMs / (60 * 1000)) % 60);
    aphSecondsFloat = (scaledMs / 1000) % 60;
  }

  let hourAngle;
  if (isPersonalizedAhPeriod) {
    // During APH period, hour hand represents progression from 0 (like 12 o'clock)
    // based on scaled minutes/seconds of the APH "24th" hour.
    const minutesForHourAngle = aphMinutesDigital + (aphSecondsFloat / 60);
    hourAngle = (minutesForHourAngle / 60) * 30; // Each hour on a 12h dial is 30 degrees. This maps 60 APH minutes to 30 degrees.
  } else {
    const displayAphHoursAnalog = aphHoursDigital % 12;
    const minutesForHourAngle = aphMinutesDigital + (aphSecondsFloat / 60);
    hourAngle = (displayAphHoursAnalog * 30) + (minutesForHourAngle * 0.5);
  }

  const minuteAngle = (aphMinutesDigital * 6) + (aphSecondsFloat * 0.1); // aphSecondsFloat * (6/60)
  const secondAngle = aphSecondsFloat * 6;

  const ahSectorStartAngleDegrees = (normalAphDayDurationMinutes / (24 * 60)) * 360;
  const aphPeriodDurationMinutes = (24 * 60) - normalAphDayDurationMinutes;
  const ahSectorSweepAngleDegrees = Math.min((aphPeriodDurationMinutes / (12 * 60)) * 360, 360);

  return {
    hourAngle,
    minuteAngle,
    secondAngle,
    aphHours: aphHoursDigital,
    aphMinutes: aphMinutesDigital,
    aphSeconds: aphSecondsFloat,
    ahSectorStartAngleDegrees,
    ahSectorSweepAngleDegrees,
    isPersonalizedAhPeriod,
  };
}