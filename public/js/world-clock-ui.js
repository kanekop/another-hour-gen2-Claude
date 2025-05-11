// public/clock-core.js から SCALE_AH をインポートします。
// public/clock-core.js から SCALE_AH と getAngles をインポートします。
import { SCALE_AH, getAngles } from '../clock-core.js';
const container = document.getElementById('world-clocks-container');

const cityCandidatesByOffset = {
  // UTC+12 (720 minutes)
  720: [
    { timezone: 'Pacific/Auckland', city: 'Auckland (NZ)', type: 'dst', priority: 1 }, // NZDT (UTC+13) or NZST (UTC+12)
    { timezone: 'Pacific/Fiji', city: 'Suva (Fiji)', type: 'any', priority: 2 } // FJST (UTC+12) or FJDT (UTC+13)
  ],
  // UTC+11 (660 minutes)
  660: [
    { timezone: 'Pacific/Noumea', city: 'Noumea (New Caledonia)', type: 'any', priority: 1 },
    { timezone: 'Australia/Lord_Howe', city: 'Lord Howe Island (AUS)', type: 'dst', priority: 2 }, // LHDT is UTC+11
    { timezone: 'Pacific/Efate', city: 'Port Vila (Vanuatu)', type: 'any', priority: 3 }
  ],
  // UTC+10 (600 minutes)
  600: [
    { timezone: 'Australia/Sydney', city: 'Sydney (AUS)', type: 'dst', priority: 1 }, // AEDT (UTC+11) or AEST (UTC+10)
    { timezone: 'Australia/Brisbane', city: 'Brisbane (AUS)', type: 'any', priority: 2 }, // AEST (UTC+10) all year
    { timezone: 'Pacific/Guam', city: 'Hagåtña (Guam)', type: 'any', priority: 3 } // ChST (UTC+10) all year
  ],
  // UTC+9 (540 minutes)
  540: [
    { timezone: 'Asia/Tokyo', city: 'Tokyo (Japan)', type: 'any', priority: 1 },
    { timezone: 'Asia/Seoul', city: 'Seoul (South Korea)', type: 'any', priority: 2 }
  ],
  // UTC+8 (480 minutes)
  480: [
    { timezone: 'Asia/Shanghai', city: 'Shanghai (China)', type: 'any', priority: 1 },
    { timezone: 'Asia/Singapore', city: 'Singapore', type: 'any', priority: 2 },
    { timezone: 'Australia/Perth', city: 'Perth (AUS)', type: 'any', priority: 3 } // AWST (UTC+8) all year
  ],
  // UTC+7 (420 minutes)
  420: [
    { timezone: 'Asia/Bangkok', city: 'Bangkok (Thailand)', type: 'any', priority: 1 },
    { timezone: 'Asia/Jakarta', city: 'Jakarta (Indonesia)', type: 'any', priority: 2 } // WIB (UTC+7)
  ],
  // UTC+6 (360 minutes)
  360: [
    { timezone: 'Asia/Dhaka', city: 'Dhaka (Bangladesh)', type: 'any', priority: 1 },
    { timezone: 'Asia/Almaty', city: 'Almaty (Kazakhstan)', type: 'any', priority: 2 }
  ],
  // UTC+5 (300 minutes)
  300: [
    { timezone: 'Asia/Karachi', city: 'Karachi (Pakistan)', type: 'any', priority: 1 },
    { timezone: 'Asia/Yekaterinburg', city: 'Yekaterinburg (Russia)', type: 'any', priority: 2 }
  ],
  // UTC+4 (240 minutes)
  240: [
    { timezone: 'Asia/Dubai', city: 'Dubai (UAE)', type: 'any', priority: 1 },
    { timezone: 'Europe/Samara', city: 'Samara (Russia)', type: 'any', priority: 2 }
  ],
  // UTC+3 (180 minutes)
  180: [
    { timezone: 'Europe/Moscow', city: 'Moscow (Russia)', type: 'any', priority: 1 },
    { timezone: 'Africa/Nairobi', city: 'Nairobi (Kenya)', type: 'any', priority: 2 } // EAT (UTC+3)
  ],
  // UTC+2 (120 minutes)
  120: [
    { timezone: 'Europe/Berlin', city: 'Berlin (Germany)', type: 'dst', priority: 1 }, // CEST (UTC+2)
    { timezone: 'Africa/Cairo', city: 'Cairo (Egypt)', type: 'any', priority: 2 }, // EET (UTC+2) or EEST (UTC+3)
    { timezone: 'Africa/Johannesburg', city: 'Johannesburg (South Africa)', type: 'any', priority: 3 } // SAST (UTC+2)
  ],
  // UTC+1 (60 minutes)
  60: [
    { timezone: 'Europe/Paris', city: 'Paris (France)', type: 'std', priority: 1 }, // CET (UTC+1)
    { timezone: 'Europe/London', city: 'London (UK)', type: 'dst', priority: 2 }, // BST (UTC+1)
    { timezone: 'Africa/Algiers', city: 'Algiers (Algeria)', type: 'any', priority: 3 } // CET (UTC+1)
  ],
  // UTC+0 (0 minutes)
  0: [
    { timezone: 'Europe/London', city: 'London (UK)', type: 'std', priority: 1 }, // GMT (UTC+0)
    { timezone: 'Atlantic/Reykjavik', city: 'Reykjavik (Iceland)', type: 'any', priority: 2 }, // GMT all year
    { timezone: 'UTC', city: 'UTC', type: 'any', priority: 3 }
  ],
  // UTC-1 (-60 minutes)
  '-60': [
    { timezone: 'Atlantic/Azores', city: 'Azores (Portugal)', type: 'std', priority: 1 }, // AZOT (UTC-1) or AZOST (UTC+0)
    { timezone: 'Atlantic/Cape_Verde', city: 'Cape Verde', type: 'any', priority: 2 } // CVT (UTC-1)
  ],
  // UTC-2 (-120 minutes)
  '-120': [
    { timezone: 'America/Noronha', city: 'Fernando de Noronha (Brazil)', type: 'any', priority: 1 }, // FNT (UTC-2)
    { timezone: 'Atlantic/South_Georgia', city: 'South Georgia (UK)', type: 'any', priority: 2 } // GST (UTC-2)
  ],
  // UTC-3 (-180 minutes)
  '-180': [
    { timezone: 'America/Sao_Paulo', city: 'São Paulo (Brazil)', type: 'std', priority: 1 }, // BRT (UTC-3) or BRST (UTC-2)
    { timezone: 'America/Buenos_Aires', city: 'Buenos Aires (Argentina)', type: 'any', priority: 2 } // ART (UTC-3)
  ],
  // UTC-4 (-240 minutes)
  '-240': [
    { timezone: 'America/New_York', city: 'New York (USA)', type: 'dst', priority: 1 }, // EDT (UTC-4)
    { timezone: 'America/Halifax', city: 'Halifax (Canada)', type: 'std', priority: 2 }, // AST (UTC-4) or ADT (UTC-3)
    { timezone: 'America/La_Paz', city: 'La Paz (Bolivia)', type: 'any', priority: 3 } // BOT (UTC-4)
  ],
  // UTC-5 (-300 minutes)
  '-300': [
    { timezone: 'America/New_York', city: 'New York (USA)', type: 'std', priority: 1 }, // EST (UTC-5)
    { timezone: 'America/Chicago', city: 'Chicago (USA)', type: 'dst', priority: 2 }, // CDT (UTC-5)
    { timezone: 'America/Bogota', city: 'Bogotá (Colombia)', type: 'any', priority: 3 } // COT (UTC-5)
  ],
  // UTC-6 (-360 minutes)
  '-360': [
    { timezone: 'America/Chicago', city: 'Chicago (USA)', type: 'std', priority: 1 }, // CST (UTC-6)
    { timezone: 'America/Denver', city: 'Denver (USA)', type: 'dst', priority: 2 }, // MDT (UTC-6)
    { timezone: 'America/Mexico_City', city: 'Mexico City (Mexico)', type: 'any', priority: 3 } // CST (UTC-6) most of year
  ],
  // UTC-7 (-420 minutes)
  '-420': [
    { timezone: 'America/Denver', city: 'Denver (USA)', type: 'std', priority: 1 }, // MST (UTC-7)
    { timezone: 'America/Los_Angeles', city: 'Los Angeles (USA)', type: 'dst', priority: 2 }, // PDT (UTC-7)
    { timezone: 'America/Phoenix', city: 'Phoenix (USA)', type: 'any', priority: 3 } // MST (UTC-7) all year
  ],
  // UTC-8 (-480 minutes)
  '-480': [
    { timezone: 'America/Los_Angeles', city: 'Los Angeles (USA)', type: 'std', priority: 1 }, // PST (UTC-8)
    { timezone: 'America/Anchorage', city: 'Anchorage (USA)', type: 'dst', priority: 2 } // AKDT (UTC-8)
  ],
  // UTC-9 (-540 minutes)
  '-540': [
    { timezone: 'America/Anchorage', city: 'Anchorage (USA)', type: 'std', priority: 1 }, // AKST (UTC-9)
    { timezone: 'Pacific/Gambier', city: 'Gambier Islands (France)', type: 'any', priority: 2 } // GAMT (UTC-9)
  ],
  // UTC-10 (-600 minutes)
  '-600': [
    { timezone: 'Pacific/Honolulu', city: 'Honolulu (USA)', type: 'any', priority: 1 } // HST (UTC-10)
  ],
  // UTC-11 (-660 minutes)
  '-660': [
    { timezone: 'Pacific/Pago_Pago', city: 'Pago Pago (American Samoa)', type: 'any', priority: 1 }, // SST (UTC-11)
    { timezone: 'Pacific/Niue', city: 'Alofi (Niue)', type: 'any', priority: 2 } // NUT (UTC-11)
  ]
};

// public/js/world-clock-ui.js の先頭部分 (import の後など)

// (上記の cityCandidatesByOffset の定義をここに貼り付ける)

// ターゲットとするUTCオフセット（分単位）
const targetUtcOffsetsInMinutes = [
  720, 660, 600, 540, 480, 420, 360, 300, 240, 180, 120, 60,
  0, -60, -120, -180, -240, -300, -360, -420, -480, -540, -600, -660
]; // UTC+12 から UTC-11 まで (24個)

let worldTimezones = []; // 動的に生成するリスト

function initializeWorldTimezones() {
  const now = moment(); // 現在の日時を一度だけ取得
  const selectedTimezoneNames = new Set(); // 選択されたIANAタイムゾーン名を記録し、重複を避ける

  worldTimezones = targetUtcOffsetsInMinutes.map(targetOffset => {
    const candidates = cityCandidatesByOffset[targetOffset.toString()] || [];
    let bestCandidate = null;

    // 候補の中から、現在の実際のオフセットがターゲットオフセットに一致するものを探す
    for (const candidate of candidates) {
      const currentActualOffset = moment.tz(candidate.timezone).utcOffset(); // moment()インスタンスを渡さない
      if (currentActualOffset === targetOffset) {
        if (!selectedTimezoneNames.has(candidate.timezone)) { // まだ選択されていないIANA名か
          if (!bestCandidate || candidate.priority < bestCandidate.priority) {
            bestCandidate = candidate;
          }
        }
      }
    }

    // もしターゲットオフセットに完全に一致する都市が見つからない場合、
    // または見つかったが既に他のオフセットで同じIANA名が使われている場合、
    // そのオフセットの候補リストからまだ選ばれていないものを優先度順に選ぶ (簡易的なフォールバック)
    if (!bestCandidate) {
      for (const candidate of candidates.sort((a, b) => a.priority - b.priority)) {
        if (!selectedTimezoneNames.has(candidate.timezone)) {
          bestCandidate = candidate;
          // この場合、bestCandidateの実際のオフセットはターゲットと異なる可能性がある
          // console.warn(`For targetOffset ${targetOffset}, fallback to ${candidate.city} (TZ: ${candidate.timezone}) which might have a different current offset.`);
          break;
        }
      }
    }

    // それでも見つからなければ、フォールバックとしてオフセット情報を表示
    if (!bestCandidate) {
        const offsetHours = targetOffset / 60;
        const sign = offsetHours >= 0 ? '+' : '-';
        const absHours = Math.abs(offsetHours);
        return {
            timezone: `Etc/GMT${offsetHours >= 0 ? '-' : '+'}${absHours}`, // moment.jsが解釈できる形式で
            city: `UTC${sign}${String(absHours).padStart(2, '0')}:00`,
            isFallback: true
        };
    }

    selectedTimezoneNames.add(bestCandidate.timezone);
    return { timezone: bestCandidate.timezone, city: bestCandidate.city };
  }).filter(tz => tz); // null や undefined を除去

  // デバッグ用: 選択された24都市のリストと、実際の現在のオフセットを確認
  // console.log("Selected World Timezones for Display:", worldTimezones.map(tz => {
  //   if (tz.isFallback) return tz;
  //   return { city: tz.city, timezone: tz.timezone, currentOffset: moment.tz(tz.timezone).utcOffset() };
  // }));
}

// 既存の (ファイル下部にある) 初期化処理を変更
if (container) {
  initializeWorldTimezones(); // ★最初に呼び出す
  worldTimezones.forEach(tzData => {
    const clockEl = createClockElement(tzData);
    container.appendChild(clockEl);
  });
  updateAllClocksLoop();
} else {
  console.error('Error: world-clocks-container element not found in HTML.');
}


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

  // 3. 表示されている各ワールドクロックの時刻表示を更新する (重要！)
  worldTimezones.forEach(tzData => {
    updateWorldClockTime(tzData); // 各時計のデジタル・アナログ表示を更新
  });

  // 4. 次のフレームで自身を再帰的に呼び出し、アニメーションループを形成する (重要！)
  requestAnimationFrame(updateAllClocksLoop);
}

