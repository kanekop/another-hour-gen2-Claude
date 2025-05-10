// public/clock-core.js から SCALE_AH をインポートします。
// public/clock-core.js から SCALE_AH と getAngles をインポートします。
import { SCALE_AH, getAngles } from '../clock-core.js';

// 3. 地域表示を英語に変更
const worldTimezones = [
  { timezone: 'Pacific/Apia', city: 'Apia (Samoa)' }, // UTC+13
  { timezone: 'Pacific/Auckland', city: 'Auckland (New Zealand)' }, // UTC+12
  { timezone: 'Pacific/Noumea', city: 'Noumea (New Caledonia)' }, // UTC+11
  { timezone: 'Australia/Sydney', city: 'Sydney (Australia)' }, // UTC+10
  { timezone: 'Asia/Tokyo', city: 'Tokyo (Japan)' }, // UTC+9
  { timezone: 'Asia/Singapore', city: 'Singapore' }, // UTC+8
  { timezone: 'Asia/Bangkok', city: 'Bangkok (Thailand)' }, // UTC+7
  { timezone: 'Asia/Dhaka', city: 'Dhaka (Bangladesh)' }, // UTC+6
  { timezone: 'Asia/Karachi', city: 'Karachi (Pakistan)' }, // UTC+5
  { timezone: 'Asia/Dubai', city: 'Dubai (UAE)' }, // UTC+4
  { timezone: 'Europe/Moscow', city: 'Moscow (Russia)' }, // UTC+3
  { timezone: 'Europe/Paris', city: 'Paris (France)' }, // UTC+2
  { timezone: 'Europe/London', city: 'London (UK)' }, // UTC+0 (Greenwich Mean Time)
  { timezone: 'UTC', city: 'UTC' }, // UTC+0
  { timezone: 'Atlantic/Azores', city: 'Azores (Portugal)' }, // UTC-1
  { timezone: 'Atlantic/Cape_Verde', city: 'Cape Verde' },               // UTC-1 (CVT)  
  { timezone: 'Atlantic/South_Georgia', city: 'South Georgia (UK)' }, // UTC-2 (追加候補1)
  { timezone: 'America/Sao_Paulo', city: 'São Paulo (Brazil)' }, // UTC-3
  { timezone: 'America/New_York', city: 'New York (USA)' }, // UTC-4
  { timezone: 'America/Chicago', city: 'Chicago (USA)' }, // UTC-5
  { timezone: 'America/Denver', city: 'Denver (USA)' }, // UTC-6
  { timezone: 'America/Los_Angeles', city: 'Los Angeles (USA)' },        // UTC-8 (PST) / UTC-7 (PDT)
  { timezone: 'America/Anchorage', city: 'Anchorage (USA)' }, // UTC-9 (アラスカ標準時) (追加候補2)
  { timezone: 'Pacific/Gambier', city: 'Gambier Islands (France)' },      // UTC-9 (追加)
  { timezone: 'Pacific/Honolulu', city: 'Honolulu (USA)' }, // UTC-10 (ハワイ標準時) (追加候補3)
  { timezone: 'Pacific/Pago_Pago', city: 'Pago Pago (Samoa)' }, // UTC-11 (追加候補4)
  { timezone: 'Etc/GMT+12', city: 'Baker Island (USA)' }                // UTC-12 (最も遅い場所の一つ、無人島だがTZとして存在)
  
];



const container = document.getElementById('world-clocks-container');

/**
 * 指定されたタイムゾーンの時計要素を生成します。
 * @param {object} timezoneData - タイムゾーン情報 (timezone, city)
 * @returns {HTMLElement} 生成された時計のHTML要素
 */
function createClockElement(timezoneData) {
  const clockItem = document.createElement('div');
  clockItem.classList.add('world-clock-item');
  clockItem.dataset.timezone = timezoneData.timezone;

  const cityName = document.createElement('h3');
  cityName.textContent = timezoneData.city;

  const ahTimeDisplay = document.createElement('div');
  ahTimeDisplay.classList.add('ah-time-display-main');
  ahTimeDisplay.id = `ah-time-${timezoneData.timezone.replace(/[\/\+\:]/g, '-')}`;

  const normalTimeDisplay = document.createElement('div');
  normalTimeDisplay.classList.add('normal-time-display-sub');
  normalTimeDisplay.id = `time-${timezoneData.timezone.replace(/[\/\+\:]/g, '-')}`;

  // アナログ時計用のSVG要素をここから追加
  const svgNamespace = "http://www.w3.org/2000/svg";
  const analogClockSVG = document.createElementNS(svgNamespace, "svg");
  const timezoneIdSuffix = timezoneData.timezone.replace(/[\/\+\:]/g, '-'); // ID用サフィックス

  analogClockSVG.setAttribute("class", "analog-clock-world");
  analogClockSVG.setAttribute("viewBox", "0 0 200 200"); // メインクロックのviewBoxを流用

  // 盤面 (円)
  const face = document.createElementNS(svgNamespace, "circle");
  face.setAttribute("class", "analog-face-world"); // 新しいクラス名
  face.setAttribute("cx", "100");
  face.setAttribute("cy", "100");
  face.setAttribute("r", "95");
  analogClockSVG.appendChild(face);

  // 目盛り（簡易版 - 12個の大きな点）- まずは省略してもOK
  const ticksGroup = document.createElementNS(svgNamespace, "g");
  ticksGroup.setAttribute("class", "analog-ticks-world");
  for (let i = 0; i < 12; i++) {
    const angle = i * 30; // 30度ごと
    const tick = document.createElementNS(svgNamespace, "line");
    tick.setAttribute("x1", "100");
    tick.setAttribute("y1", "15"); // 中心から少し外側
    tick.setAttribute("x2", "100");
    tick.setAttribute("y2", "25"); // 短い線
    tick.setAttribute("transform", `rotate(${angle}, 100, 100)`);
    ticksGroup.appendChild(tick);
  }
  analogClockSVG.appendChild(ticksGroup);


  // 時針
  const hourHand = document.createElementNS(svgNamespace, "line");
  hourHand.setAttribute("id", `hour-hand-${timezoneIdSuffix}`);
  hourHand.setAttribute("class", "analog-hand-world hour-world"); // 新しいクラス名
  hourHand.setAttribute("x1", "100");
  hourHand.setAttribute("y1", "100");
  hourHand.setAttribute("x2", "100");
  hourHand.setAttribute("y2", "60"); // 短め
  analogClockSVG.appendChild(hourHand);

  // 分針
  const minuteHand = document.createElementNS(svgNamespace, "line");
  minuteHand.setAttribute("id", `minute-hand-${timezoneIdSuffix}`);
  minuteHand.setAttribute("class", "analog-hand-world minute-world"); // 新しいクラス名
  minuteHand.setAttribute("x1", "100");
  minuteHand.setAttribute("y1", "100");
  minuteHand.setAttribute("x2", "100");
  minuteHand.setAttribute("y2", "40"); // 長め
  analogClockSVG.appendChild(minuteHand);

  // 秒針
  const secondHand = document.createElementNS(svgNamespace, "line");
  secondHand.setAttribute("id", `second-hand-${timezoneIdSuffix}`);
  secondHand.setAttribute("class", "analog-hand-world second-world"); // 新しいクラス名
  secondHand.setAttribute("x1", "100");
  secondHand.setAttribute("y1", "100");
  secondHand.setAttribute("x2", "100");
  secondHand.setAttribute("y2", "30"); // さらに長め、細め
  analogClockSVG.appendChild(secondHand);

  // 中心のドット
  const centerDot = document.createElementNS(svgNamespace, "circle");
  centerDot.setAttribute("class", "analog-center-world"); // 新しいクラス名
  centerDot.setAttribute("cx", "100");
  centerDot.setAttribute("cy", "100");
  centerDot.setAttribute("r", "4");
  analogClockSVG.appendChild(centerDot);
  // アナログ時計SVG要素の追加ここまで

  clockItem.appendChild(cityName);
  clockItem.appendChild(ahTimeDisplay);
  clockItem.appendChild(normalTimeDisplay);
  clockItem.appendChild(analogClockSVG); // デジタル表示の下にアナログ時計を追加

  return clockItem;
}
// getAhDigitalTime 関数は変更なし (前回のコードのまま)
/**
 * 指定された日時とタイムゾーンに基づいて、デジタル表示用のAH時間を計算します。
 * @param {Date} dateObject - 計算の基準となるDateオブジェクト
 * @param {string} timezone - IANAタイムゾーン名
 * @returns {object} { ahHours, ahMinutes, ahSeconds, isAHHour }
 */
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


/**
 * 指定されたタイムゾーンの時計表示を更新します。
 * @param {object} timezoneData - タイムゾーン情報 (timezone, city)
 */
function updateWorldClockTime(timezoneData) {
  const timezone = timezoneData.timezone;
  const now = new Date();
  const timezoneIdSuffix = timezone.replace(/[\/\+\:]/g, '-');

  // 通常時刻の表示 (変更なし)
  const normalTimeEl = document.getElementById(`time-${timezoneIdSuffix}`);
  if (normalTimeEl) {
    normalTimeEl.textContent = moment(now).tz(timezone).format('HH:mm:ss');
  }

  // AH時刻の計算と表示 (変更なし)
  const { ahHours, ahMinutes, ahSeconds, isAHHour } = getAhDigitalTime(now, timezone);
  const ahTimeEl = document.getElementById(`ah-time-${timezoneIdSuffix}`);
  if (ahTimeEl) {
    const ahTimeString =
      `${String(Math.floor(ahHours)).padStart(2, '0')}:${String(Math.floor(ahMinutes)).padStart(2, '0')}:${String(Math.floor(ahSeconds)).padStart(2, '0')}`;
    ahTimeEl.textContent = `AH: ${ahTimeString}`;
  }

  // アナログ時計の針の更新
  const angles = getAngles(now, timezone);

  const hourHand = document.getElementById(`hour-hand-${timezoneIdSuffix}`);
  if (hourHand) {
    // 変更点: setAttribute から style.transform へ
    hourHand.style.transform = `rotate(${angles.hourAngle}deg)`;
  }
  const minuteHand = document.getElementById(`minute-hand-${timezoneIdSuffix}`);
  if (minuteHand) {
    // 変更点: setAttribute から style.transform へ
    minuteHand.style.transform = `rotate(${angles.minuteAngle}deg)`;
  }
  const secondHand = document.getElementById(`second-hand-${timezoneIdSuffix}`);
  if (secondHand) {
    // 変更点: setAttribute から style.transform へ
    secondHand.style.transform = `rotate(${angles.secondAngle}deg)`;
  }

  // 点滅処理 (変更なし)
  const clockItem = document.querySelector(`[data-timezone="${timezone}"]`);
  if (clockItem) {
    if (isAHHour) {
      clockItem.classList.add('blinking-ah');
    } else {
      clockItem.classList.remove('blinking-ah');
    }
  }
}


// updateAllClocksLoop 関数は変更なし (前回のコードのまま)
/**
 * 全ての時計を定期的に更新し、ページの背景をユーザーのローカルAH状態に合わせます。
 */
function updateAllClocksLoop() {
  const userLocalTimezone = moment.tz.guess();
  const nowForUser = moment();
  const isUserInAHHour = nowForUser.tz(userLocalTimezone).hours() === 23;

  document.body.classList.toggle('inverted', !isUserInAHHour);

  worldTimezones.forEach(tzData => {
    updateWorldClockTime(tzData);
  });

  requestAnimationFrame(updateAllClocksLoop);
}

// 初期化処理 (変更なし)
if (container) {
  worldTimezones.forEach(tzData => {
    const clockEl = createClockElement(tzData);
    container.appendChild(clockEl);
  });
  updateAllClocksLoop();
} else {
  console.error('Error: world-clocks-container element not found in HTML.');
}