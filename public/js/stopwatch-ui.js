
const display = document.querySelector('.stopwatch-display');
const startBtn = document.getElementById('start');
const stopBtn = document.getElementById('stop');
const resetBtn = document.getElementById('reset');

let startTime = null;
let running = false;
let intervalId = null;

function updateDisplay(ahMillis) {
  const seconds = Math.floor(ahMillis / 1000);
  const tenths = Math.floor((ahMillis % 1000) / 100);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  display.textContent = `${String(hours).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}.${tenths}`;
}

function update() {
  fetch(`/api/stopwatch/elapsed?start=${startTime}`)
    .then(res => res.json())
    .then(data => updateDisplay(data.elapsedAh));
}

startBtn.addEventListener('click', () => {
  if (!running) {
    startTime = startTime || Date.now();
    running = true;
    intervalId = setInterval(update, 100);
  }
});

stopBtn.addEventListener('click', () => {
  running = false;
  clearInterval(intervalId);
});

resetBtn.addEventListener('click', () => {
  running = false;
  clearInterval(intervalId);
  startTime = null;
  updateDisplay(0);
});
