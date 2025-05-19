// public/js/scaling-utils.js
import { LOCAL_STORAGE_KEY_APH_DURATION } from './personalized-ah-clock-ui.js'; // personalized-ah-clock-ui.js で定義されているキーを再利用
// 仮にタイムゾーンも localStorage に保存される場合のキー (personalized-ah-clock-ui.js での保存が必要)
const LOCAL_STORAGE_KEY_SELECTED_TIMEZONE = 'personalizedAhSelectedTimezone'; // このキー名は合わせる必要があります

/**
 * 現在の有効なスケールファクターと、AH期間中か否かを取得します。
 * @returns {{ scaleFactor: number, isAhPeriod: boolean, normalAphDayDurationMinutes: number }}
 */
export function getCurrentScalingInfo() {
    // localStorageから設定値を取得
    const savedDurationString = localStorage.getItem(LOCAL_STORAGE_KEY_APH_DURATION);
    // デフォルト値を Customizable Main Clock の初期値に合わせる (例: 23時間 = 1380分)
    let normalAphDayDurationMinutes = savedDurationString ? parseInt(savedDurationString, 10) : 1380;

    // 値のバリデーション (0分から1440分)
    normalAphDayDurationMinutes = Math.max(0, Math.min(normalAphDayDurationMinutes, 1440));

    // タイムゾーンの取得 (保存されていなければデフォルトUTC)
    // 注意: personalized-ah-clock-ui.js がこのキーでタイムゾーンを保存していることを確認してください。
    // 保存していない場合、デフォルトを使用するか、別の方法で取得する必要があります。
    const selectedTimezone = localStorage.getItem(LOCAL_STORAGE_KEY_SELECTED_TIMEZONE) || 'UTC';

    const now = new Date();
    const localTime = moment(now).tz(selectedTimezone); // Moment.js が必要

    const realMillisecondsInDay = (localTime.hours() * 3600 + localTime.minutes() * 60 + localTime.seconds()) * 1000 + localTime.milliseconds();
    const normalAphDayDurationMs = normalAphDayDurationMinutes * 60 * 1000;

    const isAhPeriod = realMillisecondsInDay >= normalAphDayDurationMs;

    let scaleFactor;
    if (isAhPeriod) {
        scaleFactor = 1; // AH期間中はスケールファクター1
    } else {
        const normalAphDayDurationHours = normalAphDayDurationMinutes / 60;
        if (normalAphDayDurationHours === 0) {
            // 通常期間が0分の場合、実質常にAH期間と同じなのでスケール1
            // (isAhPeriodがtrueになるはずだが、念のため)
            scaleFactor = 1;
        } else if (normalAphDayDurationHours === 24) {
            scaleFactor = 1; // 通常期間が24時間の場合もスケール1
        } else {
            scaleFactor = 24 / normalAphDayDurationHours;
        }
    }

    return {
        scaleFactor: scaleFactor,
        isAhPeriod: isAhPeriod,
        normalAphDayDurationMinutes: normalAphDayDurationMinutes // 参考情報として返す
    };
}