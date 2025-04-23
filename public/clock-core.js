
export const SCALE_AH = 12/11; // Scale for 12-hour format

export function getAngles(date, timezone) {
  const localTime = moment(date).tz(timezone);
  const hours = localTime.hours() % 12;  // Convert to 12-hour format
  const minutes = localTime.minutes();
  const seconds = localTime.seconds();
  
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  const scaledSeconds = totalSeconds * SCALE_AH;
  
  const ahHours = Math.floor(scaledSeconds / 3600) % 12;
  const ahMinutes = Math.floor((scaledSeconds % 3600) / 60);
  const ahSeconds = Math.floor(scaledSeconds % 60);
  
  const secondAngle = ahSeconds * 6;
  const minuteAngle = ahMinutes * 6 + ahSeconds * 0.1;
  const hourAngle = ahHours * 30 + ahMinutes * 0.5;
  
  return { hourAngle, minuteAngle, secondAngle };
}
