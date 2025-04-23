
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
const startAngle = 345; // 23:00
const endAngle = 360; // 24:00
const radius = 95;
const x1 = 100 + radius * Math.cos((360 - startAngle) * Math.PI / 180);
const y1 = 100 + radius * Math.sin((360 - startAngle) * Math.PI / 180);
const x2 = 100 + radius * Math.cos((360 - endAngle) * Math.PI / 180);
const y2 = 100 + radius * Math.sin((360 - endAngle) * Math.PI / 180);
ahSector.setAttribute('d', `M 100,100 L ${x1},${y1} A ${radius},${radius} 0 0,1 ${x2},${y2} Z`);

function updateClock() {
  const now = new Date();
  const timezone = timezoneSelect.value;
  const { hourAngle, minuteAngle, secondAngle } = getAngles(now, timezone);
  
  document.getElementById('hour').style.transform = `rotate(${hourAngle}deg)`;
  document.getElementById('minute').style.transform = `rotate(${minuteAngle}deg)`;
  document.getElementById('second').style.transform = `rotate(${secondAngle}deg)`;
  
  requestAnimationFrame(updateClock);
}

updateClock();
