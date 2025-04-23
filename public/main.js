
import { SCALE_AH, getAngles } from './clock-core.js';

// Initialize timezone select
const timezoneSelect = document.getElementById('timezone-select');
const userTimezone = moment.tz.guess();

// Load settings
let settings = { timezones: [userTimezone], showAHTime: true, showActualTime: true };

fetch('/api/settings')
  .then(res => res.json())
  .then(data => {
    settings = data;
    if (!settings.timezones || settings.timezones.length === 0) {
      settings.timezones = [userTimezone];
    }
    initializeTimezoneSelect();
    updateClock();
  });

function initializeTimezoneSelect() {
  // Clear existing options
  timezoneSelect.innerHTML = '';

  // Populate timezone select with UTC offsets
  const timezonesWithOffset = settings.timezones.map(timezone => ({
    name: timezone,
    offset: moment.tz(timezone).utcOffset(),
    city: timezone.split('/').pop()
  }));

  // Sort by UTC offset
  timezonesWithOffset.sort((a, b) => a.offset - b.offset);

  timezonesWithOffset.forEach(({ name, offset, city }) => {
    const offsetString = offset >= 0 ? `UTC+${offset/60}` : `UTC${offset/60}`;
    const option = document.createElement('option');
    option.value = name;
    option.text = `${city} (${offsetString})`;
    option.selected = name === userTimezone;
    timezoneSelect.appendChild(option);
  });

  // Draw tick marks
  const ticks = document.getElementById('ticks');
  ticks.innerHTML = '';
  
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
  const startAngle = 240;
  const endAngle = 270;
  const radius = 95;
  const x1 = 100 + radius * Math.cos(startAngle * Math.PI / 180);
  const y1 = 100 + radius * Math.sin(startAngle * Math.PI / 180);
  const x2 = 100 + radius * Math.cos(endAngle * Math.PI / 180);
  const y2 = 100 + radius * Math.sin(endAngle * Math.PI / 180);
  ahSector.setAttribute('d', `M 100,100 L ${x1},${y1} A ${radius},${radius} 0 0,1 ${x2},${y2} Z`);
}

function updateClock() {
  const timezone = timezoneSelect.value;
  const currentTime = moment().tz(timezone);
  const { hourAngle, minuteAngle, secondAngle, ahHours, ahMinutes, ahSeconds } = getAngles(currentTime.toDate(), timezone);

  document.getElementById('hour').style.transform = `rotate(${hourAngle}deg)`;
  document.getElementById('minute').style.transform = `rotate(${minuteAngle}deg)`;
  document.getElementById('second').style.transform = `rotate(${secondAngle}deg)`;

  // Update digital clock
  const actualTime = currentTime.format('HH:mm:ss');
  const ahTime = `${String(Math.floor(ahHours)).padStart(2, '0')}:${String(Math.floor(ahMinutes)).padStart(2, '0')}:${String(Math.floor(ahSeconds)).padStart(2, '0')}`;

  let digitalClockOutput = '';
  if (settings.showActualTime) {
    digitalClockOutput += `Actual: ${actualTime}<br>`;
  }
  if (settings.showAHTime) {
    digitalClockOutput += `AH Time: ${ahTime}`;
  }

  document.getElementById('digital-clock').innerHTML = digitalClockOutput;
  requestAnimationFrame(updateClock);
}

// Listen for timezone changes
timezoneSelect.addEventListener('change', updateClock);
