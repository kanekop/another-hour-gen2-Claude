// public/js/personalized-ah-clock-ui.js

import { getCustomAhAngles } from "../clock-core.js";
import {
  getDisplayTimezones,
  getUserLocalTimezone,
  getCityNameByTimezone,
} from "./timezone-manager.js";
// ▼▼▼ aph-graph-demo.js からエクスポートされた関数をインポート ▼▼▼
import { drawAphGraph, updateAphAxisLabels } from "./aph-graph-demo.js";
// ▲▲▲ ここまで追加 ▲▲▲

//ローカル保存用定数
const LOCAL_STORAGE_KEY_APH_DURATION = "personalizedAhDurationMinutes";
const LOCAL_STORAGE_KEY_SETTINGS_VISIBLE = 'personalizedAhSettingsVisible';
const LOCAL_STORAGE_KEY_CURRENT_VIEW = 'personalizedAhCurrentView';

// ▼▼▼ 実時間グラフ描画関数を追加 ▼▼▼
function drawRealTimeGraph(realHoursBarElement) {
    if (!realHoursBarElement) {
        console.error("Real hours bar element not provided for drawing.");
        return;
    }
    realHoursBarElement.innerHTML = ''; // クリア

    for (let i = 0; i < 24; i++) {
        const segment = document.createElement('div');
        segment.classList.add('bar-segment'); // aph-graph-demo.css のスタイルを利用
        segment.style.height = `${100 / 24}%`; // 高さを均等に分割
        segment.textContent = i;
        // 必要に応じて aph-graph-demo.html の .real-hours-bar .bar-segment のスタイルを適用
        // 例: segment.style.backgroundColor = '#0c58bb'; (CSSで定義されているなら不要)
        realHoursBarElement.appendChild(segment);
    }
}
// ▲▲▲ ここまで追加 ▲▲▲


// DOM Elements
const elements = {
  // ... (既存の要素参照はそのまま) ...
  normalDurationSlider: document.getElementById("normal-duration-slider"),
  normalDurationDisplay: document.getElementById("normal-duration-display"),
  anotherHourDurationDisplay: document.getElementById(
    "another-hour-duration-display",
  ),
  sliderRealTimeLabel: document.getElementById("slider-real-time-label"),
  sliderRealTimeIndicator: document.querySelector(
    ".slider-real-time-indicator",
  ),
  timezoneSelect: document.getElementById("timezone-select"),
  cityNameDisplay: document.getElementById("personalized-ah-city-name"),
  personalizedAhTitle: document.getElementById("personalized-ah-title"),
  analogClock: document.getElementById("personalized-ah-analog-clock"),
  ahSector: document.getElementById("ah-personalized-sector"),
  ahSectorIndicatorLine: document.getElementById(
    "ah-personalized-sector-indicator",
  ),
  ticks: document.getElementById("ticks-personalized"),
  hands: {
    hour: document.getElementById("hour-personalized"),
    minute: document.getElementById("minute-personalized"),
    second: document.getElementById("second-personalized"),
  },
  digitalAphTime: document.getElementById("personalized-aph-time"),
  digitalNormalTime: document.getElementById("personalized-normal-time"),
  digitalAphRemaining: document.getElementById("personalized-aph-remaining"),
  settingsPanel: document.getElementById('aph-settings-panel'),
  toggleViewBtn: document.getElementById('toggle-view-btn'),
  clockViewContainer: document.getElementById('clock-view-container'),
  // ▼▼▼ グラフ表示用の新しい要素参照を追加 ▼▼▼
  personalizedAphGraphContainer: document.getElementById('personalizedAphGraphContainer'), // グラフ全体のコンテナ
  personalizedAphGraphBar: document.getElementById('personalizedAphGraphBar'),             // グラフのバー部分
  personalizedAphAxisLabels: document.getElementById('personalizedAphAxisLabels'),         // グラフのY軸ラベル部分
  // ▲▲▲ ここまで追加 ▲▲▲
  // ▼▼▼ 実時間グラフ用の要素参照を追加 ▼▼▼
  personalizedRealHoursBar: document.getElementById('personalizedRealHoursBar'),
  // ▲▲▲ ここまで追加 ▲▲▲
};

// Application State (変更なし)
const state = {
  selectedTimezone: "",
  normalAphDayDurationMinutes: 1380, // Default to 23 hours (23 * 60)
  displayTimezones: [],
  animationFrameId: null,
};

// --- Utility Functions ---
// formatDuration は aph-graph-demo.js からインポートしても良いですが、
// こちらにもあるので、そのまま利用します。
function formatDuration(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours} hours ${minutes} minutes`;
}

// スライダー関連の表示を更新する専用関数
function updateSliderRelatedDisplays() {
  if (
    !elements.normalDurationSlider ||
    !elements.anotherHourDurationDisplay ||
    !elements.sliderRealTimeLabel ||
    !elements.sliderRealTimeIndicator ||
    !elements.normalDurationDisplay
  ) {
    return;
  }

  const normalAphDayMinutes = parseInt(elements.normalDurationSlider.value, 10);

  elements.normalDurationDisplay.textContent = `Normal APH Day: ${formatDuration(normalAphDayMinutes)}`;
  const totalRealMinutesInDay = 24 * 60;
  const aphDurationMinutes = totalRealMinutesInDay - normalAphDayMinutes;
  elements.anotherHourDurationDisplay.textContent = `${formatDuration(aphDurationMinutes)}`; // APH Duration の表示を修正

  const realTimeHourEquivalent = Math.floor(normalAphDayMinutes / 60);
  const realTimeMinuteEquivalent = normalAphDayMinutes % 60;
  elements.sliderRealTimeLabel.textContent = `${String(realTimeHourEquivalent).padStart(2, "0")}:${String(realTimeMinuteEquivalent).padStart(2, "0")}`;

  const sliderMin = parseInt(elements.normalDurationSlider.min, 10);
  const sliderMax = parseInt(elements.normalDurationSlider.max, 10);
  const thumbPositionRatio =
    (normalAphDayMinutes - sliderMin) / (sliderMax - sliderMin);

  elements.sliderRealTimeIndicator.style.setProperty(
    "--slider-thumb-position",
    `${thumbPositionRatio * 100}%`,
  );
  elements.normalDurationSlider.style.setProperty(
    "--slider-progress-percent",
    `${thumbPositionRatio * 100}%`,
  );

  // ▼▼▼ スライダーの値が変更されたらグラフも更新 ▼▼▼
  if (elements.personalizedAphGraphBar && elements.personalizedAphAxisLabels && elements.personalizedAphGraphContainer) {
    drawAphGraph(elements.personalizedAphGraphBar, normalAphDayMinutes);
    updateAphAxisLabels(elements.personalizedAphAxisLabels, elements.personalizedAphGraphContainer, normalAphDayMinutes);
  }
  // ▲▲▲ ここまで追加 ▲▲▲
}

// --- Initialization Functions ---
function initializeSlider() {
  if (!elements.normalDurationSlider) return;

  const savedDurationString = localStorage.getItem(
    LOCAL_STORAGE_KEY_APH_DURATION,
  );
  if (savedDurationString !== null) {
    const savedDurationInt = parseInt(savedDurationString, 10);
    const sliderMin = parseInt(elements.normalDurationSlider.min, 10);
    const sliderMax = parseInt(elements.normalDurationSlider.max, 10);
    if (
      !isNaN(savedDurationInt) &&
      savedDurationInt >= sliderMin &&
      savedDurationInt <= sliderMax
    ) {
      state.normalAphDayDurationMinutes = savedDurationInt;
    }
  }
  elements.normalDurationSlider.value =
    state.normalAphDayDurationMinutes.toString();

  // ▼▼▼ 実時間グラフの初期描画を追加 ▼▼▼
  if (elements.personalizedRealHoursBar) {
      drawRealTimeGraph(elements.personalizedRealHoursBar);
  }
  // ▲▲▲ ここまで追加 ▲▲▲
  

  // スライダーの初期値をUIに反映 (グラフも含む)
  updateSliderRelatedDisplays(); // この中でグラフも初期描画される

  elements.normalDurationSlider.addEventListener("input", () => {
    state.normalAphDayDurationMinutes = parseInt(
      elements.normalDurationSlider.value,
      10,
    );
    updateSliderRelatedDisplays(); // スライダー変更時にテキストとグラフを更新
    localStorage.setItem(
      LOCAL_STORAGE_KEY_APH_DURATION,
      state.normalAphDayDurationMinutes.toString(),
    );
  });
}


function initializeViewToggle() {
  if (!elements.clockViewContainer || !elements.settingsPanel || !elements.toggleViewBtn) {
    console.error("Required elements for view toggle not found.");
    return;
  }

  const savedView = localStorage.getItem(LOCAL_STORAGE_KEY_CURRENT_VIEW);
  let showClockView = (savedView === 'clock' || savedView === null);

  function updateView(showClock) {
    if (showClock) {
      elements.clockViewContainer.style.display = 'block';
      elements.settingsPanel.style.display = 'none';
      elements.toggleViewBtn.textContent = 'Show Settings';
      localStorage.setItem(LOCAL_STORAGE_KEY_CURRENT_VIEW, 'clock');
    } else {
      elements.clockViewContainer.style.display = 'none';
      elements.settingsPanel.style.display = 'block';
      elements.toggleViewBtn.textContent = 'Show Clock';
      localStorage.setItem(LOCAL_STORAGE_KEY_CURRENT_VIEW, 'settings');
      // ▼▼▼ 設定パネル表示時に実時間グラフも描画 ▼▼▼
      if (elements.personalizedRealHoursBar) {
          drawRealTimeGraph(elements.personalizedRealHoursBar);
      }
      // ▲▲▲ ここまで追加 ▲▲▲
      // ▼▼▼ 設定パネル表示時にグラフを現在のスライダー値で再描画/初期描画 ▼▼▼
      if (elements.normalDurationSlider && elements.personalizedAphGraphBar && elements.personalizedAphAxisLabels && elements.personalizedAphGraphContainer) {
          const currentSliderValue = parseInt(elements.normalDurationSlider.value, 10);
          drawAphGraph(elements.personalizedAphGraphBar, currentSliderValue);
          updateAphAxisLabels(elements.personalizedAphAxisLabels, elements.personalizedAphGraphContainer, currentSliderValue);
      }
      // ▲▲▲ ここまで追加 ▲▲▲
    }
  }

  updateView(showClockView);

  elements.toggleViewBtn.addEventListener('click', () => {
    const currentlyShowingClock = elements.settingsPanel.style.display === 'none';
    updateView(!currentlyShowingClock);
  });
}

function initializeTimezoneSelect() {
  if (!elements.timezoneSelect) return;

  state.displayTimezones = getDisplayTimezones();
  elements.timezoneSelect.innerHTML = "";

  state.displayTimezones.forEach((tzData) => {
    const option = new Option(tzData.displayText, tzData.timezone);
    elements.timezoneSelect.appendChild(option);
  });

  const params = new URLSearchParams(window.location.search);
  const urlTimezone = params.get("timezone");
  let initialTimezone =
    urlTimezone && moment.tz.zone(urlTimezone)
      ? urlTimezone
      : getUserLocalTimezone() || "UTC";

  const isValidInitial = state.displayTimezones.some(
    (tz) => tz.timezone === initialTimezone,
  );
  if (!isValidInitial) {
    const userLocalInList = state.displayTimezones.find(
      (tz) => tz.timezone === getUserLocalTimezone(),
    );
    initialTimezone = userLocalInList
      ? userLocalInList.timezone
      : state.displayTimezones.length > 0
        ? state.displayTimezones[0].timezone
        : "UTC";
  }

  state.selectedTimezone = initialTimezone;
  elements.timezoneSelect.value = state.selectedTimezone;
  updateCityNameDisplay(state.selectedTimezone);

  elements.timezoneSelect.addEventListener("change", (event) => {
    state.selectedTimezone = event.target.value;
    updateCityNameDisplay(state.selectedTimezone);
    // updatePersonalizedClock();
  });
}

function updateCityNameDisplay(timezoneName) {
  if (elements.cityNameDisplay) {
    elements.cityNameDisplay.textContent = getCityNameByTimezone(timezoneName);
  }
}

function drawTicks() {
  if (!elements.ticks) return;
  elements.ticks.innerHTML = "";
  for (let i = 0; i < 60; i++) {
    const angle = i * 6;
    const isMajor = i % 5 === 0;
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    const radius = 95;
    const length = isMajor ? 10 : 5;

    line.setAttribute(
      "class",
      `tick common-clock-tick ${isMajor ? "major common-clock-tick-major" : ""}`,
    );
    line.setAttribute(
      "x1",
      (100 + Math.sin((angle * Math.PI) / 180) * (radius - length)).toString(),
    );
    line.setAttribute(
      "y1",
      (100 - Math.cos((angle * Math.PI) / 180) * (radius - length)).toString(),
    );
    line.setAttribute(
      "x2",
      (100 + Math.sin((angle * Math.PI) / 180) * radius).toString(),
    );
    line.setAttribute(
      "y2",
      (100 - Math.cos((angle * Math.PI) / 180) * radius).toString(),
    );
    elements.ticks.appendChild(line);

    if (isMajor) {
      const hourNumber = i / 5 === 0 ? 12 : i / 5;
      const text = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text",
      );
      text.setAttribute(
        "x",
        (
          100 +
          Math.sin((angle * Math.PI) / 180) * (radius - length - 10)
        ).toString(),
      );
      text.setAttribute(
        "y",
        (
          100 -
          Math.cos((angle * Math.PI) / 180) * (radius - length - 10) +
          4
        ).toString(),
      );
      text.setAttribute("class", "hour-number");
      text.setAttribute("text-anchor", "middle");
      text.textContent = hourNumber.toString();
      elements.ticks.appendChild(text);
    }
  }
}

function drawAhPersonalizedSector(
  startAngleDegrees,
  originalSweepAngleDegrees,
) {
  if (!elements.ahSector || !elements.ahSectorIndicatorLine) return;

  const radius = 95;
  const cx = 100;
  const cy = 100;
  const displaySweepAngleDegrees = Math.min(originalSweepAngleDegrees, 359.999);

  if (displaySweepAngleDegrees <= 0.001) {
    elements.ahSector.setAttribute("d", "");
    elements.ahSectorIndicatorLine.style.display = "none";
    return;
  }

  const svgStartAngle = startAngleDegrees - 90;
  const svgDisplayEndAngle = svgStartAngle + displaySweepAngleDegrees;
  const startRad = (svgStartAngle * Math.PI) / 180;
  const endRad = (svgDisplayEndAngle * Math.PI) / 180;
  const x1 = cx + radius * Math.cos(startRad);
  const y1 = cy + radius * Math.sin(startRad);
  const x2 = cx + radius * Math.cos(endRad);
  const y2 = cy + radius * Math.sin(endRad);
  const largeArcFlag = displaySweepAngleDegrees > 180 ? 1 : 0;
  const d_sector = [
    `M ${cx},${cy}`,
    `L ${x1},${y1}`,
    `A ${radius},${radius} 0 ${largeArcFlag} 1 ${x2},${y2}`,
    "Z",
  ].join(" ");
  elements.ahSector.setAttribute("d", d_sector);

  if (originalSweepAngleDegrees > 360) {
    const indicatorAngleDegrees = originalSweepAngleDegrees % 360; // 360度を超えた分
    const svgIndicatorAngle = (startAngleDegrees + indicatorAngleDegrees) - 90; // セクター開始角度からの相対的な角度
    const indicatorRad = (svgIndicatorAngle * Math.PI) / 180;
    const indicatorX = cx + radius * Math.cos(indicatorRad);
    const indicatorY = cy + radius * Math.sin(indicatorRad);
    elements.ahSectorIndicatorLine.setAttribute("x1", cx.toString());
    elements.ahSectorIndicatorLine.setAttribute("y1", cy.toString());
    elements.ahSectorIndicatorLine.setAttribute("x2", indicatorX.toString());
    elements.ahSectorIndicatorLine.setAttribute("y2", indicatorY.toString());
    elements.ahSectorIndicatorLine.style.display = "block";
  } else {
    elements.ahSectorIndicatorLine.style.display = "none";
  }
}

function updatePersonalizedClock() {
  if (!state.selectedTimezone || !elements.hands.hour) {
    state.animationFrameId = requestAnimationFrame(updatePersonalizedClock);
    return;
  }

  const currentNormalAphDayDurationMinutes = state.normalAphDayDurationMinutes;
  const now = new Date();
  const localTime = moment(now).tz(state.selectedTimezone);

  const {
    hourAngle,
    minuteAngle,
    secondAngle,
    aphHours,
    aphMinutes,
    aphSeconds,
    ahSectorStartAngleDegrees,
    ahSectorSweepAngleDegrees,
    isPersonalizedAhPeriod,
  } = getCustomAhAngles(
    now,
    state.selectedTimezone,
    currentNormalAphDayDurationMinutes,
  );

  elements.hands.hour.style.transform = `rotate(${hourAngle}deg)`;
  elements.hands.minute.style.transform = `rotate(${minuteAngle}deg)`;
  elements.hands.second.style.transform = `rotate(${secondAngle}deg)`;

  const aphTimeDisplayElement = elements.digitalAphTime;
  const actualTimeDisplayElement = elements.digitalNormalTime;
  const remainingTimeDisplayElement = elements.digitalAphRemaining;

  if (aphTimeDisplayElement) {
    aphTimeDisplayElement.textContent = `APH Time: ${String(aphHours).padStart(2, "0")}:${String(aphMinutes).padStart(2, "0")}:${String(Math.floor(aphSeconds)).padStart(2, "0")}`;
  }
  if (actualTimeDisplayElement) {
    actualTimeDisplayElement.textContent = `Actual: ${localTime.format("HH:mm:ss")}`;
  }

  if (isPersonalizedAhPeriod) {
    if (aphTimeDisplayElement) aphTimeDisplayElement.style.display = 'none';
    if (actualTimeDisplayElement) actualTimeDisplayElement.style.display = 'block';

    if (remainingTimeDisplayElement) {
      const totalRealMinutesInDay = 24 * 60;
      const aphPeriodTotalRealMinutes = totalRealMinutesInDay - currentNormalAphDayDurationMinutes;

      const aphStartDateTime = moment(localTime)
        .startOf("day")
        .add(currentNormalAphDayDurationMinutes, "minutes");
      const aphEndDateTime = moment(aphStartDateTime).add(
        aphPeriodTotalRealMinutes,
        "minutes",
      );
      const remainingRealMs = Math.max(0, aphEndDateTime.diff(localTime));

      if (remainingRealMs > 0) {
        const remainingSecondsTotal = Math.floor(remainingRealMs / 1000);
        const remainingH = Math.floor(remainingSecondsTotal / 3600);
        const remainingM = Math.floor((remainingSecondsTotal % 3600) / 60);
        const remainingS = remainingSecondsTotal % 60;
        remainingTimeDisplayElement.textContent = `APH Remaining: ${String(remainingH).padStart(2, "0")}:${String(remainingM).padStart(2, "0")}:${String(remainingS).padStart(2, "0")}`;
        remainingTimeDisplayElement.style.display = "block";
      } else {
        remainingTimeDisplayElement.textContent = `APH Remaining: 00:00:00`;
        remainingTimeDisplayElement.style.display = "block";
      }
    }

    if (elements.ahSector) {
      drawAhPersonalizedSector(ahSectorStartAngleDegrees, ahSectorSweepAngleDegrees);
      elements.ahSector.style.display = "block";
    }
    if (elements.personalizedAhTitle) {
      elements.personalizedAhTitle.textContent = "You are now in APH Period.";
      elements.personalizedAhTitle.style.color = "var(--dark-text)"; // components.css で定義されている想定
    }
    document.body.classList.add("inverted");

  } else {
    if (aphTimeDisplayElement) aphTimeDisplayElement.style.display = 'block';
    if (actualTimeDisplayElement) actualTimeDisplayElement.style.display = 'block';
    if (remainingTimeDisplayElement) remainingTimeDisplayElement.style.display = 'none';

    if (elements.ahSector) {
      elements.ahSector.style.display = 'none';
      if (elements.ahSectorIndicatorLine) {
        elements.ahSectorIndicatorLine.style.display = 'none';
      }
    }
    if (elements.personalizedAhTitle) {
      elements.personalizedAhTitle.textContent = "Personalized AH Clock";
      elements.personalizedAhTitle.style.color = "";
    }
    document.body.classList.remove("inverted");
  }

  state.animationFrameId = requestAnimationFrame(updatePersonalizedClock);
}


// --- Main Initialization ---
function initialize() {
  if (typeof moment === "undefined" || typeof moment.tz === "undefined") {
    console.error(
      "Moment.js and Moment Timezone are not loaded. Personalized AH Clock cannot be fully initialized.",
    );
    if (elements.cityNameDisplay)
      elements.cityNameDisplay.textContent = "Error: Time library not loaded.";
    return;
  }

  initializeTimezoneSelect();
  initializeSlider(); // スライダー初期化時にグラフも初期描画される
  drawTicks();
  initializeViewToggle();

  if (state.animationFrameId) cancelAnimationFrame(state.animationFrameId);
  updatePersonalizedClock();
}

initialize();

window.addEventListener("unload", () => {
  if (state.animationFrameId) {
    cancelAnimationFrame(state.animationFrameId);
  }
});