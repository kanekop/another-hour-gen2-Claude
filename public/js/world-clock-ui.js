// public/js/world-clock-ui.js
import { SCALE_AH, getAngles } from '../clock-core.js';
// city-timezones.js の直接インポートを削除
// import { cityCandidatesByOffset } from './city-timezones.js';
// 新しい timezone-manager.js から必要な関数をインポート
import { getDisplayTimezones, getUserLocalTimezone, getCityNameByTimezone } from './timezone-manager.js'; // getCityNameByTimezone は現状未使用だが将来的に使う可能性

const container = document.getElementById('world-clocks-container');
// userLocalTimezone は timezone-manager から取得する
const userLocalTimezone = getUserLocalTimezone();

// worldTimezones は getDisplayTimezones() から取得する形に変更
let worldTimezones = [];

/**
 * 以前の initializeWorldTimezones は getDisplayTimezones にロジックが移管されたため、
 * ここでは getDisplayTimezones を呼び出すだけ、もしくは直接 worldTimezones に代入する。
 * ただし、getDisplayTimezones は既にソートされたリストを返す想定なので、
 * ここでの追加のソートやフィルタリングは不要になる。
 */
function initializeWorldClockDisplayData() {
  // timezone-manager からワールドクロック表示用のタイムゾーンリストを取得
  worldTimezones = getDisplayTimezones();

  // デバッグ用ログ（必要に応じて）
  // console.log("Selected World Timezones for Display (from timezone-manager):", worldTimezones.map(tz => {
  // return { city: tz.city, timezone: tz.timezone, currentOffset: moment.tz(tz.timezone).utcOffset() };
  // }));
}

// 時計要素を生成する関数 (tzData の形式が変更されたことに注意)
// tzData は { timezone: string, city: string, offset: number, offsetString: string, displayText: string } 形式
function createClockElement(tzData) {
  const clockItem = document.createElement('div');
  clockItem.classList.add('world-clock-item');
  clockItem.dataset.timezone = tzData.timezone; // IANAタイムゾーン名を data属性に設定

  const cityName = document.createElement('h3');
  cityName.textContent = tzData.city; // timezone-manager が生成した都市名を使用

  // ユーザーのローカルタイムゾーンと一致するか確認し、クラスを付与
  if (tzData.timezone === userLocalTimezone) {
    cityName.classList.add('user-local-timezone-city');
  }

  const ahTimeDisplay = document.createElement('div');
  ahTimeDisplay.classList.add('ah-time-display-main');
  // ID生成時のコロンをハイフンに置換 (以前のロジックを踏襲)
  ahTimeDisplay.id = `ah-time-${tzData.timezone.replace(/[\/\+\:]/g, '-')}`;

  const normalTimeDisplay = document.createElement('div');
  normalTimeDisplay.classList.add('normal-time-display-sub');
  normalTimeDisplay.id = `time-${tzData.timezone.replace(/[\/\+\:]/g, '-')}`;

  // アナログ時計用のSVG要素 (変更なし)
  const svgNamespace = "http://www.w3.org/2000/svg";
  const analogClockSVG = document.createElementNS(svgNamespace, "svg");
  const timezoneIdSuffix = tzData.timezone.replace(/[\/\+\:]/g, '-');

  analogClockSVG.setAttribute("class", "analog-clock-world");
  analogClockSVG.setAttribute("viewBox", "0 0 200 200");

  const face = document.createElementNS(svgNamespace, "circle");
  face.setAttribute("class", "analog-face-world");
  face.setAttribute("cx", "100");
  face.setAttribute("cy", "100");
  face.setAttribute("r", "95");
  analogClockSVG.appendChild(face);

  const ticksGroup = document.createElementNS(svgNamespace, "g");
  ticksGroup.setAttribute("class", "analog-ticks-world");
  for (let i = 0; i < 12; i++) {
    const angle = i * 30;
    const tick = document.createElementNS(svgNamespace, "line");
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
  hourHand.setAttribute("class", "analog-hand-world hour-world");
  hourHand.setAttribute("x1", "100");
  hourHand.setAttribute("y1", "100");
  hourHand.setAttribute("x2", "100");
  hourHand.setAttribute("y2", "60");
  analogClockSVG.appendChild(hourHand);

  const minuteHand = document.createElementNS(svgNamespace, "line");
  minuteHand.setAttribute("id", `minute-hand-${timezoneIdSuffix}`);
  minuteHand.setAttribute("class", "analog-hand-world minute-world");
  minuteHand.setAttribute("x1", "100");
  minuteHand.setAttribute("y1", "100");
  minuteHand.setAttribute("x2", "100");
  minuteHand.setAttribute("y2", "40");
  analogClockSVG.appendChild(minuteHand);

  const secondHand = document.createElementNS(svgNamespace, "line");
  secondHand.setAttribute("id", `second-hand-${timezoneIdSuffix}`);
  secondHand.setAttribute("class", "analog-hand-world second-world");
  secondHand.setAttribute("x1", "100");
  secondHand.setAttribute("y1", "100");
  secondHand.setAttribute("x2", "100");
  secondHand.setAttribute("y2", "30");
  analogClockSVG.appendChild(secondHand);

  const centerDot = document.createElementNS(svgNamespace, "circle");
  centerDot.setAttribute("class", "analog-center-world");
  centerDot.setAttribute("cx", "100");
  centerDot.setAttribute("cy", "100");
  centerDot.setAttribute("r", "4");
  analogClockSVG.appendChild(centerDot);

  clockItem.appendChild(cityName);
  clockItem.appendChild(ahTimeDisplay);
  clockItem.appendChild(normalTimeDisplay);
  clockItem.appendChild(analogClockSVG);

  // --- ここからクリックイベントリスナーを追加 ---
  clockItem.addEventListener('click', () => {
    // クエリパラメータとしてタイムゾーンを付与してメインページに遷移
    window.location.href = `/?timezone=${encodeURIComponent(tzData.timezone)}`;
  });
  // ダブルクリックにしたい場合は 'dblclick' に変更
  // clockItem.addEventListener('dblclick', () => { ... });
  // --- クリックイベントリスナーここまで ---

  return clockItem;
}

// getAhDigitalTime 関数は変更なし (前回のコードのまま)
function getAhDigitalTime(dateObject, timezone) {
  const localTime = moment(dateObject).tz(timezone);
  const hours = localTime.hours();
  const minutes = localTime.minutes();
  const seconds = localTime.seconds();
  const milliseconds = localTime.milliseconds();

  const isAHHourForThisTimezone = hours === 23;

  const totalMs = ((hours * 3600 + minutes * 60 + seconds) * 1000 + milliseconds);
  // clock-core.js の SCALE_AH (24/23) を使う
  const scaledMs = isAHHourForThisTimezone ? totalMs : totalMs * SCALE_AH;

  const ahSec = (scaledMs / 1000) % 60;
  const ahMin = Math.floor((scaledMs / (1000 * 60)) % 60);
  let ahHr = Math.floor((scaledMs / (1000 * 3600)) % 24);

  if (isAHHourForThisTimezone) {
    // clock-core.js の getAngles と同様のロジックでAH時間を表示
    // getAngles は ahHours を 24 としているため、それに合わせる
    ahHr = 24;
  }

  return {
    ahHours: ahHr,
    ahMinutes: ahMin,
    ahSeconds: ahSec,
    isAHHour: isAHHourForThisTimezone
  };
}


// updateWorldClockTime 関数 (tzData の形式変更に対応)
function updateWorldClockTime(timezoneData) { // パラメータ名を timezoneData に変更
  const timezone = timezoneData.timezone; // tzData.timezone を使用
  const now = new Date();
  const timezoneIdSuffix = timezone.replace(/[\/\+\:]/g, '-');

  const normalTimeEl = document.getElementById(`time-${timezoneIdSuffix}`);
  if (normalTimeEl) {
    normalTimeEl.textContent = moment(now).tz(timezone).format('HH:mm:ss');
  }

  // AH時刻の計算と表示 (getAhDigitalTime を使用)
  const { ahHours, ahMinutes, ahSeconds, isAHHour } = getAhDigitalTime(now, timezone);
  const ahTimeEl = document.getElementById(`ah-time-${timezoneIdSuffix}`);
  if (ahTimeEl) {
    const ahTimeString =
      `${String(Math.floor(ahHours)).padStart(2, '0')}:${String(Math.floor(ahMinutes)).padStart(2, '0')}:${String(Math.floor(ahSeconds)).padStart(2, '0')}`;
    ahTimeEl.textContent = `AH: ${ahTimeString}`;
  }

  // アナログ時計の針の更新 (getAngles を使用)
  const angles = getAngles(now, timezone); // getAngles は clock-core.js からインポート済み

  const hourHand = document.getElementById(`hour-hand-${timezoneIdSuffix}`);
  if (hourHand) {
    hourHand.style.transform = `rotate(${angles.hourAngle}deg)`;
  }
  const minuteHand = document.getElementById(`minute-hand-${timezoneIdSuffix}`);
  if (minuteHand) {
    minuteHand.style.transform = `rotate(${angles.minuteAngle}deg)`;
  }
  const secondHand = document.getElementById(`second-hand-${timezoneIdSuffix}`);
  if (secondHand) {
    secondHand.style.transform = `rotate(${angles.secondAngle}deg)`;
  }

  const clockItem = document.querySelector(`[data-timezone="${timezone}"]`);
  if (clockItem) {
    clockItem.classList.toggle('blinking-ah', isAHHour); // isAHHour に基づいてクラスをトグル
  }
}

// updateAllClocksLoop 関数は変更なし
function updateAllClocksLoop() {
  worldTimezones.forEach(tzData => { // tzData を渡す
    updateWorldClockTime(tzData);
  });
  requestAnimationFrame(updateAllClocksLoop);
}

// --- 初期化処理 ---
if (container) {
  // Moment.jsがロードされていることを確認してから初期化
  if (typeof moment !== 'undefined' && typeof moment.tz !== 'undefined') {
    initializeWorldClockDisplayData(); // データをまず初期化
    if (worldTimezones.length > 0) {
      worldTimezones.forEach(tzData => { // tzData を使用
        const clockEl = createClockElement(tzData);
        container.appendChild(clockEl);
      });
      updateAllClocksLoop(); // ループを開始
    } else {
      container.innerHTML = '<p>No timezones available to display.</p>';
      console.error('World timezones list is empty after initialization.');
    }
  } else {
    console.error("Moment.js and Moment Timezone are not loaded. World clocks cannot be initialized.");
    container.innerHTML = '<p>Error: Time library not loaded. World clocks cannot be displayed.</p>';
    // 必要であれば、Moment.jsのロードを待つ再試行ロジックなどをここにも追加
  }
} else {
  console.error('Error: world-clocks-container element not found in HTML.');
}