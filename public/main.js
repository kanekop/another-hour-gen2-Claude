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

// 目盛り描画 (変更なし)
function drawTicks() {
    ticks.innerHTML = '';
    for (let i = 0; i < 60; i++) {
        const angle = i * 6;
        const isMajor = i % 5 === 0;
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        const radius = 95;
        const length = isMajor ? 10 : 5;

        line.setAttribute('class', `tick ${isMajor ? 'major' : ''}`);
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
        // console.warn("No timezone selected, skipping update.");
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

    if (toggleCheckbox && toggleCheckbox.checked) {
        digitalClockElement.classList.remove('hidden');
        let digitalOutput = '';
        const actualTimeFormatted = currentTime.format('HH:mm:ss');
        const ahTimeFormatted = `${String(Math.floor(ahHours)).padStart(2, '0')}:${String(Math.floor(ahMinutes)).padStart(2, '0')}:${String(Math.floor(ahSeconds)).padStart(2, '0')}`;

        if (settings.showAHTime && mainAhTimeDiv) {
            mainAhTimeDiv.textContent = `AH: ${ahTimeFormatted}`;
            mainAhTimeDiv.classList.remove('hidden');
        } else if (mainAhTimeDiv) {
            mainAhTimeDiv.classList.add('hidden');
        }

        if (settings.showActualTime && mainNormalTimeDiv) {
            mainNormalTimeDiv.textContent = `Actual: ${actualTimeFormatted}`;
            mainNormalTimeDiv.classList.remove('hidden');
        } else if (mainNormalTimeDiv) {
            mainNormalTimeDiv.classList.add('hidden');
        }


    } else {
        if (mainAhTimeDiv) mainAhTimeDiv.classList.add('hidden');
        if (mainNormalTimeDiv) mainNormalTimeDiv.classList.add('hidden');
    }

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

        // トグルスイッチの初期状態とイベントリスナー
        if (toggleCheckbox) {
            // settings.json に基づいてメインクロックのAH/Actual表示チェックボックスの初期状態を設定
            // ここでは、どちらか一方でも表示設定がONならチェックを入れる仕様とします
            const shouldBeCheckedByDefault = settings.showAHTime || settings.showActualTime;
            toggleCheckbox.checked = shouldBeCheckedByDefault;

            // main-ah-time と main-normal-time の初期表示/非表示
            const mainAhTimeDiv = document.getElementById('main-ah-time');
            const mainNormalTimeDiv = document.getElementById('main-normal-time');

            if (mainAhTimeDiv) mainAhTimeDiv.classList.toggle('hidden', !(settings.showAHTime && shouldBeCheckedByDefault));
            if (mainNormalTimeDiv) mainNormalTimeDiv.classList.toggle('hidden', !(settings.showActualTime && shouldBeCheckedByDefault));
            if (digitalClockElement) digitalClockElement.classList.toggle('hidden', !shouldBeCheckedByDefault);


            toggleCheckbox.addEventListener('change', () => {
                const isChecked = toggleCheckbox.checked;
                if (digitalClockElement) digitalClockElement.classList.toggle('hidden', !isChecked);
                if (mainAhTimeDiv) mainAhTimeDiv.classList.toggle('hidden', !(settings.showAHTime && isChecked));
                if (mainNormalTimeDiv) mainNormalTimeDiv.classList.toggle('hidden', !(settings.showActualTime && isChecked));
                // updateClock(); // 表示内容を即時更新するために呼び出し
            });
        }
        updateClock(); // 初期描画とループ開始
    })
    .catch(error => {
        console.error("Failed to load settings, using defaults:", error);
        initializeTimezoneSelect();
        drawTicks();
        drawAhSector();
        if (toggleCheckbox) { // フォールバックの場合もトグルは有効にしておく
            toggleCheckbox.checked = true; // デフォルトでON
            toggleCheckbox.dispatchEvent(new Event('change')); // 念のためchangeイベントを発火
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