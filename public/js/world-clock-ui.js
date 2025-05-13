// public/js/world-clock-ui.js
import { SCALE_AH, getAngles } from '../clock-core.js';
// city-timezones.js の直接インポートを削除
// import { cityCandidatesByOffset } from './city-timezones.js';
// 新しい timezone-manager.js から必要な関数をインポート
import { getDisplayTimezones, getUserLocalTimezone, getCityNameByTimezone } from './timezone-manager.js';

const container = document.getElementById('world-clocks-container');
const userLocalTimezone = getUserLocalTimezone(); // timezone-manager から取得

let worldTimezones = []; // ここで初期化

/**
 * World Clock表示用のデータを初期化します。
 * timezone-manager からタイムゾーンリストを取得します。
 */
function initializeWorldClockDisplayData() {
  worldTimezones = getDisplayTimezones(); // timezone-manager から取得

  // デバッグログ（必要に応じて）
  // console.log("World Timezones for Display:", worldTimezones.map(tz => tz.displayText));
}

// 時計要素を生成する関数 (tzData の形式に注意)
// tzData は { timezone: string, city: string, offset: number, offsetString: string, displayText: string } 形式
// public/js/world-clock-ui.js
// ... (import文や関数の冒頭はそのまま) ...

function createClockElement(tzData) {
  const clockItem = document.createElement('div');
  clockItem.classList.add('world-clock-item');
  clockItem.dataset.timezone = tzData.timezone;

  const cityNameElement = document.createElement('h3');
  cityNameElement.textContent = tzData.city;
  if (tzData.timezone === userLocalTimezone) {
    cityNameElement.classList.add('user-local-timezone-city');
  }

  const ahTimeDisplay = document.createElement('div');
  ahTimeDisplay.classList.add('ah-time-display-main');
  ahTimeDisplay.id = `ah-time-${tzData.timezone.replace(/[\/\+\:]/g, '-')}`;

  const normalTimeDisplay = document.createElement('div');
  normalTimeDisplay.classList.add('normal-time-display-sub');
  normalTimeDisplay.id = `time-${tzData.timezone.replace(/[\/\+\:]/g, '-')}`;

  const svgNamespace = "http://www.w3.org/2000/svg";
  const analogClockSVG = document.createElementNS(svgNamespace, "svg");
  const timezoneIdSuffix = tzData.timezone.replace(/[\/\+\:]/g, '-');

  analogClockSVG.setAttribute("class", "analog-clock-world");
  analogClockSVG.setAttribute("viewBox", "0 0 200 200");

  const face = document.createElementNS(svgNamespace, "circle");
  face.setAttribute("class", "analog-face-world common-clock-face");
  face.setAttribute("cx", "100");
  face.setAttribute("cy", "100");
  face.setAttribute("r", "95");
  analogClockSVG.appendChild(face);

  const ticksGroup = document.createElementNS(svgNamespace, "g");
  ticksGroup.setAttribute("class", "analog-ticks-world");
  for (let i = 0; i < 12; i++) {
    const angle = i * 30;
    const tick = document.createElementNS(svgNamespace, "line");
    tick.setAttribute("class", "common-clock-tick common-clock-tick-major");
    tick.setAttribute("x1", "100");
    tick.setAttribute("y1", "15");
    tick.setAttribute("x2", "100");
    tick.setAttribute("y2", "25");
    tick.setAttribute("transform", `rotate(${angle}, 100, 100)`);
    ticksGroup.appendChild(tick);
  }
  analogClockSVG.appendChild(ticksGroup);

  const hourHand = document.createElementNS(svgNamespace, "line");
  hourHand.setAttribute("id", `hour-hand-${timezoneIdSuffix}`);
  hourHand.setAttribute("class", "analog-hand-world hour-world common-clock-hand common-clock-hand-hour");
  hourHand.setAttribute("x1", "100");
  hourHand.setAttribute("y1", "100");
  hourHand.setAttribute("x2", "100");
  hourHand.setAttribute("y2", "60");
  analogClockSVG.appendChild(hourHand);

  const minuteHand = document.createElementNS(svgNamespace, "line");
  minuteHand.setAttribute("id", `minute-hand-${timezoneIdSuffix}`);
  minuteHand.setAttribute("class", "analog-hand-world minute-world common-clock-hand common-clock-hand-minute");
  minuteHand.setAttribute("x1", "100");
  minuteHand.setAttribute("y1", "100");
  minuteHand.setAttribute("x2", "100");
  minuteHand.setAttribute("y2", "40");
  analogClockSVG.appendChild(minuteHand);

  const secondHand = document.createElementNS(svgNamespace, "line");
  secondHand.setAttribute("id", `second-hand-${timezoneIdSuffix}`);
  secondHand.setAttribute("class", "analog-hand-world second-world common-clock-hand common-clock-hand-second");
  secondHand.setAttribute("x1", "100");
  secondHand.setAttribute("y1", "100");
  secondHand.setAttribute("x2", "100");
  secondHand.setAttribute("y2", "30");
  analogClockSVG.appendChild(secondHand);

  const centerDot = document.createElementNS(svgNamespace, "circle");
  centerDot.setAttribute("class", "analog-center-world common-clock-center");
  centerDot.setAttribute("cx", "100");
  centerDot.setAttribute("cy", "100");
  centerDot.setAttribute("r", "4");
  analogClockSVG.appendChild(centerDot);

  // === ↓↓↓ 重要な修正箇所: ここから ↓↓↓ ===
  clockItem.appendChild(cityNameElement);     // 都市名を追加
  clockItem.appendChild(ahTimeDisplay);       // AH時間表示を追加
  clockItem.appendChild(normalTimeDisplay);   // 通常時間表示を追加
  clockItem.appendChild(analogClockSVG);      // SVGアナログ時計を追加
  // === ↑↑↑ 重要な修正箇所: ここまで ↑↑↑ ===

  clockItem.addEventListener('click', () => {
    window.location.href = `/?timezone=${encodeURIComponent(tzData.timezone)}`;
  });

  return clockItem;
}

// ... (getAhDigitalTime, updateWorldClockTime, updateAllClocksLoop, 初期化処理はそのまま) ...
// AHデジタルタイム取得 (変更なし)
function getAhDigitalTime(dateObject, timezone) {
  const localTime = moment(dateObject).tz(timezone);
  const hours = localTime.hours();
  const minutes = localTime.minutes();
  const seconds = localTime.seconds();
  const milliseconds = localTime.milliseconds();

  const isAHHourForThisTimezone = hours === 23;

  const totalMs = ((hours * 3600 + minutes * 60 + seconds) * 1000 + milliseconds);
  const scaledMs = isAHHourForThisTimezone ? totalMs : totalMs * SCALE_AH;

  const ahSec = (scaledMs / 1000) % 60;
  const ahMin = Math.floor((scaledMs / (1000 * 60)) % 60);
  let ahHr = Math.floor((scaledMs / (1000 * 3600)) % 24);

  if (isAHHourForThisTimezone) {
    ahHr = 24;
  }

  return {
    ahHours: ahHr,
    ahMinutes: ahMin,
    ahSeconds: ahSec,
    isAHHour: isAHHourForThisTimezone
  };
}


// 時計更新関数 (変更なし)
function updateWorldClockTime(timezoneData) {
  const timezone = timezoneData.timezone;
  const now = new Date();
  const timezoneIdSuffix = timezone.replace(/[\/\+\:]/g, '-');

  const normalTimeEl = document.getElementById(`time-${timezoneIdSuffix}`);
  if (normalTimeEl) {
    normalTimeEl.textContent = moment(now).tz(timezone).format('HH:mm:ss');
  }

  const { ahHours, ahMinutes, ahSeconds, isAHHour } = getAhDigitalTime(now, timezone);
  const ahTimeEl = document.getElementById(`ah-time-${timezoneIdSuffix}`);
  if (ahTimeEl) {
    const ahTimeString =
      `${String(Math.floor(ahHours)).padStart(2, '0')}:${String(Math.floor(ahMinutes)).padStart(2, '0')}:${String(Math.floor(ahSeconds)).padStart(2, '0')}`;
    ahTimeEl.textContent = `AH: ${ahTimeString}`;
  }

  const angles = getAngles(now, timezone);

  const hourHand = document.getElementById(`hour-hand-${timezoneIdSuffix}`);
  if (hourHand) hourHand.style.transform = `rotate(${angles.hourAngle}deg)`;
  const minuteHand = document.getElementById(`minute-hand-${timezoneIdSuffix}`);
  if (minuteHand) minuteHand.style.transform = `rotate(${angles.minuteAngle}deg)`;
  const secondHand = document.getElementById(`second-hand-${timezoneIdSuffix}`);
  if (secondHand) secondHand.style.transform = `rotate(${angles.secondAngle}deg)`;

  const clockItem = document.querySelector(`[data-timezone="${timezone}"]`);
  if (clockItem) {
    clockItem.classList.toggle('blinking-ah', isAHHour);
  }
}

// 全時計更新ループ (変更なし)
function updateAllClocksLoop() {
  worldTimezones.forEach(tzData => {
    updateWorldClockTime(tzData);
  });
  requestAnimationFrame(updateAllClocksLoop);
}

// --- 初期化処理 ---
if (container) {
  if (typeof moment !== 'undefined' && typeof moment.tz !== 'undefined') {
    initializeWorldClockDisplayData(); // データを初期化
    if (worldTimezones.length > 0) {
      container.innerHTML = ''; // 既存の要素をクリア
      worldTimezones.forEach(tzData => {
        const clockEl = createClockElement(tzData);
        container.appendChild(clockEl);
      });
      updateAllClocksLoop();
    } else {
      container.innerHTML = '<p>No timezones available to display.</p>';
      console.error('World timezones list is empty after initialization.');
    }
  } else {
    console.error("Moment.js and Moment Timezone are not loaded. World clocks cannot be initialized.");
    container.innerHTML = '<p>Error: Time library not loaded. World clocks cannot be displayed.</p>';
  }
} else {
  console.error('Error: world-clocks-container element not found in HTML.');
}