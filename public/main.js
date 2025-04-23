
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
const startAngle = 255; // 23:00 (345 - 90 to adjust for SVG coordinates)
const endAngle = 270; // 24:00 (360 - 90 to adjust for SVG coordinates)
const radius = 95;
const x1 = 100 + radius * Math.cos(startAngle * Math.PI / 180);
const y1 = 100 + radius * Math.sin(startAngle * Math.PI / 180);
const x2 = 100 + radius * Math.cos(endAngle * Math.PI / 180);
const y2 = 100 + radius * Math.sin(endAngle * Math.PI / 180);
ahSector.setAttribute('d', `M 100,100 L ${x1},${y1} A ${radius},${radius} 0 0,1 ${x2},${y2} Z`);

function updateClock() {
  const now = new Date();
  const timezone = timezoneSelect.value;
  const { hourAngle, minuteAngle, secondAngle } = getAngles(now, timezone);
  
  document.getElementById('hour').style.transform = `rotate(${hourAngle}deg)`;
  document.getElementById('minute').style.transform = `rotate(${minuteAngle}deg)`;
  document.getElementById('second').style.transform = `rotate(${secondAngle}deg)`;
  
  // Update digital clock
  const digitalTime = moment().tz(timezone).format('HH:mm:ss');
  document.getElementById('digital-clock').textContent = digitalTime;
  
  requestAnimationFrame(updateClock);
}

updateClock();
