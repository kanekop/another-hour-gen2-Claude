// public/clock-core.js から SCALE_AH をインポートします。
// public/clock-core.js から SCALE_AH と getAngles をインポートします。
import { SCALE_AH, getAngles } from '../clock-core.js';
// public/js/city-timezones.js から cityCandidatesByOffset をインポートします。
import { cityCandidatesByOffset } from './city-timezones.js'; 

const container = document.getElementById('world-clocks-container');
const userLocalTimezone = moment.tz.guess(); // ★ユーザーのローカルタイムゾーンを取得

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

  // ★ユーザーのローカルタイムゾーンと一致するか確認し、クラスを付与
  if (timezoneData.timezone === userLocalTimezone) {
    cityName.classList.add('user-local-timezone-city');
  }

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

