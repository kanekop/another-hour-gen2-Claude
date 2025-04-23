
export function getAngles(date, timezone) {
  const localTime = moment(date).tz(timezone);
  const hours = localTime.hours() % 12;  // Convert to 12-hour format
  const minutes = localTime.minutes();
  const seconds = localTime.seconds();
  
  const secondAngle = seconds * 6;
  const minuteAngle = minutes * 6 + seconds * 0.1;
  const hourAngle = hours * 30 + minutes * 0.5;
  
  return { hourAngle, minuteAngle, secondAngle };
}
