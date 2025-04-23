
const SCALE_AH = 24/23; // Scale factor for AH time

function getAngles(date, timezone) {
  const localTime = moment(date).tz(timezone);
  const hours = localTime.hours();
  const minutes = localTime.minutes();
  const seconds = localTime.seconds();
  const milliseconds = localTime.milliseconds();
  
  // Calculate total milliseconds and scale it
  const totalMs = ((hours * 3600 + minutes * 60 + seconds) * 1000 + milliseconds) * SCALE_AH;
  
  // Convert back to hours, minutes, seconds
  const ahSeconds = (totalMs / 1000) % 60;
  const ahMinutes = Math.floor((totalMs / (1000 * 60)) % 60);
  const ahHours = Math.floor((totalMs / (1000 * 3600)) % 24);
  
  // Calculate angles for hands
  const secondAngle = ahSeconds * 6;
  const minuteAngle = ahMinutes * 6 + (ahSeconds * 6 / 60);
  const hourAngle = ahHours * 30 + (ahMinutes * 30 / 60);
  
  return { hourAngle, minuteAngle, secondAngle, ahHours, ahMinutes, ahSeconds };
}

export { SCALE_AH, getAngles };
