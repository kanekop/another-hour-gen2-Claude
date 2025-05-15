// public/js/personalized-ah-clock-ui.js

import { getCustomAhAngles } from "../clock-core.js"; // 修正: '../clock-core.js'
import {
  getDisplayTimezones,
  getUserLocalTimezone,
  getCityNameByTimezone,
} from "./timezone-manager.js";

//ローカル保存用定数
const LOCAL_STORAGE_KEY_APH_DURATION = "personalizedAhDurationMinutes";
const LOCAL_STORAGE_KEY_SETTINGS_VISIBLE = 'personalizedAhSettingsVisible';
const LOCAL_STORAGE_KEY_CURRENT_VIEW = 'personalizedAhCurrentView'; // ★ キー名変更: 'settings' or 'clock'



// DOM Elements
const elements = {
  normalDurationSlider: document.getElementById("normal-duration-slider"),
  normalDurationDisplay: document.getElementById("normal-duration-display"), // 「Normal APH Day: X hours Y minutes」用
  anotherHourDurationDisplay: document.getElementById(
    "another-hour-duration-display",
  ), // 「Another Personalized Hour Duration: ...」用
  sliderRealTimeLabel: document.getElementById("slider-real-time-label"), // ▲マーク下の HH:MM 表示用
  sliderRealTimeIndicator: document.querySelector(
    ".slider-real-time-indicator",
  ), // ▲マークとテキストの親要素

  timezoneSelect: document.getElementById("timezone-select"),
  cityNameDisplay: document.getElementById("personalized-ah-city-name"),
  personalizedAhTitle: document.getElementById("personalized-ah-title"), // タイトルh2要素
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
  toggleSettingsBtn: document.getElementById('toggle-settings-panel-btn'),
  // **** ↓↓↓ 新しい要素と変更された要素の参照を追加 ↓↓↓ ****
  clockViewContainer: document.getElementById('clock-view-container'), // ★ 時計表示エリアのコンテナ
  toggleViewBtn: document.getElementById('toggle-view-btn'),            // ★ 新しいトグルボタン
  // **** ↑↑↑ ここまで追加 ↑↑↑ ****
};

// Application State (変更なし)
const state = {
  selectedTimezone: "",
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
  if (
    !elements.normalDurationSlider ||
    !elements.anotherHourDurationDisplay ||
    !elements.sliderRealTimeLabel ||
    !elements.sliderRealTimeIndicator ||
    !elements.normalDurationDisplay
  ) {
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
  elements.sliderRealTimeLabel.textContent = `${String(realTimeHourEquivalent).padStart(2, "0")}:${String(realTimeMinuteEquivalent).padStart(2, "0")}`;

  // 4. ▲マークとリアルタイム表示の位置更新
  const sliderMin = parseInt(elements.normalDurationSlider.min, 10);
  const sliderMax = parseInt(elements.normalDurationSlider.max, 10);
  const thumbPositionRatio =
    (normalAphDayMinutes - sliderMin) / (sliderMax - sliderMin);

  // CSSカスタムプロパティでつまみの位置をCSSに渡す
  elements.sliderRealTimeIndicator.style.setProperty(
    "--slider-thumb-position",
    `${thumbPositionRatio * 100}%`,
  );

  // 5. スライダーのトラックのグラデーション更新
  elements.normalDurationSlider.style.setProperty(
    "--slider-progress-percent",
    `${thumbPositionRatio * 100}%`,
  );
}

// --- Initialization Functions ---
function initializeSlider() {
  if (!elements.normalDurationSlider) return;

  // localStorageから保存された値を読み込む
  const savedDurationString = localStorage.getItem(
    LOCAL_STORAGE_KEY_APH_DURATION,
  );
  if (savedDurationString !== null) {
    const savedDurationInt = parseInt(savedDurationString, 10);
    // 保存された値が有効な数値であり、スライダーのmin/max範囲内であることを確認（より堅牢にする場合）
    const sliderMin = parseInt(elements.normalDurationSlider.min, 10);
    const sliderMax = parseInt(elements.normalDurationSlider.max, 10);
    if (
      !isNaN(savedDurationInt) &&
      savedDurationInt >= sliderMin &&
      savedDurationInt <= sliderMax
    ) {
      state.normalAphDayDurationMinutes = savedDurationInt;
    }
    // 無効な値の場合は、stateのデフォルト値(1380)がそのまま使われる
  }
  // localStorageに値がない場合も、stateのデフォルト値(1380)が使われる

  elements.normalDurationSlider.value =
    state.normalAphDayDurationMinutes.toString();
  updateSliderRelatedDisplays();

  elements.normalDurationSlider.addEventListener("input", () => {
    state.normalAphDayDurationMinutes = parseInt(
      elements.normalDurationSlider.value,
      10,
    );
    updateSliderRelatedDisplays();
    // localStorageに現在のスライダー値を保存
    localStorage.setItem(
      LOCAL_STORAGE_KEY_APH_DURATION,
      state.normalAphDayDurationMinutes.toString(),
    );
    // updatePersonalizedClock(); // スライダー変更時に時計も即時更新する場合
  });
}

// 表示管理トグルボタンのInitialize
// **** ここから新しい関数とイベントリスナーを追加 ****
function initializeSettingsPanelToggle() {
  if (!elements.settingsPanel || !elements.toggleSettingsBtn) return;

  // localStorageから表示状態を読み込む
  const savedVisibility = localStorage.getItem(LOCAL_STORAGE_KEY_SETTINGS_VISIBLE);
  let initiallyHidden = false; // デフォルトは表示 (★修正: ロシア語 -> 英語)

  if (savedVisibility === 'hidden') {
    initiallyHidden = true; // ★修正: ロシア語 -> 英語
  }

  if (initiallyHidden) { // ★修正: ロシア語 -> 英語
    elements.settingsPanel.style.display = 'none';
    elements.toggleSettingsBtn.textContent = 'Show Settings';
  } else {
    elements.settingsPanel.style.display = 'block'; // または '' でCSSのデフォルトに従う
    elements.toggleSettingsBtn.textContent = 'Hide Settings';
  }

  elements.toggleSettingsBtn.addEventListener('click', () => {
    const isHidden = elements.settingsPanel.style.display === 'none';
    if (isHidden) {
      elements.settingsPanel.style.display = 'block'; // または ''
      elements.toggleSettingsBtn.textContent = 'Hide Settings';
      localStorage.setItem(LOCAL_STORAGE_KEY_SETTINGS_VISIBLE, 'visible');
    } else {
      elements.settingsPanel.style.display = 'none';
      elements.toggleSettingsBtn.textContent = 'Show Settings';
      localStorage.setItem(LOCAL_STORAGE_KEY_SETTINGS_VISIBLE, 'hidden');
    }
  });
}
// **** ここまで新しい関数とイベントリスナーを追加 ****
// **** ビュー切り替え機能の初期化関数 (旧 initializeSettingsPanelToggle を大幅に変更) ****
function initializeViewToggle() {
  if (!elements.clockViewContainer || !elements.settingsPanel || !elements.toggleViewBtn) {
    console.error("Required elements for view toggle not found.");
    return;
  }

  const savedView = localStorage.getItem(LOCAL_STORAGE_KEY_CURRENT_VIEW);
  // デフォルトは時計表示 (settingsVisible が 'clock' または null の場合)
  let showClockView = (savedView === 'clock' || savedView === null);

  function updateView(showClock) {
    if (showClock) {
      elements.clockViewContainer.style.display = 'block'; // あるいはCSSクラスで制御
      elements.settingsPanel.style.display = 'none';
      elements.toggleViewBtn.textContent = 'Show Settings';
      localStorage.setItem(LOCAL_STORAGE_KEY_CURRENT_VIEW, 'clock');
    } else {
      elements.clockViewContainer.style.display = 'none';
      elements.settingsPanel.style.display = 'block'; // あるいはCSSクラスで制御
      elements.toggleViewBtn.textContent = 'Show Clock';
      localStorage.setItem(LOCAL_STORAGE_KEY_CURRENT_VIEW, 'settings');
    }
  }

  // 初期表示を設定
  updateView(showClockView);

  elements.toggleViewBtn.addEventListener('click', () => {
    // 現在時計が表示されているか (settingsPanel が非表示か) で判断
    const currentlyShowingClock = elements.settingsPanel.style.display === 'none';
    updateView(!currentlyShowingClock); // 現在の状態を反転させる
  });
}


// initializeTimezoneSelect, updateCityNameDisplay, drawTicks は変更なし (前回提示のままとします)
// ただし、getCustomAhAngles の import パスは確認してください。
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
    // updatePersonalizedClock(); // タイムゾーン変更時に時計も即時更新
  });
}

function updateCityNameDisplay(timezoneName) {
  if (elements.cityNameDisplay) {
    elements.cityNameDisplay.textContent = getCityNameByTimezone(timezoneName);
  }
}

function drawTicks() {
  // `public/js/personalized-ah-clock-ui.js` にある前提
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
      ); // 数値を少し内側に
      text.setAttribute(
        "y",
        (
          100 -
          Math.cos((angle * Math.PI) / 180) * (radius - length - 10) +
          4
        ).toString(),
      ); // Y軸微調整
      text.setAttribute("class", "hour-number"); // components.css でスタイル定義想定
      text.setAttribute("text-anchor", "middle");
      text.textContent = hourNumber.toString();
      elements.ticks.appendChild(text);
    }
  }
}

// drawAhPersonalizedSector 関数 (変更なし、前回提示のまま)
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
    const indicatorAngleDegrees = originalSweepAngleDegrees % 360;
    const svgIndicatorAngle = indicatorAngleDegrees - 90;
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

// --- Clock Update Function ---
// public/js/personalized-ah-clock-ui.js
// ...

// --- Clock Update Function ---
function updatePersonalizedClock() {
  if (!state.selectedTimezone || !elements.hands.hour) {
    state.animationFrameId = requestAnimationFrame(updatePersonalizedClock);
    return;
  }

  const currentNormalAphDayDurationMinutes = state.normalAphDayDurationMinutes;
  const now = new Date(); // Momentオブジェクトではなく、Dateオブジェクトを渡す
  const localTime = moment(now).tz(state.selectedTimezone); // 現在時刻をmomentオブジェクトとして取得

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
  ); // `now` を渡す

  elements.hands.hour.style.transform = `rotate(${hourAngle}deg)`;
  elements.hands.minute.style.transform = `rotate(${minuteAngle}deg)`;
  elements.hands.second.style.transform = `rotate(${secondAngle}deg)`;

  if (elements.digitalAphTime) {
    elements.digitalAphTime.textContent = `APH Time: ${String(aphHours).padStart(2, "0")}:${String(aphMinutes).padStart(2, "0")}:${String(Math.floor(aphSeconds)).padStart(2, "0")}`;
  }
  if (elements.digitalNormalTime) {
    elements.digitalNormalTime.textContent = `Actual: ${localTime.format("HH:mm:ss")}`; // localTime を使用
  }

  // **** ここから残り時間表示のロジック ****
  if (elements.digitalAphRemaining) {
    if (isPersonalizedAhPeriod) {
      const totalRealMinutesInDay = 24 * 60;
      const aphPeriodTotalRealMinutes =
        totalRealMinutesInDay - currentNormalAphDayDurationMinutes;

      // APH期間が始まった時刻 (リアルタイムの日の始まりからの分数)
      const aphPeriodStartRealMinutesIntoDay =
        currentNormalAphDayDurationMinutes;

      // 現在時刻 (リアルタイムの日の始まりからの分数)
      const currentRealMinutesIntoDay =
        localTime.hours() * 60 + localTime.minutes();

      // APH期間の終了時刻 (リアルタイムの日の始まりからの分数)
      // normalAphDayDurationMinutes が 0 の場合、aphPeriodEndRealMinutesIntoDay は 1440 となる
      // normalAphDayDurationMinutes が 1440 の場合、aphPeriodEndRealMinutesIntoDay は 1440 となり、APH期間は0
      let aphPeriodEndRealMinutesIntoDay;
      if (
        currentNormalAphDayDurationMinutes === 0 &&
        aphPeriodTotalRealMinutes === totalRealMinutesInDay
      ) {
        // APH期間が丸一日続く場合（normal duration が 0 の特殊ケース）
        aphPeriodEndRealMinutesIntoDay = totalRealMinutesInDay; // 日の終わり
      } else if (aphPeriodTotalRealMinutes === 0) {
        // APH期間がない場合（normal duration が 24時間 の特殊ケース）
        aphPeriodEndRealMinutesIntoDay = currentNormalAphDayDurationMinutes; // APH期間は存在しない
      } else {
        aphPeriodEndRealMinutesIntoDay =
          aphPeriodStartRealMinutesIntoDay + aphPeriodTotalRealMinutes;
      }

      // APH期間の残りミリ秒 (リアルタイムベース)
      // APH期間はリアルタイムの速度で進むため、リアルタイムの残り時間を計算
      const endOfRealDay = moment(localTime).endOf("day"); // 今日の終わりのmomentオブジェクト
      let remainingRealMs;

      if (currentNormalAphDayDurationMinutes === 0) {
        // APHが丸1日
        remainingRealMs = endOfRealDay.diff(localTime);
      } else if (aphPeriodTotalRealMinutes === 0) {
        // APH期間なし
        remainingRealMs = 0;
      } else {
        // APH期間の終了時刻を計算 (今日の normalAphDayDurationMinutes 後から aphPeriodTotalRealMinutes 後まで)
        const aphStartDateTime = moment(localTime)
          .startOf("day")
          .add(currentNormalAphDayDurationMinutes, "minutes");
        const aphEndDateTime = moment(aphStartDateTime).add(
          aphPeriodTotalRealMinutes,
          "minutes",
        );
        remainingRealMs = Math.max(0, aphEndDateTime.diff(localTime));
      }

      if (remainingRealMs > 0) {
        const remainingSecondsTotal = Math.floor(remainingRealMs / 1000);
        const remainingH = Math.floor(remainingSecondsTotal / 3600);
        const remainingM = Math.floor((remainingSecondsTotal % 3600) / 60);
        const remainingS = remainingSecondsTotal % 60;
        elements.digitalAphRemaining.textContent = `APH Remaining: ${String(remainingH).padStart(2, "0")}:${String(remainingM).padStart(2, "0")}:${String(remainingS).padStart(2, "0")}`;
        elements.digitalAphRemaining.style.display = "block";
      } else {
        // APH期間が終了、またはAPH期間がない場合
        elements.digitalAphRemaining.textContent = `APH Remaining: 00:00:00`; // 念のため表示をリセット
        elements.digitalAphRemaining.style.display = "block"; // APH期間が終わった直後も00:00:00を表示する
      }
    } else {
      elements.digitalAphRemaining.style.display = "none"; // APH期間外なら非表示
    }
  }
  // **** ここまで残り時間表示のロジック ****

  if (elements.ahSector) {
    if (isPersonalizedAhPeriod) {
      drawAhPersonalizedSector(
        ahSectorStartAngleDegrees,
        ahSectorSweepAngleDegrees,
      );
      elements.ahSector.style.display = "block";
    } else {
      elements.ahSector.style.display = "none";
      if (elements.ahSectorIndicatorLine) {
        elements.ahSectorIndicatorLine.style.display = "none";
      }
    }
  }

  // **** タイトルとテーマの更新ロジック ****
  if (elements.personalizedAhTitle) {
    if (isPersonalizedAhPeriod) {
      elements.personalizedAhTitle.textContent = "You are now in APH Period.";
      elements.personalizedAhTitle.style.color = "var(--dark-text)"; // components.css の --dark-text (白) を想定
    } else {
      elements.personalizedAhTitle.textContent = "Personalized AH Clock";
      elements.personalizedAhTitle.style.color = ""; // 通常の色に戻す (CSSで定義された色)
    }
  }

  document.body.classList.toggle("inverted", isPersonalizedAhPeriod);
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

  initializeTimezoneSelect(); // タイムゾーンを先に初期化
  initializeSlider(); // 次にスライダー（表示にタイムゾーン情報を使わないため順不同でも可）
  drawTicks(); // 目盛り描画
  // initializeSettingsPanelToggle(); // ← 古い関数呼び出しなので削除
  initializeViewToggle();      // ★ 新しいビュー切り替え初期化関数を呼び出す


  if (state.animationFrameId) cancelAnimationFrame(state.animationFrameId);
  updatePersonalizedClock(); // 時計の更新ループを開始
}

initialize();

window.addEventListener("unload", () => {
  if (state.animationFrameId) {
    cancelAnimationFrame(state.animationFrameId);
  }
});
