
import { fromAhMillis } from '/shared/ah-time.js';

const display = document.querySelector('.timer-display');
const startBtn = document.getElementById('start');
const stopBtn = document.getElementById('stop');
const resetBtn = document.getElementById('reset');
const hoursInput = document.getElementById('hours');
const minutesInput = document.getElementById('minutes');
const secondsInput = document.getElementById('seconds');

let remaining = 0;
let endTime = 0;
let intervalId = null;

function updateDisplay(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  display.textContent = `${String(hours).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}

function start() {
  const hours = parseInt(hoursInput.value) || 0;
  const minutes = parseInt(minutesInput.value) || 0;
  const seconds = parseInt(secondsInput.value) || 0;
  
  const ahMillis = (hours * 3600 + minutes * 60 + seconds) * 1000;
  const realMillis = fromAhMillis(ahMillis);
  
  endTime = Date.now() + realMillis;
  update();
  intervalId = setInterval(update, 100);
}

function update() {
  remaining = Math.max(0, endTime - Date.now());
  if (remaining <= 0) {
    clearInterval(intervalId);
    alert('Time is up!');
  }
  updateDisplay(remaining / 0.96);   // AH 秒で表示

}

startBtn.addEventListener('click', start);
stopBtn.addEventListener('click', () => {
  clearInterval(intervalId);
  remaining = Math.max(0, endTime - Date.now());
});

resetBtn.addEventListener('click', () => {
  clearInterval(intervalId);
  updateDisplay(0);
  hoursInput.value = minutesInput.value = secondsInput.value = '';
});
