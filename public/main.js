import { SCALE_AH, getAngles } from './clock-core.js';
// timezone-manager.js から必要な関数をインポート
import { getDisplayTimezones, getUserLocalTimezone, getCityNameByTimezone } from './js/timezone-manager.js';

const timezoneSelect = document.getElementById('timezone-select');
const mainClockCityNameElement = document.getElementById('main-clock-city-name'); // 都市名表示用H3
const digitalClockElement = document.getElementById('digital-clock');
const toggleCheckbox = document.getElementById('toggle-ah-actual-display');
const ahSector = document.getElementById('ah-sector');
const ticks = document.getElementById('ticks');
const hourHand = document.getElementById('hour');
const minuteHand = document.getElementById('minute');
const secondHand = document.getElementById('second');

let settings = {
    timezones: [], // settings.json からは読み込まない方針
    showAHTime: true,
    showActualTime: true
};

// URLクエリから初期タイムゾーンを取得、なければユーザーのローカルタイムゾーン
function getInitialTimezone() {
    const params = new URLSearchParams(window.location.search);
    const urlTimezone = params.get('timezone');
    if (urlTimezone && moment.tz.zone(urlTimezone)) {
        return urlTimezone;
    }
    return getUserLocalTimezone() || 'UTC'; // フォールバックとしてUTC
}

let displayTimezones = []; // timezone-manager から取得するリスト
let selectedTimezone = ''; // 現在選択されているタイムゾーン

// タイムゾーン選択プルダウンを初期化・生成
function initializeTimezoneSelect() {
    displayTimezones = getDisplayTimezones(); // timezone-managerからリスト取得
    timezoneSelect.innerHTML = ''; // プルダウンをクリア

    displayTimezones.forEach(tzData => {
        const option = document.createElement('option');
        option.value = tzData.timezone;
        option.text = tzData.displayText; // 例: "Tokyo (Japan) (UTC+9)"
        timezoneSelect.appendChild(option);
    });

    // 初期タイムゾーンを選択
    selectedTimezone = getInitialTimezone();
    const isValidInitial = displayTimezones.some(tz => tz.timezone === selectedTimezone);
    if (!isValidInitial) {
        // もしURLのタイムゾーンが無効またはリストにない場合、リストの最初のものにするか、ユーザーのローカルにする
        const userLocal = getUserLocalTimezone();
        const userLocalInList = displayTimezones.find(tz => tz.timezone === userLocal);
        selectedTimezone = userLocalInList ? userLocal : (displayTimezones.length > 0 ? displayTimezones[0].timezone : 'UTC');
    }
    timezoneSelect.value = selectedTimezone;
    updateMainClockCityName(selectedTimezone); // 初期都市名を設定
}

// メインクロックの都市名を更新
function updateMainClockCityName(timezoneName) {
    if (mainClockCityNameElement) {
        mainClockCityNameElement.textContent = getCityNameByTimezone(timezoneName);
    }
}

// 目盛り描画
function drawTicks() {
    ticks.innerHTML = '';
    for (let i = 0; i < 60; i++) {
        const angle = i * 6;
        const isMajor = i % 5 === 0;
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        const radius = 95;
        const length = isMajor ? 10 : 5;

        // Add common classes
        line.setAttribute('class', `tick common-clock-tick ${isMajor ? 'major common-clock-tick-major' : ''}`);
        line.setAttribute('x1', 100 + Math.sin(angle * Math.PI / 180) * (radius - length));
        line.setAttribute('y1', 100 - Math.cos(angle * Math.PI / 180) * (radius - length));
        line.setAttribute('x2', 100 + Math.sin(angle * Math.PI / 180) * radius);
        line.setAttribute('y2', 100 - Math.cos(angle * Math.PI / 180) * radius);
        ticks.appendChild(line);
    }
}

// AHセクター描画 (変更なし)
function drawAhSector() {
    const startAngle = 270; // 23時 (アナログ時計の9時位置)
    const endAngle = 300;   // 24時 (アナログ時計の10時位置) - 1時間分
    const radius = 95;
    const x1 = 100 + radius * Math.cos(startAngle * Math.PI / 180);
    const y1 = 100 + radius * Math.sin(startAngle * Math.PI / 180);
    const x2 = 100 + radius * Math.cos(endAngle * Math.PI / 180);
    const y2 = 100 + radius * Math.sin(endAngle * Math.PI / 180);
    ahSector.setAttribute('d', `M 100,100 L ${x1},${y1} A ${radius},${radius} 0 0,1 ${x2},${y2} Z`);
}


function updateClock() {
    const currentSelectedTimezone = timezoneSelect.value;
    if (!currentSelectedTimezone) {
        requestAnimationFrame(updateClock);
        return;
    }

    const currentTime = moment().tz(currentSelectedTimezone);
    const { hourAngle, minuteAngle, secondAngle, ahHours, ahMinutes, ahSeconds } = getAngles(currentTime.toDate(), currentSelectedTimezone);

    const isAHHour = currentTime.hours() === 23;
    document.body.classList.toggle('inverted', isAHHour);
    ahSector.style.display = isAHHour ? 'block' : 'none';

    if (hourHand) hourHand.style.transform = `rotate(${hourAngle}deg)`;
    if (minuteHand) minuteHand.style.transform = `rotate(${minuteAngle}deg)`;
    if (secondHand) secondHand.style.transform = `rotate(${secondAngle}deg)`;

    const mainAhTimeDiv = document.getElementById('main-ah-time');
    const mainNormalTimeDiv = document.getElementById('main-normal-time');

    // #digital-clock が表示されているか（visually-hidden クラスがないか）を確認
    const isDigitalClockVisible = digitalClockElement && !digitalClockElement.classList.contains('visually-hidden');

    if (isDigitalClockVisible) {
        const actualTimeFormatted = currentTime.format('HH:mm:ss');
        const ahTimeFormatted = `${String(Math.floor(ahHours)).padStart(2, '0')}:${String(Math.floor(ahMinutes)).padStart(2, '0')}:${String(Math.floor(ahSeconds)).padStart(2, '0')}`;

        if (settings.showAHTime && mainAhTimeDiv) {
            mainAhTimeDiv.textContent = `AH: ${ahTimeFormatted}`;
            mainAhTimeDiv.style.display = 'block'; // 表示
        } else if (mainAhTimeDiv) {
            mainAhTimeDiv.style.display = 'none'; // 非表示
        }

        if (settings.showActualTime && mainNormalTimeDiv) {
            mainNormalTimeDiv.textContent = `Actual: ${actualTimeFormatted}`;
            mainNormalTimeDiv.style.display = 'block'; // 表示
        } else if (mainNormalTimeDiv) {
            mainNormalTimeDiv.style.display = 'none'; // 非表示
        }
    }
    // #digital-clock 自体が非表示の場合は、中の mainAhTimeDiv や mainNormalTimeDiv の
    // textContent を更新する必要も、個別に表示/非表示を切り替える必要もありません。
    // CSS (.visually-hidden) が #digital-clock 全体を非表示にしているためです。

    requestAnimationFrame(updateClock);
}


// --- 初期設定読み込みとイベントリスナー ---
fetch('/api/settings')
.then(res => res.json())
.then(data => {
    settings.showAHTime = data.showAHTime !== undefined ? data.showAHTime : true;
    settings.showActualTime = data.showActualTime !== undefined ? data.showActualTime : true;

    initializeTimezoneSelect();
    drawTicks();
    drawAhSector();

    if (toggleCheckbox) {
        const shouldBeCheckedByDefault = settings.showAHTime || settings.showActualTime;
        toggleCheckbox.checked = shouldBeCheckedByDefault;

        // #digital-clock の初期表示状態を設定
        if (digitalClockElement) {
            digitalClockElement.classList.toggle('visually-hidden', !shouldBeCheckedByDefault);
        }

        toggleCheckbox.addEventListener('change', () => {
            const isChecked = toggleCheckbox.checked;
            if (digitalClockElement) {
                digitalClockElement.classList.toggle('visually-hidden', !isChecked);
            }
            // updateClock() を呼ぶ必要はありません。次のフレームで自動更新されます。
        });
    }
    updateClock(); // 初期描画とループ開始
})
.catch(error => {
    console.error("Failed to load settings, using defaults:", error);
    initializeTimezoneSelect();
    drawTicks();
    drawAhSector();
    if (toggleCheckbox) {
        toggleCheckbox.checked = true; // デフォルトでON
        if (digitalClockElement) digitalClockElement.classList.remove('visually-hidden'); // 表示状態にする
        toggleCheckbox.dispatchEvent(new Event('change'));
    }
    updateClock();
});

timezoneSelect.addEventListener('change', (event) => {
    selectedTimezone = event.target.value;
    updateMainClockCityName(selectedTimezone);
    // updateClock(); // 変更時に即時更新 (requestAnimationFrameがあるので通常は不要だが、UI反応性を上げるため)
});

const allTimeZoneButton = document.getElementById('all-time-zone-button');
if (allTimeZoneButton) {
    allTimeZoneButton.addEventListener('click', () => {
        window.location.href = '/pages/world-clock.html';
    });
}