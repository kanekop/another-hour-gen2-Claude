// public/js/scaling-utils.js
import { LOCAL_STORAGE_KEY_APH_DURATION, LOCAL_STORAGE_KEY_SELECTED_TIMEZONE } from './personalized-ah-clock-ui.js';
//                                        ↑↑↑ こちらもインポート

/**
 * 現在の有効なスケールファクターと、AH期間中か否かを取得します。
 * @returns {{ scaleFactor: number, isAhPeriod: boolean, normalAphDayDurationMinutes: number }}
 */
export function getCurrentScalingInfo() {
    const savedDurationString = localStorage.getItem(LOCAL_STORAGE_KEY_APH_DURATION);
    let normalAphDayDurationMinutes = savedDurationString ? parseInt(savedDurationString, 10) : 1380;
    normalAphDayDurationMinutes = Math.max(0, Math.min(normalAphDayDurationMinutes, 1440));

    // ★ LOCAL_STORAGE_KEY_SELECTED_TIMEZONE を使用
    const selectedTimezone = localStorage.getItem(LOCAL_STORAGE_KEY_SELECTED_TIMEZONE) || 'UTC';

    const now = new Date();
    if (typeof moment === 'undefined' || !moment.tz) {
        console.error("Moment.js or Moment Timezone not loaded for scaling-utils.js");
        // momentがなければデフォルトのスケールファクターを返すなどのフォールバック
        return { scaleFactor: 1, isAhPeriod: false, normalAphDayDurationMinutes: normalAphDayDurationMinutes };
    }
    const localTime = moment(now).tz(selectedTimezone);

    const realMillisecondsInDay = (localTime.hours() * 3600 + localTime.minutes() * 60 + localTime.seconds()) * 1000 + localTime.milliseconds();
    const normalAphDayDurationMs = normalAphDayDurationMinutes * 60 * 1000;

    const isAhPeriod = realMillisecondsInDay >= normalAphDayDurationMs;

    let scaleFactor;
    if (isAhPeriod) {
        scaleFactor = 1;
    } else {
        const normalAphDayDurationHours = normalAphDayDurationMinutes / 60;
        if (normalAphDayDurationHours === 0) {
            scaleFactor = 1; // isAhPeriod が true になるはず
        } else if (normalAphDayDurationHours === 24) {
            scaleFactor = 1;
        } else {
            scaleFactor = 24 / normalAphDayDurationHours;
        }
    }

    return {
        scaleFactor: scaleFactor,
        isAhPeriod: isAhPeriod,
        normalAphDayDurationMinutes: normalAphDayDurationMinutes
    };
}