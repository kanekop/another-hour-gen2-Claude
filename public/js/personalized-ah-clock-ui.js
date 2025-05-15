// public/js/personalized-ah-clock-ui.js

import { getCustomAhAngles } from '../clock-core.js';
import { getDisplayTimezones, getUserLocalTimezone, getCityNameByTimezone } from './timezone-manager.js';

// DOM Elements
const elements = {
  normalDurationSlider: document.getElementById('normal-duration-slider'),
  normalDurationDisplay: document.getElementById('normal-duration-display'),
  timezoneSelect: document.getElementById('timezone-select'),
  cityNameDisplay: document.getElementById('personalized-ah-city-name'),
  analogClock: document.getElementById('personalized-ah-analog-clock'),
  ahSector: document.getElementById('ah-personalized-sector'),
  ahSectorIndicatorLine: document.getElementById('ah-personalized-sector-indicator'), // ★この行を追加
  ticks: document.getElementById('ticks-personalized'),
  hands: {
    hour: document.getElementById('hour-personalized'),
    minute: document.getElementById('minute-personalized'),
    second: document.getElementById('second-personalized'),
  },
  digitalAphTime: document.getElementById('personalized-aph-time'),
  digitalNormalTime: document.getElementById('personalized-normal-time'),
};

// Application State
const state = {
  selectedTimezone: '',
  normalAphDayDurationMinutes: 1380, // Default to 23 hours (23 * 60)
  displayTimezones: [],
  animationFrameId: null,
};

// --- Utility Functions ---
function formatDuration(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours} hours ${minutes} minutes`;
}

// --- Initialization Functions ---

function initializeSlider() {
  if (!elements.normalDurationSlider || !elements.normalDurationDisplay) return;

  // スライダーの初期値をstateに反映し、表示も更新
  state.normalAphDayDurationMinutes = parseInt(elements.normalDurationSlider.value, 10);
  elements.normalDurationDisplay.textContent = formatDuration(state.normalAphDayDurationMinutes);

  elements.normalDurationSlider.addEventListener('input', (event) => {
    state.normalAphDayDurationMinutes = parseInt(event.target.value, 10);
    elements.normalDurationDisplay.textContent = formatDuration(state.normalAphDayDurationMinutes);
    // 時計の更新はrequestAnimationFrameのループに任せる
  });
}

function initializeTimezoneSelect() {
  if (!elements.timezoneSelect) return;

  state.displayTimezones = getDisplayTimezones();
  elements.timezoneSelect.innerHTML = '';

  state.displayTimezones.forEach(tzData => {
    const option = new Option(tzData.displayText, tzData.timezone);
    elements.timezoneSelect.appendChild(option);
  });

  const params = new URLSearchParams(window.location.search);
  const urlTimezone = params.get('timezone');
  let initialTimezone = (urlTimezone && moment.tz.zone(urlTimezone)) ? urlTimezone : (getUserLocalTimezone() || 'UTC');

  const isValidInitial = state.displayTimezones.some(tz => tz.timezone === initialTimezone);
  if (!isValidInitial) {
    const userLocalInList = state.displayTimezones.find(tz => tz.timezone === getUserLocalTimezone());
    initialTimezone = userLocalInList ? userLocalInList.timezone : (state.displayTimezones.length > 0 ? state.displayTimezones[0].timezone : 'UTC');
  }

  state.selectedTimezone = initialTimezone;
  elements.timezoneSelect.value = state.selectedTimezone;
  updateCityNameDisplay(state.selectedTimezone);

  elements.timezoneSelect.addEventListener('change', (event) => {
    state.selectedTimezone = event.target.value;
    updateCityNameDisplay(state.selectedTimezone);
  });
}

function updateCityNameDisplay(timezoneName) {
  if (elements.cityNameDisplay) {
    elements.cityNameDisplay.textContent = getCityNameByTimezone(timezoneName);
  }
}

function drawTicks() {
  if (!elements.ticks) return;
  elements.ticks.innerHTML = '';
  for (let i = 0; i < 60; i++) {
    const angle = i * 6;
    const isMajor = i % 5 === 0;
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    const radius = 95;
    const length = isMajor ? 10 : 5;

    line.setAttribute('class', `tick common-clock-tick ${isMajor ? 'major common-clock-tick-major' : ''}`);
    line.setAttribute('x1', (100 + Math.sin(angle * Math.PI / 180) * (radius - length)).toString());
    line.setAttribute('y1', (100 - Math.cos(angle * Math.PI / 180) * (radius - length)).toString());
    line.setAttribute('x2', (100 + Math.sin(angle * Math.PI / 180) * radius).toString());
    line.setAttribute('y2', (100 - Math.cos(angle * Math.PI / 180) * radius).toString());
    elements.ticks.appendChild(line);

    if (isMajor) {
        const hourNumber = (i / 5 === 0) ? 12 : i / 5;
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', (100 + Math.sin(angle * Math.PI / 180) * (radius - length - 10)).toString());
        text.setAttribute('y', (100 - Math.cos(angle * Math.PI / 180) * (radius - length - 10) + 4).toString());
        text.setAttribute('class', 'hour-number');
        text.setAttribute('text-anchor', 'middle');
        text.textContent = hourNumber.toString();
        elements.ticks.appendChild(text);
    }
  }
}

// public/js/personalized-ah-clock-ui.js

// ... (elements と state は変更なし) ...
// ... (formatDuration, initializeSlider, initializeTimezoneSelect, updateCityNameDisplay, drawTicks は変更なし) ...

function drawAhPersonalizedSector(startAngleDegrees, originalSweepAngleDegrees) {
  if (!elements.ahSector || !elements.ahSectorIndicatorLine) return;

  const radius = 95;
  const cx = 100;
  const cy = 100;

  // パイ自体の描画は最大360度（わずかに小さくして完全な円との不具合を避ける）
  const displaySweepAngleDegrees = Math.min(originalSweepAngleDegrees, 359.999);

  if (displaySweepAngleDegrees <= 0.001) { // スイープ角度がほぼ0なら何も描画しない
    elements.ahSector.setAttribute("d", "");
    elements.ahSectorIndicatorLine.style.display = 'none';
    return;
  }

  // SVGの角度系に変換 (x軸右方向が0度、時計回りが正)
  // 我々の角度は12時方向が0度、時計回りが正。SVGのarcコマンドの角度は-90度オフセット。
  const svgStartAngle = (startAngleDegrees - 90); // startAngleDegrees は常に0のはず
  const svgDisplayEndAngle = svgStartAngle + displaySweepAngleDegrees;

  const startRad = svgStartAngle * Math.PI / 180;
  const endRad = svgDisplayEndAngle * Math.PI / 180;

  const x1 = cx + radius * Math.cos(startRad);
  const y1 = cy + radius * Math.sin(startRad);
  const x2 = cx + radius * Math.cos(endRad);
  const y2 = cy + radius * Math.sin(endRad);

  const largeArcFlag = displaySweepAngleDegrees > 180 ? 1 : 0;

  // SVGパスデータを生成
  const d_sector = [
    `M ${cx},${cy}`,         // Move to center
    `L ${x1},${y1}`,         // Line to arc start point
    `A ${radius},${radius} 0 ${largeArcFlag} 1 ${x2},${y2}`, // Arc to end point
    "Z"                     // Close path (back to center)
  ].join(" ");
  elements.ahSector.setAttribute("d", d_sector); // パスを設定して扇形を描画

  // 12時間を超える場合のインジケーター線を描画
  if (originalSweepAngleDegrees > 360) {
    const indicatorAngleDegrees = originalSweepAngleDegrees % 360; // 2周目以降の角度
    // startAngleDegrees は常に0なので、svgIndicatorAngle の計算で考慮する
    const svgIndicatorAngle = (0 + indicatorAngleDegrees - 90); // 12時基点なので startAngleDegrees(0) を足す

    const indicatorRad = svgIndicatorAngle * Math.PI / 180;

    const indicatorX = cx + radius * Math.cos(indicatorRad);
    const indicatorY = cy + radius * Math.sin(indicatorRad);

    elements.ahSectorIndicatorLine.setAttribute('x1', cx.toString());
    elements.ahSectorIndicatorLine.setAttribute('y1', cy.toString());
    elements.ahSectorIndicatorLine.setAttribute('x2', indicatorX.toString());
    elements.ahSectorIndicatorLine.setAttribute('y2', indicatorY.toString());
    elements.ahSectorIndicatorLine.style.display = 'block';
  } else {
    elements.ahSectorIndicatorLine.style.display = 'none';
  }
}

// --- Clock Update Function ---
function updatePersonalizedClock() {
  if (!state.selectedTimezone || !elements.hands.hour) {
    state.animationFrameId = requestAnimationFrame(updatePersonalizedClock);
    return;
  }

  const now = new Date();
  const {
    hourAngle, minuteAngle, secondAngle,
    aphHours, aphMinutes, aphSeconds,
    ahSectorStartAngleDegrees, // 常に0が渡される
    ahSectorSweepAngleDegrees, // 360を超える可能性のある値が渡される
    isPersonalizedAhPeriod
  } = getCustomAhAngles(now, state.selectedTimezone, state.normalAphDayDurationMinutes);

  // アナログ針の更新 (変更なし)
  elements.hands.hour.style.transform = `rotate(${hourAngle}deg)`;
  elements.hands.minute.style.transform = `rotate(${minuteAngle}deg)`;
  elements.hands.second.style.transform = `rotate(${secondAngle}deg)`;

  // デジタル表示の更新 (変更なし)
  if (elements.digitalAphTime) {
    elements.digitalAphTime.textContent = `APH Time: ${String(aphHours).padStart(2, '0')}:${String(aphMinutes).padStart(2, '0')}:${String(Math.floor(aphSeconds)).padStart(2, '0')}`;
  }
  if (elements.digitalNormalTime) {
    elements.digitalNormalTime.textContent = `Actual: ${moment(now).tz(state.selectedTimezone).format('HH:mm:ss')}`;
  }

  // AHセクターとインジケーターの更新 (APH期間中に表示)
  if (elements.ahSector) { // elements.ahSectorIndicatorLine のチェックは drawAhPersonalizedSector 内で行う
    if (isPersonalizedAhPeriod) {
      drawAhPersonalizedSector(ahSectorStartAngleDegrees, ahSectorSweepAngleDegrees); // ★ahSectorSweepAngleDegrees をそのまま渡す
      elements.ahSector.style.display = 'block';
    } else {
      elements.ahSector.style.display = 'none';
      if (elements.ahSectorIndicatorLine) { // APH期間外ならインジケーターも消す
          elements.ahSectorIndicatorLine.style.display = 'none';
      }
    }
  }

  // テーマ更新 (APH期間中にダークモード)
  document.body.classList.toggle('inverted', isPersonalizedAhPeriod);

  state.animationFrameId = requestAnimationFrame(updatePersonalizedClock);
}



// ... (他の部分はそのまま) ...
// --- Main Initialization ---
function initialize() {
  if (typeof moment === 'undefined' || typeof moment.tz === 'undefined') {
    console.error("Moment.js and Moment Timezone are not loaded. Personalized AH Clock cannot be fully initialized.");
    if(elements.cityNameDisplay) elements.cityNameDisplay.textContent = "Error: Time library not loaded.";
    return;
  }

  initializeSlider();
  initializeTimezoneSelect();
  drawTicks();

  if (state.animationFrameId) cancelAnimationFrame(state.animationFrameId);
  updatePersonalizedClock(); // Start the loop
}

// Run initialization when the script loads
initialize();

// Cleanup on unload
window.addEventListener('unload', () => {
  if (state.animationFrameId) {
    cancelAnimationFrame(state.animationFrameId);
  }
});