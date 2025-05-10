// public/clock-core.js から SCALE_AH をインポートします。
import { SCALE_AH } from '../clock-core.js';

// 3. 地域表示を英語に変更
const worldTimezones = [
  { timezone: 'Pacific/Apia', city: 'Apia (Samoa)' },
  { timezone: 'Pacific/Auckland', city: 'Auckland (New Zealand)' },
  { timezone: 'Pacific/Fiji', city: 'Suva (Fiji)' },
  { timezone: 'Pacific/Noumea', city: 'Noumea (New Caledonia)' },
  { timezone: 'Australia/Sydney', city: 'Sydney (Australia)' },
  { timezone: 'Asia/Tokyo', city: 'Tokyo (Japan)' },
  { timezone: 'Asia/Seoul', city: 'Seoul (South Korea)' },
  { timezone: 'Asia/Shanghai', city: 'Shanghai (China)' },
  { timezone: 'Asia/Singapore', city: 'Singapore' },
  { timezone: 'Asia/Bangkok', city: 'Bangkok (Thailand)' },
  { timezone: 'Asia/Dhaka', city: 'Dhaka (Bangladesh)' },
  { timezone: 'Asia/Karachi', city: 'Karachi (Pakistan)' },
  { timezone: 'Asia/Dubai', city: 'Dubai (UAE)' },
  { timezone: 'Europe/Moscow', city: 'Moscow (Russia)' },
  { timezone: 'Europe/Paris', city: 'Paris (France)' },
  { timezone: 'Europe/Berlin', city: 'Berlin (Germany)' },
  { timezone: 'Europe/London', city: 'London (UK)' },
  { timezone: 'UTC', city: 'UTC' },
  { timezone: 'Atlantic/Azores', city: 'Azores (Portugal)' },
  { timezone: 'America/Sao_Paulo', city: 'São Paulo (Brazil)' },
  { timezone: 'America/New_York', city: 'New York (USA)' },
  { timezone: 'America/Chicago', city: 'Chicago (USA)' },
  { timezone: 'America/Denver', city: 'Denver (USA)' },
  { timezone: 'America/Los_Angeles', city: 'Los Angeles (USA)' }
  // { timezone: 'Pacific/Honolulu', city: 'Honolulu (USA)' }
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
  cityName.textContent = timezoneData.city; // 3. 英語表示に変更済み

  // 1. AH時間と通常時間の表示順序・スタイル変更
  const ahTimeDisplay = document.createElement('div');
  ahTimeDisplay.classList.add('ah-time-display-main'); // 新しいクラス名 (スタイル変更のため)
  ahTimeDisplay.id = `ah-time-${timezoneData.timezone.replace(/[\/\+\:]/g, '-')}`;

  const normalTimeDisplay = document.createElement('div');
  normalTimeDisplay.classList.add('normal-time-display-sub'); // 新しいクラス名 (スタイル変更のため)
  normalTimeDisplay.id = `time-${timezoneData.timezone.replace(/[\/\+\:]/g, '-')}`;

  clockItem.appendChild(cityName);
  clockItem.appendChild(ahTimeDisplay); // AH時間を先に追加
  clockItem.appendChild(normalTimeDisplay); // 通常時間を後に追加

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

  // 通常時刻の表示 (クラス名変更に対応)
  const normalTimeEl = document.getElementById(`time-${timezone.replace(/[\/\+\:]/g, '-')}`);
  if (normalTimeEl) {
    normalTimeEl.textContent = moment(now).tz(timezone).format('HH:mm:ss');
  }

  // AH時刻の計算と表示 (クラス名変更に対応)
  const { ahHours, ahMinutes, ahSeconds, isAHHour } = getAhDigitalTime(now, timezone);
  const ahTimeEl = document.getElementById(`ah-time-${timezone.replace(/[\/\+\:]/g, '-')}`);
  if (ahTimeEl) {
    const ahTimeString =
      `${String(Math.floor(ahHours)).padStart(2, '0')}:${String(Math.floor(ahMinutes)).padStart(2, '0')}:${String(Math.floor(ahSeconds)).padStart(2, '0')}`;
    ahTimeEl.textContent = `AH: ${ahTimeString}`; // "AH: " プレフィックスは維持するか、スタイルで調整
  }

  // 2. AH時間帯のタイムゾーンの時計を点滅させる
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