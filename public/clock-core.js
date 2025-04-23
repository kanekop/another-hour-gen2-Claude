
export const SCALE_AH = 24/23; // Scale factor for AH time

export function getAngles(date, timezone) {
  const localTime = moment(date).tz(timezone);
  const hours = localTime.hours();
  const minutes = localTime.minutes();
  const seconds = localTime.seconds();
  const milliseconds = localTime.milliseconds();
  
  // Calculate if we're in AH hour (10-11 PM)
  const isAHHour = hours === 22;
  
  // Calculate total milliseconds
  const totalMs = ((hours * 3600 + minutes * 60 + seconds) * 1000 + milliseconds);
  
  // If before AH hour, scale all time. During AH hour, keep normal time
  const scaledMs = hours < 22 ? totalMs * SCALE_AH : totalMs;
  
  // Convert back to hours, minutes, seconds
  const ahSeconds = (scaledMs / 1000) % 60;
  const ahMinutes = Math.floor((scaledMs / (1000 * 60)) % 60);
  const ahHours = Math.floor((scaledMs / (1000 * 3600)) % 24);
  
  // Calculate angles for hands
  const secondAngle = ahSeconds * 6;
  const minuteAngle = ahMinutes * 6 + (ahSeconds * 6 / 60);
  const hourAngle = ahHours * 30 + (ahMinutes * 30 / 60);
  
  return { hourAngle, minuteAngle, secondAngle, ahHours, ahMinutes, ahSeconds };
}
