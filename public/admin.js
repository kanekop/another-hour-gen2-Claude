
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

// Event listeners
document.getElementById('add-timezone').addEventListener('click', () => {
  Array.from(availableTimezones.selectedOptions).forEach(option => {
    selectedTimezones.add(option.cloneNode(true));
    availableTimezones.remove(option.index);
  });
});

document.getElementById('remove-timezone').addEventListener('click', () => {
  Array.from(selectedTimezones.selectedOptions).forEach(option => {
    availableTimezones.add(option.cloneNode(true));
    selectedTimezones.remove(option.index);
  });
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
