
export const SCALE_AH = 24/23;

export function getAngles(date, timezone) {
  const localTime = moment(date).tz(timezone);
  const hours = localTime.hours();
  const minutes = localTime.minutes();
  const seconds = localTime.seconds();
  const milliseconds = localTime.milliseconds();
  
  // Calculate if we're in AH hour (23:00-24:00)
  const isAHHour = hours === 23;
  
  // Calculate total milliseconds and scale it 
  const totalMs = ((hours * 3600 + minutes * 60 + seconds) * 1000 + milliseconds);
  const scaledMs = isAHHour ? totalMs : totalMs * SCALE_AH;
  
  // Convert back to hours, minutes, seconds
  const ahSeconds = (scaledMs / 1000) % 60;
  const ahMinutes = Math.floor((scaledMs / (1000 * 60)) % 60);
  let ahHours = Math.floor((scaledMs / (1000 * 3600)) % 24);
  
  // Special handling for AH hour digital display
  if (isAHHour) {
    ahHours = 24; // Show as 24:00-25:00 for digital display
  }
  
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
