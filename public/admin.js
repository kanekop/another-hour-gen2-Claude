
const availableTimezones = document.getElementById('available-timezones');
const selectedTimezones = document.getElementById('selected-timezones');
const showAHTime = document.getElementById('show-ah-time');
const showActualTime = document.getElementById('show-actual-time');

// Load current settings
let settings = { timezones: [], showAHTime: true, showActualTime: true };

fetch('/api/settings')
  .then(res => res.json())
  .then(data => {
    settings = data;
    initializeTimezones();
    showAHTime.checked = settings.showAHTime;
    showActualTime.checked = settings.showActualTime;
  });

// Initialize timezone lists
function initializeTimezones() {
  const allTimezones = moment.tz.names()
    .map(tz => ({
      value: tz,
      text: `${tz.split('/').pop().replace(/_/g, ' ')} (UTC${moment.tz(tz).format('Z')})`
    }))
    .sort((a, b) => a.text.localeCompare(b.text));

  availableTimezones.innerHTML = '';
  selectedTimezones.innerHTML = '';

  allTimezones.forEach(({ value, text }) => {
    const option = new Option(text, value);
    if (settings.timezones.includes(value)) {
      selectedTimezones.add(option.cloneNode(true));
    } else {
      availableTimezones.add(option);
    }
  });
}

// Initialize checkboxes
showAHTime.checked = settings.showAHTime;
showActualTime.checked = settings.showActualTime;

// Move timezone functions
function moveToSelected(option) {
  selectedTimezones.add(option.cloneNode(true));
  availableTimezones.remove(option.index);
}

function moveToAvailable(option) {
  availableTimezones.add(option.cloneNode(true));
  selectedTimezones.remove(option.index);
}

// Event listeners
document.getElementById('add-timezone').addEventListener('click', () => {
  Array.from(availableTimezones.selectedOptions).forEach(moveToSelected);
});

document.getElementById('remove-timezone').addEventListener('click', () => {
  Array.from(selectedTimezones.selectedOptions).forEach(moveToAvailable);
});

// Double-click handlers
availableTimezones.addEventListener('dblclick', (e) => {
  if (e.target.tagName === 'OPTION') {
    moveToSelected(e.target);
  }
});

selectedTimezones.addEventListener('dblclick', (e) => {
  if (e.target.tagName === 'OPTION') {
    moveToAvailable(e.target);
  }
});

document.getElementById('save-settings').addEventListener('click', () => {
  settings = {
    timezones: Array.from(selectedTimezones.options).map(opt => opt.value),
    showAHTime: showAHTime.checked,
    showActualTime: showActualTime.checked
  };
  fetch('/api/settings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings)
  }).then(() => alert('Settings saved!'));
});

initializeTimezones();
