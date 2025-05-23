// public/js/stopwatch-ui.js
// import { toAhMillis } from '/shared/ah-time.js'; // 古いインポートを削除
import { convertToScaledMs } from '/shared/ah-time.js'; // 新しいインポート
import { getCurrentScalingInfo } from './scaling-utils.js'; // 新しいユーティリティをインポート

const display = document.querySelector('.stopwatch-display');
const startBtn = document.getElementById('start');
const stopBtn = document.getElementById('stop');
const resetBtn = document.getElementById('reset');

let startTime = null;
let pausedTime = 0; // ストップウォッチが一時停止していた総時間 (real ms)
let animationFrameId = null; // requestAnimationFrame の ID
let accumulatedPausedTime = 0; // ストップ時の経過時間を保持

function formatDisplayTime(scaledMs) {
  const totalHundredths = Math.floor(scaledMs / 10); // 10ミリ秒単位 (1/100秒)
  const hundredths = String(totalHundredths % 100).padStart(2, '0'); // 秒未満の部分を2桁に

  const totalSeconds = Math.floor(scaledMs / 1000);
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  const minutes = String(Math.floor(totalSeconds / 60) % 60).padStart(2, '0');
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');

  // 仕様書に HH:MM:SS.s とあったので1/10秒表示に変更
  display.textContent = `${hours}:${minutes}:${seconds}.${hundredths.substring(0,1)}`;
}

function update() {
  if (startTime) {
    const realElapsed = Date.now() - startTime;
    const { scaleFactor } = getCurrentScalingInfo(); // 現在のスケールファクターを取得
    const scaledElapsed = convertToScaledMs(realElapsed, scaleFactor);
    formatDisplayTime(scaledElapsed);
  }
  animationFrameId = requestAnimationFrame(update);
}

startBtn.addEventListener('click', () => {
  if (!startTime) { // 初回スタートまたはリセット後のスタート
    startTime = Date.now() - accumulatedPausedTime; // 停止していた時間を考慮して開始時刻を調整
    accumulatedPausedTime = 0; //リセット
  } else if (animationFrameId === null) { // 一時停止からの再開
     startTime = Date.now() - accumulatedPausedTime;
  }

  if(animationFrameId) { // すでに動いている場合は何もしない
    return;
  }
  animationFrameId = requestAnimationFrame(update);
});

stopBtn.addEventListener('click', () => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
    if(startTime) { // startTime が null でないことを確認
        accumulatedPausedTime = Date.now() - startTime; // 停止時の実経過時間を保存
    }
  }
});

resetBtn.addEventListener('click', () => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
  startTime = null;
  accumulatedPausedTime = 0;
  formatDisplayTime(0);
});

// 初期表示
formatDisplayTime(0);