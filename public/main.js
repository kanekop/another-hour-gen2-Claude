
import { SCALE_AH, getAngles } from './clock-core.js';

// Populate timezone select
const timezoneSelect = document.getElementById('timezone-select');
const timezones = moment.tz.names();
const userTimezone = moment.tz.guess();

timezones.forEach(timezone => {
  const option = document.createElement('option');
  option.value = timezone;
  option.text = timezone;
  option.selected = timezone === userTimezone;
  timezoneSelect.appendChild(option);
});

// Draw tick marks
const ticks = document.getElementById('ticks');
for (let i = 0; i < 60; i++) {
  const angle = i * 6;
  const isMajor = i % 5 === 0;
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  const radius = 95;
  const length = isMajor ? 10 : 5;
  
  line.setAttribute('class', `tick ${isMajor ? 'major' : ''}`);
  line.setAttribute('x1', 100 + Math.sin(angle * Math.PI / 180) * (radius - length));
  line.setAttribute('y1', 100 - Math.cos(angle * Math.PI / 180) * (radius - length));
  line.setAttribute('x2', 100 + Math.sin(angle * Math.PI / 180) * radius);
  line.setAttribute('y2', 100 - Math.cos(angle * Math.PI / 180) * radius);
  
  ticks.appendChild(line);
}

// Draw AH sector
const ahSector = document.getElementById('ah-sector');
const startAngle = 240; // 11:00 (330 - 90 to adjust for SVG coordinates)
const endAngle = 270; // 12:00 (360 - 90 to adjust for SVG coordinates)
const radius = 95;
const x1 = 100 + radius * Math.cos(startAngle * Math.PI / 180);
const y1 = 100 + radius * Math.sin(startAngle * Math.PI / 180);
const x2 = 100 + radius * Math.cos(endAngle * Math.PI / 180);
const y2 = 100 + radius * Math.sin(endAngle * Math.PI / 180);
ahSector.setAttribute('d', `M 100,100 L ${x1},${y1} A ${radius},${radius} 0 0,1 ${x2},${y2} Z`);

function updateClock() {
  const timezone = timezoneSelect.value;
  const now = moment().tz(timezone);
  const { hourAngle, minuteAngle, secondAngle } = getAngles(now.toDate(), timezone);
  
  document.getElementById('hour').style.transform = `rotate(${hourAngle}deg)`;
  document.getElementById('minute').style.transform = `rotate(${minuteAngle}deg)`;
  document.getElementById('second').style.transform = `rotate(${secondAngle}deg)`;
  
  // Update digital clock
  const actualTime = now.format('HH:mm:ss');
  
  // Calculate AH time (scaled by 24/23)
  const totalSeconds = now.hours() * 3600 + now.minutes() * 60 + now.seconds();
  const scaledSeconds = totalSeconds * (24/23); // Scale up instead of down
  const ahHours = Math.floor(scaledSeconds / 3600);
  const ahMinutes = Math.floor((scaledSeconds % 3600) / 60);
  const ahSeconds = Math.floor(scaledSeconds % 60);
  const ahTime = `${String(ahHours).padStart(2, '0')}:${String(ahMinutes).padStart(2, '0')}:${String(ahSeconds).padStart(2, '0')}`;
  
  document.getElementById('digital-clock').innerHTML = `
    Actual: ${actualTime}<br>
    AH Time: ${ahTime}
  `;
  
  requestAnimationFrame(updateClock);
}

updateClock();
