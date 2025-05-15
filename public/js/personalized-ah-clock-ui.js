// public/js/personalized-ah-clock-ui.js

import { getCustomAhAngles } from '../clock-core.js'; // 修正: '../clock-core.js'
import { getDisplayTimezones, getUserLocalTimezone, getCityNameByTimezone } from './timezone-manager.js';

// DOM Elements
const elements = {
  normalDurationSlider: document.getElementById('normal-duration-slider'),
  normalDurationDisplay: document.getElementById('normal-duration-display'), // 「Normal APH Day: X hours Y minutes」用
  anotherHourDurationDisplay: document.getElementById('another-hour-duration-display'), // 「Another Personalized Hour Duration: ...」用
  sliderRealTimeLabel: document.getElementById('slider-real-time-label'),     // ▲マーク下の HH:MM 表示用
  sliderRealTimeIndicator: document.querySelector('.slider-real-time-indicator'), // ▲マークとテキストの親要素

  timezoneSelect: document.getElementById('timezone-select'),
  cityNameDisplay: document.getElementById('personalized-ah-city-name'),
  analogClock: document.getElementById('personalized-ah-analog-clock'),
  ahSector: document.getElementById('ah-personalized-sector'),
  ahSectorIndicatorLine: document.getElementById('ah-personalized-sector-indicator'),
  ticks: document.getElementById('ticks-personalized'),
  hands: {
    hour: document.getElementById('hour-personalized'),
    minute: document.getElementById('minute-personalized'),
    second: document.getElementById('second-personalized'),
  },
  digitalAphTime: document.getElementById('personalized-aph-time'),
  digitalNormalTime: document.getElementById('personalized-normal-time'),
};

// Application State (変更なし)
const state = {
  selectedTimezone: '',
  normalAphDayDurationMinutes: 1380, // Default to 23 hours (23 * 60)
  displayTimezones: [],
  animationFrameId: null,
};

// --- Utility Functions --- (formatDuration は既存のものをそのまま使用)
function formatDuration(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours} hours ${minutes} minutes`;
}


// スライダー関連の表示を更新する専用関数
function updateSliderRelatedDisplays() {
  if (!elements.normalDurationSlider || !elements.anotherHourDurationDisplay || !elements.sliderRealTimeLabel || !elements.sliderRealTimeIndicator || !elements.normalDurationDisplay) {
    return;
  }

  const normalAphDayMinutes = parseInt(elements.normalDurationSlider.value, 10); // 0 - 1440
  const normalAphDayHours = normalAphDayMinutes / 60;

  // 1. 「Normal APH Day: X hours Y minutes」の表示更新
  elements.normalDurationDisplay.textContent = `Normal APH Day: ${formatDuration(normalAphDayMinutes)}`;

  // 2. 「Another Personalized Hour Duration」の表示更新
  const totalRealMinutesInDay = 24 * 60;
  const aphDurationMinutes = totalRealMinutesInDay - normalAphDayMinutes;
  elements.anotherHourDurationDisplay.textContent = `${formatDuration(aphDurationMinutes)}`;

  // 3. スライダーの▲マーク下のリアルタイム表示 (HH:MM)
  // normalAphDayMinutes がリアルタイムの何分にあたるか。これがAPHの開始時刻（リアルタイム）。
  const realTimeHourEquivalent = Math.floor(normalAphDayMinutes / 60);
  const realTimeMinuteEquivalent = normalAphDayMinutes % 60;
  elements.sliderRealTimeLabel.textContent = `${String(realTimeHourEquivalent).padStart(2, '0')}:${String(realTimeMinuteEquivalent).padStart(2, '0')}`;

  // 4. ▲マークとリアルタイム表示の位置更新
  const sliderMin = parseInt(elements.normalDurationSlider.min, 10);
  const sliderMax = parseInt(elements.normalDurationSlider.max, 10);
  const thumbPositionRatio = (normalAphDayMinutes - sliderMin) / (sliderMax - sliderMin);

  // CSSカスタムプロパティでつまみの位置をCSSに渡す
  elements.sliderRealTimeIndicator.style.setProperty('--slider-thumb-position', `${thumbPositionRatio * 100}%`);

  // 5. スライダーのトラックのグラデーション更新
  elements.normalDurationSlider.style.setProperty('--slider-progress-percent', `${thumbPositionRatio * 100}%`);
}


// --- Initialization Functions ---
function initializeSlider() {
  if (!elements.normalDurationSlider) return;

  elements.normalDurationSlider.value = state.normalAphDayDurationMinutes.toString();
  // 初期表示のために呼び出し
  updateSliderRelatedDisplays(); 

  elements.normalDurationSlider.addEventListener('input', () => {
    state.normalAphDayDurationMinutes = parseInt(elements.normalDurationSlider.value, 10);
    updateSliderRelatedDisplays();
    // updatePersonalizedClock(); // スライダー変更時に時計も即時更新する場合
  });
}

// initializeTimezoneSelect, updateCityNameDisplay, drawTicks は変更なし (前回提示のままとします)
// ただし、getCustomAhAngles の import パスは確認してください。

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
    // updatePersonalizedClock(); // タイムゾーン変更時に時計も即時更新
  });
}

function updateCityNameDisplay(timezoneName) {
  if (elements.cityNameDisplay) {
    elements.cityNameDisplay.textContent = getCityNameByTimezone(timezoneName);
  }
}

function drawTicks() { // `public/js/personalized-ah-clock-ui.js` にある前提
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
        text.setAttribute('x', (100 + Math.sin(angle * Math.PI / 180) * (radius - length - 10)).toString()); // 数値を少し内側に
        text.setAttribute('y', (100 - Math.cos(angle * Math.PI / 180) * (radius - length - 10) + 4).toString()); // Y軸微調整
        text.setAttribute('class', 'hour-number'); // components.css でスタイル定義想定
        text.setAttribute('text-anchor', 'middle');
        text.textContent = hourNumber.toString();
        elements.ticks.appendChild(text);
    }
  }
}

// drawAhPersonalizedSector 関数 (変更なし、前回提示のまま)
function drawAhPersonalizedSector(startAngleDegrees, originalSweepAngleDegrees) {
  if (!elements.ahSector || !elements.ahSectorIndicatorLine) return;

  const radius = 95;
  const cx = 100;
  const cy = 100;
  const displaySweepAngleDegrees = Math.min(originalSweepAngleDegrees, 359.999);

  if (displaySweepAngleDegrees <= 0.001) {
    elements.ahSector.setAttribute("d", "");
    elements.ahSectorIndicatorLine.style.display = 'none';
    return;
  }

  const svgStartAngle = (startAngleDegrees - 90);
  const svgDisplayEndAngle = svgStartAngle + displaySweepAngleDegrees;
  const startRad = svgStartAngle * Math.PI / 180;
  const endRad = svgDisplayEndAngle * Math.PI / 180;
  const x1 = cx + radius * Math.cos(startRad);
  const y1 = cy + radius * Math.sin(startRad);
  const x2 = cx + radius * Math.cos(endRad);
  const y2 = cy + radius * Math.sin(endRad);
  const largeArcFlag = displaySweepAngleDegrees > 180 ? 1 : 0;
  const d_sector = [ `M ${cx},${cy}`, `L ${x1},${y1}`, `A ${radius},${radius} 0 ${largeArcFlag} 1 ${x2},${y2}`, "Z" ].join(" ");
  elements.ahSector.setAttribute("d", d_sector);

  if (originalSweepAngleDegrees > 360) {
    const indicatorAngleDegrees = originalSweepAngleDegrees % 360;
    const svgIndicatorAngle = (indicatorAngleDegrees - 90);
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

  // スライダーの値を state から読み込む
  const currentNormalAphDayDurationMinutes = state.normalAphDayDurationMinutes;

  const now = new Date();
  const {
    hourAngle, minuteAngle, secondAngle,
    aphHours, aphMinutes, aphSeconds,
    ahSectorStartAngleDegrees,
    ahSectorSweepAngleDegrees,
    isPersonalizedAhPeriod
  } = getCustomAhAngles(now, state.selectedTimezone, currentNormalAphDayDurationMinutes);

  elements.hands.hour.style.transform = `rotate(${hourAngle}deg)`;
  elements.hands.minute.style.transform = `rotate(${minuteAngle}deg)`;
  elements.hands.second.style.transform = `rotate(${secondAngle}deg)`;

  if (elements.digitalAphTime) {
    elements.digitalAphTime.textContent = `APH Time: ${String(aphHours).padStart(2, '0')}:${String(aphMinutes).padStart(2, '0')}:${String(Math.floor(aphSeconds)).padStart(2, '0')}`;
  }
  if (elements.digitalNormalTime) {
    elements.digitalNormalTime.textContent = `Actual: ${moment(now).tz(state.selectedTimezone).format('HH:mm:ss')}`;
  }

  if (elements.ahSector) {
    if (isPersonalizedAhPeriod) {
      drawAhPersonalizedSector(ahSectorStartAngleDegrees, ahSectorSweepAngleDegrees);
      elements.ahSector.style.display = 'block';
    } else {
      elements.ahSector.style.display = 'none';
      if (elements.ahSectorIndicatorLine) {
          elements.ahSectorIndicatorLine.style.display = 'none';
      }
    }
  }

  document.body.classList.toggle('inverted', isPersonalizedAhPeriod);
  state.animationFrameId = requestAnimationFrame(updatePersonalizedClock);
}

// --- Main Initialization ---
function initialize() {
  if (typeof moment === 'undefined' || typeof moment.tz === 'undefined') {
    console.error("Moment.js and Moment Timezone are not loaded. Personalized AH Clock cannot be fully initialized.");
    if(elements.cityNameDisplay) elements.cityNameDisplay.textContent = "Error: Time library not loaded.";
    return;
  }

  initializeTimezoneSelect(); // タイムゾーンを先に初期化
  initializeSlider();       // 次にスライダー（表示にタイムゾーン情報を使わないため順不同でも可）
  drawTicks();              // 目盛り描画

  if (state.animationFrameId) cancelAnimationFrame(state.animationFrameId);
  updatePersonalizedClock(); // 時計の更新ループを開始
}

initialize();

window.addEventListener('unload', () => {
  if (state.animationFrameId) {
    cancelAnimationFrame(state.animationFrameId);
  }
});