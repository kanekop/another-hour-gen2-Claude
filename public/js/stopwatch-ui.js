// public/js/stopwatch-ui.js
import { toAhMillis } from '/shared/ah-time.js';

const display = document.querySelector('.stopwatch-display');
const startBtn = document.getElementById('start');
const stopBtn = document.getElementById('stop');
const resetBtn = document.getElementById('reset');

let startTime = null;
let paused = 0;
let intervalId = null;

function updateDisplay(ahMillis) {
  const seconds = Math.floor(ahMillis / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  display.textContent = `${String(hours).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}

function update() {
  const realElapsed = Date.now() - startTime;
  updateDisplay(toAhMillis(realElapsed));
}

startBtn.addEventListener('click', () => {
  if (!intervalId) {
    startTime = Date.now();
    intervalId = setInterval(update, 100);
  }
});

stopBtn.addEventListener('click', () => {
  paused = Date.now() - startTime;
  clearInterval(intervalId);
  intervalId = null;
});

resetBtn.addEventListener('click', () => {
  clearInterval(intervalId);
  intervalId = null;
  startTime = null;
  paused = 0;
  updateDisplay(0);
});