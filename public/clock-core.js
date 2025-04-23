
export const SCALE_AH = 23/24;

export function getAngles(date) {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  
  const secondAngle = (seconds * 6) * SCALE_AH;
  const minuteAngle = (minutes * 6 + seconds * 0.1) * SCALE_AH;
  const hourAngle = (hours * 30 + minutes * 0.5) * SCALE_AH;
  
  return { hourAngle, minuteAngle, secondAngle };
}
