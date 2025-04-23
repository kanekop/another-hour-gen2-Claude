
export const SCALE_AH = 23/24;

export function getAngles(date, timezone) {
  const localTime = moment(date).tz(timezone);
  const hours = localTime.hours();
  const minutes = localTime.minutes();
  const seconds = localTime.seconds();
  
  const secondAngle = (seconds * 6) * SCALE_AH;
  const minuteAngle = (minutes * 6 + seconds * 0.1) * SCALE_AH;
  const hourAngle = (hours * 30 + minutes * 0.5) * SCALE_AH;
  
  return { hourAngle, minuteAngle, secondAngle };
}
